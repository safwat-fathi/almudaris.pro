import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGroups1776686503480 implements MigrationInterface {
  name = 'AddGroups1776686503480';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "recurring_series" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "teacher_id" integer NOT NULL, "created_by_id" integer NOT NULL, CONSTRAINT "PK_7fcaea4f0c1df8dd8e52dad90d8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."groups_status_enum" AS ENUM('Scheduled', 'Completed', 'Cancelled')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."groups_location_type_enum" AS ENUM('Online', 'Physical')`,
    );
    await queryRunner.query(
      `CREATE TABLE "groups" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "teacher_id" integer NOT NULL, "title" text, "date" date NOT NULL, "start_time" TIME WITH TIME ZONE NOT NULL, "end_time" TIME WITH TIME ZONE NOT NULL, "duration_minutes" integer NOT NULL, "status" "public"."groups_status_enum" NOT NULL DEFAULT 'Scheduled', "location_type" "public"."groups_location_type_enum" NOT NULL, "location_link" text, "location_place" text, "recurring_series_id" integer, "notes" text, "created_by_id" integer NOT NULL, CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."group_students_attendance_status_enum" AS ENUM('Present', 'Absent', 'Not set')`,
    );
    await queryRunner.query(
      `CREATE TABLE "group_students" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "group_id" integer NOT NULL, "student_id" integer NOT NULL, "student_name" text NOT NULL, "attendance_status" "public"."group_students_attendance_status_enum" NOT NULL DEFAULT 'Not set', "note" text, "note_updated_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2dc2c3c7c14f90c8bd41151548f" PRIMARY KEY ("group_id", "student_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "timezone" text DEFAULT 'Africa/Cairo'`,
    );
    await queryRunner.query(
      `ALTER TABLE "recurring_series" ADD CONSTRAINT "FK_f91f4dd48aefd10d0b30c6efee3" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "recurring_series" ADD CONSTRAINT "FK_16becc8d7f8ccec6d4fc16a03f9" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups" ADD CONSTRAINT "FK_e9703f1aa2b5ae1000816cf385d" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups" ADD CONSTRAINT "FK_693579edeb4faa9d159b4fac159" FOREIGN KEY ("recurring_series_id") REFERENCES "recurring_series"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups" ADD CONSTRAINT "FK_65a98f23825ecdcdaaeefe1da15" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_students" ADD CONSTRAINT "FK_8b5b7bb7e2c2f1a8e4319ae3394" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_students" ADD CONSTRAINT "FK_86ac11b05c01e9981dd4e4ba39e" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "group_students" DROP CONSTRAINT "FK_86ac11b05c01e9981dd4e4ba39e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_students" DROP CONSTRAINT "FK_8b5b7bb7e2c2f1a8e4319ae3394"`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups" DROP CONSTRAINT "FK_65a98f23825ecdcdaaeefe1da15"`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups" DROP CONSTRAINT "FK_693579edeb4faa9d159b4fac159"`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups" DROP CONSTRAINT "FK_e9703f1aa2b5ae1000816cf385d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recurring_series" DROP CONSTRAINT "FK_16becc8d7f8ccec6d4fc16a03f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recurring_series" DROP CONSTRAINT "FK_f91f4dd48aefd10d0b30c6efee3"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "timezone"`);
    await queryRunner.query(`DROP TABLE "group_students"`);
    await queryRunner.query(
      `DROP TYPE "public"."group_students_attendance_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "groups"`);
    await queryRunner.query(`DROP TYPE "public"."groups_location_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."groups_status_enum"`);
    await queryRunner.query(`DROP TABLE "recurring_series"`);
  }
}
