import { MigrationInterface, QueryRunner } from "typeorm";

export class  $1716038440377 implements MigrationInterface {
    name = ' $1716038440377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "spam_report" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "comment" character varying NOT NULL, "reportedById" uuid, "phoneNumberId" uuid, CONSTRAINT "PK_b54140d37b012f41e0914821a02" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "phone_number" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phoneNumber" character varying NOT NULL, "countryCode" character varying, "regionCode" character varying, "countryName" character varying, "label" character varying, CONSTRAINT "UQ_aca767f2f6be1f8f88e2d8bdeb6" UNIQUE ("phoneNumber"), CONSTRAINT "PK_c16f58426537a660b3f2a26e983" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contact" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying, "lastName" character varying, "email" character varying, "isRegistered" boolean NOT NULL DEFAULT false, "phoneNumbersId" uuid, "userId" uuid, "addedById" uuid, CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "password" character varying NOT NULL, "phoneId" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "spam_report" ADD CONSTRAINT "FK_aba706036b6acf11cce60bc1993" FOREIGN KEY ("reportedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "spam_report" ADD CONSTRAINT "FK_3bd554737f1e124c7efa64425b2" FOREIGN KEY ("phoneNumberId") REFERENCES "phone_number"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_36db2bf96c100274e09c4e15c08" FOREIGN KEY ("phoneNumbersId") REFERENCES "phone_number"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_e7e34fa8e409e9146f4729fd0cb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_621e97271900724ddf75d033d5c" FOREIGN KEY ("addedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_621e97271900724ddf75d033d5c"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_e7e34fa8e409e9146f4729fd0cb"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_36db2bf96c100274e09c4e15c08"`);
        await queryRunner.query(`ALTER TABLE "spam_report" DROP CONSTRAINT "FK_3bd554737f1e124c7efa64425b2"`);
        await queryRunner.query(`ALTER TABLE "spam_report" DROP CONSTRAINT "FK_aba706036b6acf11cce60bc1993"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "contact"`);
        await queryRunner.query(`DROP TABLE "phone_number"`);
        await queryRunner.query(`DROP TABLE "spam_report"`);
    }

}
