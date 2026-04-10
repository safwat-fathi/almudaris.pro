import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveOtpTable1775368000000 implements MigrationInterface {
    name = 'RemoveOtpTable1775368000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "otps"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "otps" ("id" SERIAL NOT NULL, "phone" character varying NOT NULL, "hashedOtp" character varying NOT NULL, "attempts" integer NOT NULL DEFAULT '0', "isUsed" boolean NOT NULL DEFAULT false, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`);
    }
}
