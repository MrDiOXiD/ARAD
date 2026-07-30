import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGoogleId1785316629220 implements MigrationInterface {
    name = 'AddGoogleId1785316629220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_addresses" ("id" SERIAL NOT NULL, "tag" character varying(30) NOT NULL, "name" character varying NOT NULL, "phone" character varying(15) NOT NULL, "city" character varying NOT NULL, "addressLine" text NOT NULL, "postalCode" character varying(10) NOT NULL, "isDefault" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_8abbeb5e3239ff7877088ffc25b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_781afdedafe920f331f6229cb6" ON "user_addresses" ("userId") `);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" SERIAL NOT NULL, "tokenHash" character varying NOT NULL, "familyId" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "revoked" boolean NOT NULL DEFAULT false, "createdByIp" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c25bc63d248ca90e8dcc1d92d0" ON "refresh_tokens" ("tokenHash") `);
        await queryRunner.query(`CREATE INDEX "IDX_40e9a8b923a1b3fb4429a5c624" ON "refresh_tokens" ("familyId") `);
await queryRunner.query(`ALTER TABLE "shipping" ADD "postalCode" character varying(10)`);
await queryRunner.query(`UPDATE "shipping" SET "postalCode" = '0000000000' WHERE "postalCode" IS NULL`);
await queryRunner.query(`ALTER TABLE "shipping" ALTER COLUMN "postalCode" SET NOT NULL`);        await queryRunner.query(`ALTER TABLE "users" ADD "googleId" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_f382af58ab36057334fb262efd5" UNIQUE ("googleId")`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "phoneNumber" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_addresses" ADD CONSTRAINT "FK_781afdedafe920f331f6229cb62" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`);
        await queryRunner.query(`ALTER TABLE "user_addresses" DROP CONSTRAINT "FK_781afdedafe920f331f6229cb62"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "phoneNumber" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_f382af58ab36057334fb262efd5"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "googleId"`);
        await queryRunner.query(`ALTER TABLE "shipping" DROP COLUMN "postalCode"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_40e9a8b923a1b3fb4429a5c624"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c25bc63d248ca90e8dcc1d92d0"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_781afdedafe920f331f6229cb6"`);
        await queryRunner.query(`DROP TABLE "user_addresses"`);
    }

}
