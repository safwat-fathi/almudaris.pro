import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Homework } from './entities/homework.entity';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { Submission } from '../submissions/entities/submission.entity';
import { SubmissionAttachment } from '../submissions/entities/attachment.entity';
import { computeStatus } from '../common/status.util';
import { Group } from 'src/groups/entities/group.entity';

@Injectable()
export class HomeworkService {
  constructor(
    @InjectRepository(Homework)
    private readonly homeworkRepository: Repository<Homework>,
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
    @InjectRepository(SubmissionAttachment)
    private readonly attachmentRepository: Repository<SubmissionAttachment>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async create(createHomeworkDto: CreateHomeworkDto): Promise<Homework> {
    const homework = this.homeworkRepository.create(createHomeworkDto);
    return this.homeworkRepository.save(homework);
  }

  async findByGroupId(groupId: number): Promise<Homework[]> {
    return this.homeworkRepository.find({
      where: { group_id: groupId },
      order: { created_at: 'DESC' },
    });
  }

  async toggleStatus(id: number, isOpen: boolean): Promise<Homework> {
    const homework = await this.homeworkRepository.findOne({ where: { id } });
    if (!homework) {
      throw new NotFoundException('Homework not found');
    }
    homework.is_open = isOpen;
    return this.homeworkRepository.save(homework);
  }

  async getSubmissionsByHomework(id: number): Promise<any[]> {
    const homework = await this.homeworkRepository.findOne({ where: { id } });
    if (!homework) {
      throw new NotFoundException('Homework not found');
    }

    const submissions = await this.submissionRepository.find({
      where: { homework_id: id },
    });

    const submissionIds = submissions.map((s) => s.id);

    // ⚡ Bolt: Prevent full table scan of attachments when there are no submissions.
    // `find({ where: {} })` fetches all rows, which causes a performance bottleneck.
    const attachments =
      submissionIds.length > 0
        ? await this.attachmentRepository.find({
            where: { submission_id: In(submissionIds) },
          })
        : [];

    const group = await this.groupRepository.findOne({
      where: { id: homework.group_id },
      relations: ['students'],
    });
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const students = group.students;

    // O(n) maps for efficient lookups
    const submissionsMap = new Map<number, Submission>();
    for (const sub of submissions) {
      submissionsMap.set(sub.student_id, sub);
    }

    const attachmentsMap = new Map<number, SubmissionAttachment[]>();
    for (const att of attachments) {
      const existing = attachmentsMap.get(att.submission_id) || [];
      existing.push(att);
      attachmentsMap.set(att.submission_id, existing);
    }

    return students.map((student) => {
      const { student_id, student_name } = student;
      const sub = submissionsMap.get(student_id);

      let subData: {
        id: number;
        homework_id: number;
        student_id: number;
        answer_text: string;
        submission_version: number;
        submitted_at: Date;
        updated_at: Date;
        attachments: SubmissionAttachment[];
      } | null = null;

      if (sub) {
        subData = {
          ...sub,
          attachments: attachmentsMap.get(sub.id) || [],
        };
      }

      return {
        student_id,
        student_name,
        status: computeStatus(homework.due_date, sub?.submitted_at),
        submission: subData,
      };
    });
  }
}
