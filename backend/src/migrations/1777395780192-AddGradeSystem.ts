import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGradeSystem1777395780192 implements MigrationInterface {
    name = 'AddGradeSystem1777395780192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_education_stage_enum" AS ENUM('PRIMARY', 'PREPARATORY', 'SECONDARY', 'UNASSIGNED')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "education_stage" "public"."users_education_stage_enum" NOT NULL DEFAULT 'UNASSIGNED'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "education_year" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "legacy_grade" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "grade_needs_review" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`CREATE TYPE "public"."homework_education_stage_enum" AS ENUM('PRIMARY', 'PREPARATORY', 'SECONDARY', 'UNASSIGNED')`);
        await queryRunner.query(`ALTER TABLE "homework" ADD "education_stage" "public"."homework_education_stage_enum" NOT NULL DEFAULT 'UNASSIGNED'`);
        await queryRunner.query(`ALTER TABLE "homework" ADD "education_year" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`CREATE TYPE "public"."groups_education_stage_enum" AS ENUM('PRIMARY', 'PREPARATORY', 'SECONDARY', 'UNASSIGNED')`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "education_stage" "public"."groups_education_stage_enum" NOT NULL DEFAULT 'UNASSIGNED'`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "education_year" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`CREATE INDEX "IDX_4fb3265d4bb62838a02f6f70cc" ON "users" ("education_stage", "education_year") `);
        await queryRunner.query(`CREATE INDEX "IDX_ca7460a053e7d64a349aa25ce6" ON "homework" ("education_stage", "education_year") `);
        await queryRunner.query(`CREATE INDEX "IDX_d9403e6262bf3d3d44b7efe1d5" ON "groups" ("education_stage", "education_year") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "CHK_c5b4cf2b426dc8eab2db36b41b" CHECK ((
  ("education_stage" = 'PRIMARY' AND "education_year" BETWEEN 1 AND 6)
  OR ("education_stage" IN ('PREPARATORY', 'SECONDARY') AND "education_year" BETWEEN 1 AND 3)
  OR ("education_stage" = 'UNASSIGNED' AND "education_year" = 0)
))`);
        await queryRunner.query(`ALTER TABLE "homework" ADD CONSTRAINT "CHK_76122092c3a3bdc95150196f1b" CHECK ((
  ("education_stage" = 'PRIMARY' AND "education_year" BETWEEN 1 AND 6)
  OR ("education_stage" IN ('PREPARATORY', 'SECONDARY') AND "education_year" BETWEEN 1 AND 3)
  OR ("education_stage" = 'UNASSIGNED' AND "education_year" = 0)
))`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "CHK_10ef87a85ca7b03992e6fc8dc5" CHECK ((
  ("education_stage" = 'PRIMARY' AND "education_year" BETWEEN 1 AND 6)
  OR ("education_stage" IN ('PREPARATORY', 'SECONDARY') AND "education_year" BETWEEN 1 AND 3)
  OR ("education_stage" = 'UNASSIGNED' AND "education_year" = 0)
))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "CHK_10ef87a85ca7b03992e6fc8dc5"`);
        await queryRunner.query(`ALTER TABLE "homework" DROP CONSTRAINT "CHK_76122092c3a3bdc95150196f1b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "CHK_c5b4cf2b426dc8eab2db36b41b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d9403e6262bf3d3d44b7efe1d5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ca7460a053e7d64a349aa25ce6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4fb3265d4bb62838a02f6f70cc"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "education_year"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "education_stage"`);
        await queryRunner.query(`DROP TYPE "public"."groups_education_stage_enum"`);
        await queryRunner.query(`ALTER TABLE "homework" DROP COLUMN "education_year"`);
        await queryRunner.query(`ALTER TABLE "homework" DROP COLUMN "education_stage"`);
        await queryRunner.query(`DROP TYPE "public"."homework_education_stage_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "grade_needs_review"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "legacy_grade"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "education_year"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "education_stage"`);
        await queryRunner.query(`DROP TYPE "public"."users_education_stage_enum"`);
    }

}
