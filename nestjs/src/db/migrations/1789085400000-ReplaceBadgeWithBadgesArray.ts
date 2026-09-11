import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplaceBadgeWithBadgesArray1789085400000 implements MigrationInterface {
  name = 'ReplaceBadgeWithBadgesArray1789085400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 0. Rebuild the featured-sort index to match the entity's new @Index
    //    decorator (plain ascending — TypeORM's decorator can't express
    //    DESC per column). Postgres scans B-tree indexes backwards for
    //    free, so ORDER BY ... DESC still uses this efficiently; this
    //    purely stops `migration:generate` from flagging false drift on
    //    every future run.
    await queryRunner.query(`
      DROP INDEX "IDX_products_isFeatured_createdAt"
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_products_isFeatured_createdAt"
      ON "products" ("isFeatured", "createdAt")
    `);

    // 1. Create the enum type. If you had any badge value in the DB other
    //    than the six below, this migration will fail at step 3 (invalid
    //    enum literal) rather than silently dropping data — run
    //    `SELECT DISTINCT badge FROM products WHERE badge IS NOT NULL;`
    //    first if you're not sure everything fits.
    await queryRunner.query(`
      CREATE TYPE "products_badges_enum" AS ENUM (
        'new', 'hot', 'sale', 'bestseller', 'limited', 'trending'
      )
    `);

    // 2. Add the new column, nullable — no backfill needed yet.
    await queryRunner.query(`
      ALTER TABLE "products" ADD "badges" "products_badges_enum"[]
    `);

    // 3. Migrate existing single-value badges into a one-element array.
    //    Rows with badge IS NULL stay NULL.
    await queryRunner.query(`
      UPDATE "products"
      SET "badges" = ARRAY["badge"]::"products_badges_enum"[]
      WHERE "badge" IS NOT NULL
    `);

    // 4. Drop the old column now that its data lives in "badges".
    await queryRunner.query(`
      ALTER TABLE "products" DROP COLUMN "badge"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse: recreate "badge", take the first element of "badges" back
    // (lossy if a row ever had more than one badge — expected, this is a
    // one-way schema upgrade).
    await queryRunner.query(`
      ALTER TABLE "products" ADD "badge" character varying(50)
    `);
    await queryRunner.query(`
      UPDATE "products" SET "badge" = "badges"[1] WHERE "badges" IS NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "products" DROP COLUMN "badges"
    `);
    await queryRunner.query(`
      DROP TYPE "products_badges_enum"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_products_isFeatured_createdAt"
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_products_isFeatured_createdAt"
      ON "products" ("isFeatured" DESC, "createdAt" DESC)
    `);
  }
}
