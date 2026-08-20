import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangesInShippingEntity1786578341355 implements MigrationInterface {
    name = 'ChangesInShippingEntity1786578341355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipping" DROP CONSTRAINT "FK_ca6a07e6f19abf7a0f2fadf62eb"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_a9e568150eecef07380e7f5fc7c"`);
        await queryRunner.query(`ALTER TABLE "shipping" DROP CONSTRAINT "REL_ca6a07e6f19abf7a0f2fadf62e"`);
        await queryRunner.query(`ALTER TABLE "shipping" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "REL_a9e568150eecef07380e7f5fc7"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "shippingAddressId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "shippingAddressId" integer`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "REL_a9e568150eecef07380e7f5fc7" UNIQUE ("shippingAddressId")`);
        await queryRunner.query(`ALTER TABLE "shipping" ADD "orderId" integer`);
        await queryRunner.query(`ALTER TABLE "shipping" ADD CONSTRAINT "REL_ca6a07e6f19abf7a0f2fadf62e" UNIQUE ("orderId")`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_a9e568150eecef07380e7f5fc7c" FOREIGN KEY ("shippingAddressId") REFERENCES "shipping"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipping" ADD CONSTRAINT "FK_ca6a07e6f19abf7a0f2fadf62eb" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
