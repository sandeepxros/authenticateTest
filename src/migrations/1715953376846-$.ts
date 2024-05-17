import { MigrationInterface, QueryRunner } from "typeorm";

export class  $1715953376846 implements MigrationInterface {
    name = ' $1715953376846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "spam_report" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "spam_report" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "spam_report" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "phone_number" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "phone_number" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "phone_number" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "phone_number" ADD "isRegisterd" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "phone_number" DROP COLUMN "isRegisterd"`);
        await queryRunner.query(`ALTER TABLE "phone_number" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "phone_number" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "phone_number" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "spam_report" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "spam_report" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "spam_report" DROP COLUMN "created_at"`);
    }

}
