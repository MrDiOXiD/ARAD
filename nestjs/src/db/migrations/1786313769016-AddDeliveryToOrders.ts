import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeliveryToOrders1786313769016 implements MigrationInterface {
  name = "AddDeliveryToOrders1786313769016";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "delivery_methods" ("id" SERIAL NOT NULL, "label" character varying NOT NULL, "type" character varying(20) NOT NULL, "baseFee" numeric(12,0) NOT NULL DEFAULT '0', "perItemFee" numeric(12,0) NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_760e4da6c00c0555428cb4d0617" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "deliveryFee" numeric(12,0) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "order" ADD "requestedDeliveryDate" date`);
    await queryRunner.query(
      `UPDATE "order" SET "requestedDeliveryDate" = CURRENT_DATE + INTERVAL '3 days' WHERE "requestedDeliveryDate" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "requestedDeliveryDate" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "paymentMethod" character varying(10) NOT NULL DEFAULT 'online'`,
    );
    await queryRunner.query(`ALTER TABLE "order" ADD "deliveryMethodId" integer`);
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_8d0c2b0fd7448175d4c5b034885" FOREIGN KEY ("deliveryMethodId") REFERENCES "delivery_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_8d0c2b0fd7448175d4c5b034885"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deliveryMethodId"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "paymentMethod"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "requestedDeliveryDate"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deliveryFee"`);
    await queryRunner.query(`DROP TABLE "delivery_methods"`);
  }
}
