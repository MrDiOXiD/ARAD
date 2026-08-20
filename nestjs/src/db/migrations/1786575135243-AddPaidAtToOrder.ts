import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaidAtToOrder1786575135243 implements MigrationInterface {
    name = 'AddPaidAtToOrder1786575135243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "paidAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "paidAt"`);
    }
}
