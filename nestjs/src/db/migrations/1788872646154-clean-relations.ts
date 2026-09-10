import { MigrationInterface, QueryRunner } from "typeorm";

export class CleanRelations1788872646154 implements MigrationInterface {
    name = 'CleanRelations1788872646154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_order_shipping"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "familyName" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "familyName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_order_shipping" FOREIGN KEY ("shippingAddressId") REFERENCES "shipping"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
