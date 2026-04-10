import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePasswordRequired1775375515352 implements MigrationInterface {
    name = 'UpdatePasswordRequired1775375515352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`);
    }

}
