import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRoleConstraints1775901848398 implements MigrationInterface {
  name = 'AddUserRoleConstraints1775901848398';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "student_teacher_enrollments" ("student_id" integer NOT NULL, "teacher_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6d50afc0a7623ae163d840232f2" PRIMARY KEY ("student_id", "teacher_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "parent_teacher_links" ("parent_id" integer NOT NULL, "teacher_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d0eea01cc57c269dd97a1ff3e41" PRIMARY KEY ("parent_id", "teacher_id"))`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "invite_code" text`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_a19e76921d5f8829d706a931026" UNIQUE ("invite_code")`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "parent_id" integer`);
    await queryRunner.query(
      `ALTER TYPE "public"."users_role_enum" RENAME TO "users_role_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('teacher', 'parent', 'student')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum" USING "role"::"text"::"public"."users_role_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'parent'`,
    );
    await queryRunner.query(`DROP TYPE "public"."users_role_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "CHK_1998031fe52e5d9e6473e0d20f" CHECK ("parent_id" IS NULL OR "role" = 'student')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "CHK_cb20251a94a71ade75ea1f69b6" CHECK ("invite_code" IS NULL OR "role" = 'teacher')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_03b7ad8596195af69eb19034116" FOREIGN KEY ("parent_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_teacher_enrollments" ADD CONSTRAINT "FK_3a280e5cadd003efaa6698746f2" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_teacher_enrollments" ADD CONSTRAINT "FK_55aa8811dfb884fec95d5dd723e" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parent_teacher_links" ADD CONSTRAINT "FK_d65260dd8da99c4642be0831ac6" FOREIGN KEY ("parent_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parent_teacher_links" ADD CONSTRAINT "FK_afd7385eb2de30a741685a90818" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "parent_teacher_links" DROP CONSTRAINT "FK_afd7385eb2de30a741685a90818"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parent_teacher_links" DROP CONSTRAINT "FK_d65260dd8da99c4642be0831ac6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_teacher_enrollments" DROP CONSTRAINT "FK_55aa8811dfb884fec95d5dd723e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_teacher_enrollments" DROP CONSTRAINT "FK_3a280e5cadd003efaa6698746f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_03b7ad8596195af69eb19034116"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "CHK_cb20251a94a71ade75ea1f69b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "CHK_1998031fe52e5d9e6473e0d20f"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum_old" AS ENUM('teacher', 'parent')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum_old" USING "role"::"text"::"public"."users_role_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'parent'`,
    );
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."users_role_enum_old" RENAME TO "users_role_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "parent_id"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_a19e76921d5f8829d706a931026"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "invite_code"`);
    await queryRunner.query(`DROP TABLE "parent_teacher_links"`);
    await queryRunner.query(`DROP TABLE "student_teacher_enrollments"`);
  }
}
