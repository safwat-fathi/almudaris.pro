import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1775363057309 implements MigrationInterface {
    name = 'InitSchema1775363057309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('teacher', 'parent')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'parent', "name" text NOT NULL, "phone" text, "password" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "otps" ("id" SERIAL NOT NULL, "phone" character varying NOT NULL, "hashedOtp" character varying NOT NULL, "attempts" integer NOT NULL DEFAULT '0', "isUsed" boolean NOT NULL DEFAULT false, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "otps"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
