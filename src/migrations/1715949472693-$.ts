import { MigrationInterface, QueryRunner } from "typeorm";

export class  $1715949472693 implements MigrationInterface {
    name = ' $1715949472693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "spam_report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "comment" character varying NOT NULL, "userId" uuid, "phoneNumberId" uuid, CONSTRAINT "PK_b54140d37b012f41e0914821a02" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "phone_number" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "number" character varying NOT NULL, "label" character varying NOT NULL, "contactId" uuid, CONSTRAINT "PK_c16f58426537a660b3f2a26e983" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contact" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "email" character varying, "countryCode" character varying, "regionCode" character varying, "countryName" character varying, "isActive" boolean NOT NULL DEFAULT true, "password" character varying NOT NULL, CONSTRAINT "UQ_f2578043e491921209f5dadd080" UNIQUE ("phoneNumber"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "spam_report" ADD CONSTRAINT "FK_719575ff0f9c060b13fdf736e52" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "spam_report" ADD CONSTRAINT "FK_3bd554737f1e124c7efa64425b2" FOREIGN KEY ("phoneNumberId") REFERENCES "phone_number"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "phone_number" ADD CONSTRAINT "FK_069067410ee19d423487a189e4d" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_e7e34fa8e409e9146f4729fd0cb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_e7e34fa8e409e9146f4729fd0cb"`);
        await queryRunner.query(`ALTER TABLE "phone_number" DROP CONSTRAINT "FK_069067410ee19d423487a189e4d"`);
        await queryRunner.query(`ALTER TABLE "spam_report" DROP CONSTRAINT "FK_3bd554737f1e124c7efa64425b2"`);
        await queryRunner.query(`ALTER TABLE "spam_report" DROP CONSTRAINT "FK_719575ff0f9c060b13fdf736e52"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "contact"`);
        await queryRunner.query(`DROP TABLE "phone_number"`);
        await queryRunner.query(`DROP TABLE "spam_report"`);
    }

}
