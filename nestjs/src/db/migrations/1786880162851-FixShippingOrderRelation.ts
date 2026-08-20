import { MigrationInterface, QueryRunner } from "typeorm";

export class FixShippingOrderRelation1786880162851 implements MigrationInterface {
    name = 'FixShippingOrderRelation1786880162851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipping" DROP CONSTRAINT "FK_ca6a07e6f19abf7a0f2fadf62eb"`);
        await queryRunner.query(`ALTER TABLE "shipping" DROP CONSTRAINT "REL_ca6a07e6f19abf7a0f2fadf62e"`);
        await queryRunner.query(`ALTER TABLE "shipping" DROP COLUMN "orderId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipping" ADD "orderId" integer`);
        await queryRunner.query(`ALTER TABLE "shipping" ADD CONSTRAINT "REL_ca6a07e6f19abf7a0f2fadf62e" UNIQUE ("orderId")`);
        await queryRunner.query(`ALTER TABLE "shipping" ADD CONSTRAINT "FK_ca6a07e6f19abf7a0f2fadf62eb" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
