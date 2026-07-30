import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhoneNumberToUser1785277201121 implements MigrationInterface {
    name = 'AddPhoneNumberToUser1785277201121'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add as nullable first so the 4 existing rows don't violate NOT NULL
        await queryRunner.query(`ALTER TABLE "users" ADD "phoneNumber" character varying(15)`);

        // Give each existing row a unique placeholder so NOT NULL + UNIQUE
        // can be applied below. Go back and set real phone numbers for
        // these rows afterward via SQL/pgAdmin.
        await queryRunner.query(`
            UPDATE "users"
            SET "phoneNumber" = '0000' || lpad(id::text, 11, '0')
            WHERE "phoneNumber" IS NULL
        `);

        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "phoneNumber" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_1e3d0240b49c40521aaeb953293" UNIQUE ("phoneNumber")`);
        await queryRunner.query(`CREATE INDEX "IDX_1e3d0240b49c40521aaeb95329" ON "users" ("phoneNumber") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_1e3d0240b49c40521aaeb95329"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_1e3d0240b49c40521aaeb953293"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phoneNumber"`);
    }

}