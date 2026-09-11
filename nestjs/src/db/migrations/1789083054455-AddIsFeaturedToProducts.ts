import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsFeaturedToProducts1789083054455 implements MigrationInterface {
  name = 'AddIsFeaturedToProducts1789083054455';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Add nullable first — table has existing rows, a plain NOT NULL
    //    add would fail against them.
    await queryRunner.query(`
      ALTER TABLE "products" ADD "isFeatured" boolean
    `);

    // 2. Backfill existing rows.
    await queryRunner.query(`
      UPDATE "products" SET "isFeatured" = false WHERE "isFeatured" IS NULL
    `);

    // 3. Now safe to enforce NOT NULL + set the default for future inserts.
    await queryRunner.query(`
      ALTER TABLE "products" ALTER COLUMN "isFeatured" SET DEFAULT false
    `);
    await queryRunner.query(`
      ALTER TABLE "products" ALTER COLUMN "isFeatured" SET NOT NULL
    `);

    // 4. Composite index — sort=featured orders by (isFeatured DESC, createdAt DESC).
    await queryRunner.query(`
      CREATE INDEX "IDX_products_isFeatured_createdAt"
      ON "products" ("isFeatured" DESC, "createdAt" DESC)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_products_isFeatured_createdAt"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "isFeatured"`);
  }
}
