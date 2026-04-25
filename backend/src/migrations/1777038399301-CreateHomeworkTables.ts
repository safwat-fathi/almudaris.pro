import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHomeworkTables1777038399301 implements MigrationInterface {
  name = 'CreateHomeworkTables1777038399301';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "submissions" ("id" SERIAL NOT NULL, "homework_id" integer NOT NULL, "student_id" integer NOT NULL, "answer_text" text, "submission_version" integer NOT NULL DEFAULT '1', "submitted_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2d20621640314573b2913a7fedc" UNIQUE ("homework_id", "student_id"), CONSTRAINT "PK_10b3be95b8b2fb1e482e07d706b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_435def3bbd4b4bbb9de1209cda" ON "submissions" ("student_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_10de5c2438b6d7b37c28cb1bda" ON "submissions" ("homework_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "submission_audit_logs" ("id" SERIAL NOT NULL, "submission_id" integer NOT NULL, "homework_id" integer NOT NULL, "student_id" integer NOT NULL, "answer_text" text, "attachment_metadata" jsonb, "attempt_number" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_257474f2554a2e8d2f67a180511" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "submission_attachments" ("id" SERIAL NOT NULL, "submission_id" integer NOT NULL, "file_url" character varying NOT NULL, "file_type" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dbbd02274861f69d04136d78e82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "homework" ("id" SERIAL NOT NULL, "group_id" integer NOT NULL, "title" character varying(100) NOT NULL, "description" text, "due_date" TIMESTAMP, "is_open" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_90dbf463ef94040ed137c4fd38d" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "homework"`);
    await queryRunner.query(`DROP TABLE "submission_attachments"`);
    await queryRunner.query(`DROP TABLE "submission_audit_logs"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_10de5c2438b6d7b37c28cb1bda"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_435def3bbd4b4bbb9de1209cda"`,
    );
    await queryRunner.query(`DROP TABLE "submissions"`);
  }
}
