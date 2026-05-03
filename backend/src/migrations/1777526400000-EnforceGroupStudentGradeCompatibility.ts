import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnforceGroupStudentGradeCompatibility1777526400000 implements MigrationInterface {
  name = 'EnforceGroupStudentGradeCompatibility1777526400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      DECLARE
        deleted_count integer;
      BEGIN
        WITH invalid_group_students AS (
          SELECT gs."group_id", gs."student_id"
          FROM "group_students" gs
          INNER JOIN "groups" g ON g."id" = gs."group_id"
          LEFT JOIN "students" s ON s."user_id" = gs."student_id"
          WHERE s."user_id" IS NULL
            OR s."education_stage"::text <> g."education_stage"::text
            OR s."education_year" <> g."education_year"
        )
        DELETE FROM "group_students" gs
        USING invalid_group_students invalid
        WHERE gs."group_id" = invalid."group_id"
          AND gs."student_id" = invalid."student_id";

        GET DIAGNOSTICS deleted_count = ROW_COUNT;
        RAISE NOTICE 'Deleted % invalid group_students grade assignment rows',
          deleted_count;
      END;
      $$
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION "public"."validate_group_student_grade"()
      RETURNS trigger AS $$
      DECLARE
        group_stage text;
        group_year integer;
        student_stage text;
        student_year integer;
        student_name text;
      BEGIN
        SELECT
          g."education_stage"::text,
          g."education_year"
        INTO group_stage, group_year
        FROM "groups" g
        WHERE g."id" = NEW."group_id";

        SELECT
          s."education_stage"::text,
          s."education_year",
          u."name"
        INTO student_stage, student_year, student_name
        FROM "students" s
        INNER JOIN "users" u ON u."id" = s."user_id"
        WHERE s."user_id" = NEW."student_id";

        IF student_stage IS NULL THEN
          RAISE EXCEPTION
            'Student % cannot be assigned to group % because no student profile exists',
            NEW."student_id",
            NEW."group_id";
        END IF;

        IF student_stage <> group_stage OR student_year <> group_year THEN
          RAISE EXCEPTION
            'Student % (%) grade %/% does not match group % grade %/%',
            COALESCE(student_name, NEW."student_id"::text),
            NEW."student_id",
            student_stage,
            student_year,
            NEW."group_id",
            group_stage,
            group_year;
        END IF;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

    await queryRunner.query(`
      CREATE TRIGGER "TRG_validate_group_student_grade"
      BEFORE INSERT OR UPDATE OF "group_id", "student_id"
      ON "group_students"
      FOR EACH ROW
      EXECUTE FUNCTION "public"."validate_group_student_grade"()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS "TRG_validate_group_student_grade" ON "group_students"`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS "public"."validate_group_student_grade"`,
    );
  }
}
