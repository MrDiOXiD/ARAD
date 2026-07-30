import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSourceAddressToShipping1785366704840 implements MigrationInterface {
    name = 'AddSourceAddressToShipping1785366704840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipping" ADD "sourceAddressId" integer`);
        await queryRunner.query(`ALTER TABLE "shipping" ADD CONSTRAINT "FK_385fc9b55da0439e972da1d9181" FOREIGN KEY ("sourceAddressId") REFERENCES "user_addresses"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipping" DROP CONSTRAINT "FK_385fc9b55da0439e972da1d9181"`);
        await queryRunner.query(`ALTER TABLE "shipping" DROP COLUMN "sourceAddressId"`);
    }

}
