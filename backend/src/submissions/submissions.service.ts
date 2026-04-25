import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { SubmissionAttachment } from './entities/attachment.entity';
import { SubmissionAuditLog } from './entities/audit-log.entity';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
    @InjectRepository(SubmissionAttachment)
    private attachmentRepository: Repository<SubmissionAttachment>,
    @InjectRepository(SubmissionAuditLog)
    private auditLogRepository: Repository<SubmissionAuditLog>,
  ) {}

  async submit(
    homeworkId: number,
    createDto: CreateSubmissionDto,
  ): Promise<Submission> {
    const { student_id, answer_text, attachments } = createDto;

    // File validation (T034)
    if (attachments && attachments.length > 0) {
      const allowedTypes = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'PDF',
        'PNG',
        'JPG',
      ];
      for (const att of attachments) {
        if (!allowedTypes.includes(att.file_type)) {
          throw new NotFoundException(
            `File type ${att.file_type} is not allowed. Use PDF, PNG, or JPG.`,
          );
        }
      }
    }

    // 1. Find existing submission
    let submission = await this.submissionRepository.findOne({
      where: { homework_id: homeworkId, student_id },
    });

    if (submission) {
      // Increment version and update text
      submission.submission_version += 1;
      submission.answer_text = answer_text || submission.answer_text;
      submission = await this.submissionRepository.save(submission);

      // Remove old attachments (clean slate)
      await this.attachmentRepository.delete({ submission_id: submission.id });
    } else {
      // Create new submission
      submission = this.submissionRepository.create({
        homework_id: homeworkId,
        student_id,
        answer_text,
        submission_version: 1,
      });
      submission = await this.submissionRepository.save(submission);
    }

    // 2. Save new attachments
    if (attachments && attachments.length > 0) {
      const newAttachments = attachments.map((att) =>
        this.attachmentRepository.create({
          submission_id: submission.id,
          file_url: att.file_url,
          file_type: att.file_type,
        }),
      );
      await this.attachmentRepository.save(newAttachments);
    }

    // 3. Create Audit Log (T033 - done here as it's part of the flow)
    const auditLog = this.auditLogRepository.create({
      submission_id: submission.id,
      homework_id: homeworkId,
      student_id: student_id,
      answer_text: answer_text,
      attachment_metadata: attachments || [],
      attempt_number: submission.submission_version,
    });
    await this.auditLogRepository.save(auditLog);

    return submission;
  }
}
