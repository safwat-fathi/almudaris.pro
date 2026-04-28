import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoftDeleteToEnrollments1777382157610 implements MigrationInterface {
    name = 'AddSoftDeleteToEnrollments1777382157610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_teacher_enrollments" ADD "deactivated_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "student_teacher_enrollments" ADD "deactivated_by" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_teacher_enrollments" DROP COLUMN "deactivated_by"`);
        await queryRunner.query(`ALTER TABLE "student_teacher_enrollments" DROP COLUMN "deactivated_at"`);
    }

}
