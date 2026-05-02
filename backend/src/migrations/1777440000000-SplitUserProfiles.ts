import { MigrationInterface, QueryRunner } from 'typeorm';

export class SplitUserProfiles1777440000000 implements MigrationInterface {
  name = 'SplitUserProfiles1777440000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."teachers_education_stage_enum" AS ENUM('PRIMARY', 'PREPARATORY', 'SECONDARY', 'UNASSIGNED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."students_education_stage_enum" AS ENUM('PRIMARY', 'PREPARATORY', 'SECONDARY', 'UNASSIGNED')`,
    );

    await queryRunner.query(
      `CREATE TABLE "teachers" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "education_stage" "public"."teachers_education_stage_enum" NOT NULL DEFAULT 'UNASSIGNED', "education_year" integer NOT NULL DEFAULT '0', "invite_code" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_9b0c5c067f8985a825fd66c2a9d" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `CREATE TABLE "students" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "parent_id" integer, "education_stage" "public"."students_education_stage_enum" NOT NULL DEFAULT 'UNASSIGNED', "education_year" integer NOT NULL DEFAULT '0', "legacy_grade" text, "grade_needs_review" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `ALTER TABLE "teachers" ADD CONSTRAINT "CHK_33b763065f1646089f5879e25f" CHECK ((("education_stage" = 'PRIMARY' AND "education_year" BETWEEN 1 AND 6) OR ("education_stage" IN ('PREPARATORY', 'SECONDARY') AND "education_year" BETWEEN 1 AND 3) OR ("education_stage" = 'UNASSIGNED' AND "education_year" = 0)))`,
    );
    await queryRunner.query(
      `ALTER TABLE "students" ADD CONSTRAINT "CHK_e6f61550e2bc9f4c83b819d0f8" CHECK ((("education_stage" = 'PRIMARY' AND "education_year" BETWEEN 1 AND 6) OR ("education_stage" IN ('PREPARATORY', 'SECONDARY') AND "education_year" BETWEEN 1 AND 3) OR ("education_stage" = 'UNASSIGNED' AND "education_year" = 0)))`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_c290b2dc072c947d98f34c0291" ON "teachers" ("education_stage", "education_year")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9a58db74e13f1770876525f34e" ON "students" ("education_stage", "education_year")`,
    );

    await queryRunner.query(
      `ALTER TABLE "teachers" ADD CONSTRAINT "FK_48880e8c0f8de3f5bbca5c32f71" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "students" ADD CONSTRAINT "FK_1f3f6a7a6a5e93a273f40f10075" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "students" ADD CONSTRAINT "FK_e4f0f35d0f0ad59d6df5b8f9ce5" FOREIGN KEY ("parent_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(`
      INSERT INTO "teachers" ("user_id", "education_stage", "education_year", "invite_code", "created_at", "updated_at", "deleted_at")
      SELECT
        u."id",
        u."education_stage"::text::"public"."teachers_education_stage_enum",
        u."education_year",
        u."invite_code",
        u."created_at",
        u."updated_at",
        u."deleted_at"
      FROM "users" u
      WHERE u."role" = 'teacher'
    `);

    await queryRunner.query(`
      INSERT INTO "students" ("user_id", "parent_id", "education_stage", "education_year", "legacy_grade", "grade_needs_review", "created_at", "updated_at", "deleted_at")
      SELECT
        u."id",
        u."parent_id",
        u."education_stage"::text::"public"."students_education_stage_enum",
        u."education_year",
        u."legacy_grade",
        u."grade_needs_review",
        u."created_at",
        u."updated_at",
        u."deleted_at"
      FROM "users" u
      WHERE u."role" = 'student'
    `);

    const duplicateInviteCodesResult: unknown = await queryRunner.query(`
      SELECT "invite_code"
      FROM "teachers"
      WHERE "invite_code" IS NOT NULL
      GROUP BY "invite_code"
      HAVING COUNT(*) > 1
    `);

    const duplicateInviteCodes = Array.isArray(duplicateInviteCodesResult)
      ? duplicateInviteCodesResult
      : [];

    if (duplicateInviteCodes.length > 0) {
      throw new Error(
        'Duplicate teacher invite codes detected during backfill',
      );
    }

    await queryRunner.query(
      `ALTER TABLE "teachers" ADD CONSTRAINT "UQ_48880e8c0f8de3f5bbca5c32f71" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "students" ADD CONSTRAINT "UQ_1f3f6a7a6a5e93a273f40f10075" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "teachers" ADD CONSTRAINT "UQ_98e44f4b65de99358f0e2ff08f7" UNIQUE ("invite_code")`,
    );

    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "FK_03b7ad8596195af69eb19034116"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "CHK_1998031fe52e5d9e6473e0d20f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "CHK_cb20251a94a71ade75ea1f69b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "CHK_c5b4cf2b426dc8eab2db36b41b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "UQ_a19e76921d5f8829d706a931026"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_4fb3265d4bb62838a02f6f70cc"`,
    );

    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "invite_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "parent_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "education_stage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "education_year"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "legacy_grade"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "grade_needs_review"`,
    );

    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."users_education_stage_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_education_stage_enum" AS ENUM('PRIMARY', 'PREPARATORY', 'SECONDARY', 'UNASSIGNED')`,
    );

    await queryRunner.query(
      `ALTER TABLE "users" ADD "education_stage" "public"."users_education_stage_enum" NOT NULL DEFAULT 'UNASSIGNED'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "education_year" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "legacy_grade" text`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "grade_needs_review" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "invite_code" text`);
    await queryRunner.query(`ALTER TABLE "users" ADD "parent_id" integer`);

    await queryRunner.query(`
      UPDATE "users" u
      SET
        "education_stage" = t."education_stage"::text::"public"."users_education_stage_enum",
        "education_year" = t."education_year",
        "invite_code" = t."invite_code"
      FROM "teachers" t
      WHERE u."id" = t."user_id"
        AND u."role" = 'teacher'
    `);

    await queryRunner.query(`
      UPDATE "users" u
      SET
        "education_stage" = s."education_stage"::text::"public"."users_education_stage_enum",
        "education_year" = s."education_year",
        "legacy_grade" = s."legacy_grade",
        "grade_needs_review" = s."grade_needs_review",
        "parent_id" = s."parent_id"
      FROM "students" s
      WHERE u."id" = s."user_id"
        AND u."role" = 'student'
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_4fb3265d4bb62838a02f6f70cc" ON "users" ("education_stage", "education_year")`,
    );

    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "CHK_c5b4cf2b426dc8eab2db36b41b" CHECK ((("education_stage" = 'PRIMARY' AND "education_year" BETWEEN 1 AND 6) OR ("education_stage" IN ('PREPARATORY', 'SECONDARY') AND "education_year" BETWEEN 1 AND 3) OR ("education_stage" = 'UNASSIGNED' AND "education_year" = 0)))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_a19e76921d5f8829d706a931026" UNIQUE ("invite_code")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "CHK_cb20251a94a71ade75ea1f69b6" CHECK ("invite_code" IS NULL OR "role" = 'teacher')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "CHK_1998031fe52e5d9e6473e0d20f" CHECK ("parent_id" IS NULL OR "role" = 'student')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_03b7ad8596195af69eb19034116" FOREIGN KEY ("parent_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "students" DROP CONSTRAINT "FK_e4f0f35d0f0ad59d6df5b8f9ce5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "students" DROP CONSTRAINT "FK_1f3f6a7a6a5e93a273f40f10075"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teachers" DROP CONSTRAINT "FK_48880e8c0f8de3f5bbca5c32f71"`,
    );

    await queryRunner.query(
      `DROP INDEX "public"."IDX_9a58db74e13f1770876525f34e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c290b2dc072c947d98f34c0291"`,
    );

    await queryRunner.query(`DROP TABLE "students"`);
    await queryRunner.query(`DROP TABLE "teachers"`);

    await queryRunner.query(
      `DROP TYPE "public"."students_education_stage_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."teachers_education_stage_enum"`,
    );
  }
}
