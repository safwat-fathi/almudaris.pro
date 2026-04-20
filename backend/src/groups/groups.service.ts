import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThan, MoreThan, Not } from 'typeorm';
import { Group, GroupStatus, LocationType } from './entities/group.entity';
import { GroupStudent, AttendanceStatus } from './entities/group-student.entity';
import { RecurringSeries } from './entities/recurring-series.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { ChildTeacherEnrollment } from '../children/entities/child-teacher-enrollment.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { EditScope } from './dto/update-group.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { GROUPS_CONFIG } from '../config/groups.config';

@Injectable()
export class GroupsService {
  private readonly logger = new Logger(GroupsService.name);

  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
    @InjectRepository(GroupStudent)
    private readonly groupStudentRepo: Repository<GroupStudent>,
    @InjectRepository(RecurringSeries)
    private readonly recurringSeriesRepo: Repository<RecurringSeries>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ChildTeacherEnrollment)
    private readonly enrollmentRepo: Repository<ChildTeacherEnrollment>,
  ) {}

  // ==================== US1: Create Group ====================

  /**
   * Creates a single group or a recurring series.
   * - Validates student ownership (FR-002)
   * - Computes end_time (FR-016)
   * - Snapshots student_name (FR-017)
   * - Checks overlaps and builds warnings (FR-004)
   * - Creates recurring series if requested (FR-006)
   */
  async createGroup(
    dto: CreateGroupDto,
    teacherId: number,
  ): Promise<{ data: Group[]; warnings: string[] }> {
    const warnings: string[] = [];

    // Validate students belong to this teacher (FR-002)
    const enrollments = await this.enrollmentRepo.find({
      where: {
        teacher_id: teacherId,
        student_id: In(dto.student_ids),
      },
    });

    const enrolledStudentIds = enrollments.map((e) => e.student_id);
    const invalidStudents = dto.student_ids.filter(
      (id) => !enrolledStudentIds.includes(id),
    );

    if (invalidStudents.length > 0) {
      throw new ForbiddenException(
        `Students [${invalidStudents.join(', ')}] do not belong to you.`,
      );
    }

    // Load student data for name snapshots (FR-017)
    const students = await this.userRepo.find({
      where: { id: In(dto.student_ids), role: UserRole.STUDENT },
    });

    if (students.length !== dto.student_ids.length) {
      throw new NotFoundException('One or more students not found.');
    }

    // Determine dates for group creation
    const dates: string[] = [dto.date];

    let recurringSeries: RecurringSeries | null = null;

    if (dto.is_recurring && dto.recurrence_count && dto.recurrence_count > 1) {
      // Create RecurringSeries
      recurringSeries = this.recurringSeriesRepo.create({
        teacher_id: teacherId,
        created_by_id: teacherId,
      });
      recurringSeries = await this.recurringSeriesRepo.save(recurringSeries);

      // Generate dates for recurring instances (WEEKLY pattern)
      const count = Math.min(
        dto.recurrence_count,
        GROUPS_CONFIG.MAX_RECURRING_INSTANCES,
      );
      const baseDate = new Date(dto.date);
      for (let i = 1; i < count; i++) {
        const nextDate = new Date(baseDate);
        nextDate.setDate(baseDate.getDate() + 7 * i);
        dates.push(nextDate.toISOString().split('T')[0]);
      }
    }

    // Check overlaps for all dates (FR-004)
    const overlapWarnings = await this.checkOverlaps(
      teacherId,
      dates,
      dto.start_time,
      dto.duration_minutes,
    );
    warnings.push(...overlapWarnings);

    if (overlapWarnings.length > 0) {
      this.logger.warn(
        `Overlap detected for teacher ${teacherId}: ${overlapWarnings.join('; ')}`,
      );
    }

    // Create groups
    const createdGroups: Group[] = [];

    for (const date of dates) {
      const group = this.groupRepo.create({
        teacher_id: teacherId,
        created_by_id: teacherId,
        title: dto.title,
        date,
        start_time: dto.start_time,
        duration_minutes: dto.duration_minutes,
        status: GroupStatus.SCHEDULED,
        location_type: dto.location_type,
        location_link: dto.location_link,
        location_place: dto.location_place,
        recurring_series_id: recurringSeries?.id,
        students: students.map((student) =>
          this.groupStudentRepo.create({
            student_id: student.id,
            student_name: student.name, // Immutable snapshot (FR-017)
            attendance_status: AttendanceStatus.NOT_SET,
          }),
        ),
      });

      const saved = await this.groupRepo.save(group);
      createdGroups.push(saved);
    }

    // Reload with relations
    const result = await this.groupRepo.find({
      where: { id: In(createdGroups.map((g) => g.id)) },
      relations: ['students'],
      order: { date: 'ASC' },
    });

    return { data: result, warnings };
  }

  // ==================== US1: List & Get Groups ====================

  /**
   * Lists groups for a teacher with optional filters.
   */
  async findAll(
    teacherId: number,
    filters?: {
      from?: string;
      to?: string;
      status?: GroupStatus;
      student_id?: number;
    },
  ): Promise<Group[]> {
    const qb = this.groupRepo
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.students', 'gs')
      .where('group.teacher_id = :teacherId', { teacherId })
      .orderBy('group.date', 'ASC')
      .addOrderBy('group.start_time', 'ASC');

    if (filters?.from) {
      qb.andWhere('group.date >= :from', { from: filters.from });
    }
    if (filters?.to) {
      qb.andWhere('group.date <= :to', { to: filters.to });
    }
    if (filters?.status) {
      qb.andWhere('group.status = :status', { status: filters.status });
    }
    if (filters?.student_id) {
      qb.andWhere('gs.student_id = :studentId', {
        studentId: filters.student_id,
      });
    }

    return qb.getMany();
  }

  /**
   * Gets a single group by ID, validating teacher ownership.
   */
  async findOne(groupId: number, teacherId: number): Promise<Group> {
    const group = await this.groupRepo.findOne({
      where: { id: groupId, teacher_id: teacherId },
      relations: ['students', 'recurring_series'],
    });

    if (!group) {
      throw new NotFoundException(`Group #${groupId} not found.`);
    }

    return group;
  }

  // ==================== US2: Update Group ====================

  /**
   * Updates a group with edit scope support for recurring series (FR-015).
   * Structural edits blocked for Completed/Cancelled groups (FR-008/FR-021).
   */
  async updateGroup(
    groupId: number,
    dto: UpdateGroupDto,
    teacherId: number,
  ): Promise<{ data: Group; warnings: string[] }> {
    const warnings: string[] = [];
    const group = await this.findOne(groupId, teacherId);

    if (group.status !== GroupStatus.SCHEDULED) {
      throw new BadRequestException(
        'Cannot edit structural details of a completed or cancelled group.',
      );
    }

    // Determine which groups to update based on edit_scope
    const groupsToUpdate = await this.resolveEditScope(
      group,
      dto.edit_scope || EditScope.THIS,
    );

    // If student_ids changed, validate ownership + snapshot names
    let newStudents: User[] | null = null;
    if (dto.student_ids) {
      const enrollments = await this.enrollmentRepo.find({
        where: { teacher_id: teacherId, student_id: In(dto.student_ids) },
      });
      const enrolledIds = enrollments.map((e) => e.student_id);
      const invalidIds = dto.student_ids.filter(
        (id) => !enrolledIds.includes(id),
      );
      if (invalidIds.length > 0) {
        throw new ForbiddenException(
          `Students [${invalidIds.join(', ')}] do not belong to you.`,
        );
      }
      newStudents = await this.userRepo.find({
        where: { id: In(dto.student_ids), role: UserRole.STUDENT },
      });
    }

    // Apply updates to each group in scope
    for (const g of groupsToUpdate) {
      if (g.status !== GroupStatus.SCHEDULED) continue; // Protect completed groups

      if (dto.date !== undefined) g.date = dto.date;
      if (dto.start_time !== undefined) g.start_time = dto.start_time;
      if (dto.duration_minutes !== undefined)
        g.duration_minutes = dto.duration_minutes;
      if (dto.location_type !== undefined) g.location_type = dto.location_type;
      if (dto.location_link !== undefined) g.location_link = dto.location_link;
      if (dto.location_place !== undefined)
        g.location_place = dto.location_place;
      if (dto.title !== undefined) g.title = dto.title;

      await this.groupRepo.save(g);

      // Handle student list changes
      if (newStudents && dto.student_ids) {
        // Remove existing students
        await this.groupStudentRepo.delete({ group_id: g.id });

        // Re-create with snapshots for new students (FR-017)
        const studentRecords = newStudents.map((student) =>
          this.groupStudentRepo.create({
            group_id: g.id,
            student_id: student.id,
            student_name: student.name,
            attendance_status: AttendanceStatus.NOT_SET,
          }),
        );
        await this.groupStudentRepo.save(studentRecords);
      }
    }

    // Check overlaps for the primary group
    if (dto.start_time || dto.duration_minutes || dto.date) {
      const updatedGroup = await this.findOne(groupId, teacherId);
      const overlapWarnings = await this.checkOverlaps(
        teacherId,
        [updatedGroup.date],
        updatedGroup.start_time,
        updatedGroup.duration_minutes,
        groupId,
      );
      warnings.push(...overlapWarnings);
    }

    const result = await this.findOne(groupId, teacherId);
    return { data: result, warnings };
  }

  // ==================== US3: Attendance & Status ====================

  /**
   * Updates attendance and per-student notes for a group (FR-009/FR-020).
   * Allowed regardless of group status.
   */
  async updateAttendance(
    groupId: number,
    dto: UpdateAttendanceDto,
    teacherId: number,
  ): Promise<Group> {
    const group = await this.findOne(groupId, teacherId);

    // Update group-level notes if provided
    if (dto.notes !== undefined) {
      group.notes = dto.notes;
      await this.groupRepo.save(group);
    }

    // Update per-student attendance and notes
    for (const studentDto of dto.students) {
      const gs = await this.groupStudentRepo.findOne({
        where: { group_id: groupId, student_id: studentDto.id },
      });

      if (!gs) continue;

      gs.attendance_status = studentDto.attendance_status;

      if (studentDto.note !== undefined) {
        const noteChanged = gs.note !== studentDto.note;
        gs.note = studentDto.note;
        if (noteChanged) {
          gs.note_updated_at = new Date();
        }
      }

      await this.groupStudentRepo.save(gs);
    }

    return this.findOne(groupId, teacherId);
  }

  /**
   * Manually marks a group as Completed (FR-005).
   */
  async updateStatus(
    groupId: number,
    teacherId: number,
  ): Promise<Group> {
    const group = await this.findOne(groupId, teacherId);

    if (group.status !== GroupStatus.SCHEDULED) {
      throw new BadRequestException(
        'Only scheduled groups can be manually completed.',
      );
    }

    group.status = GroupStatus.COMPLETED;
    await this.groupRepo.save(group);

    return this.findOne(groupId, teacherId);
  }

  // ==================== US5: Cancel Group ====================

  /**
   * Cancels a group by setting status to 'Cancelled' (FR-010).
   * Individual only — no bulk cancellation.
   */
  async cancelGroup(groupId: number, teacherId: number): Promise<void> {
    const group = await this.findOne(groupId, teacherId);

    group.status = GroupStatus.CANCELLED;
    await this.groupRepo.save(group);
  }

  // ==================== Private Helpers ====================

  /**
   * Checks for overlapping groups and returns warning messages.
   * Non-blocking — creation still proceeds (FR-004).
   */
  private async checkOverlaps(
    teacherId: number,
    dates: string[],
    startTime: string,
    durationMinutes: number,
    excludeGroupId?: number,
  ): Promise<string[]> {
    const warnings: string[] = [];

    // Compute end time
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;

    for (const date of dates) {
      const qb = this.groupRepo
        .createQueryBuilder('g')
        .where('g.teacher_id = :teacherId', { teacherId })
        .andWhere('g.date = :date', { date })
        .andWhere('g.status != :cancelled', {
          cancelled: GroupStatus.CANCELLED,
        })
        .andWhere(
          '(g.start_time < :endTime AND g.end_time > :startTime)',
          { startTime, endTime },
        );

      if (excludeGroupId) {
        qb.andWhere('g.id != :excludeId', { excludeId: excludeGroupId });
      }

      const overlapping = await qb.getCount();

      if (overlapping > 0) {
        warnings.push(
          `You already have a group at this time on ${date}`,
        );
      }
    }

    return warnings;
  }

  /**
   * Resolves which groups to update based on edit scope (FR-015).
   * "Future" = date > edited group's date in same recurring series.
   */
  private async resolveEditScope(
    group: Group,
    scope: EditScope,
  ): Promise<Group[]> {
    if (scope === EditScope.THIS || !group.recurring_series_id) {
      return [group];
    }

    const qb = this.groupRepo
      .createQueryBuilder('g')
      .where('g.recurring_series_id = :seriesId', {
        seriesId: group.recurring_series_id,
      });

    if (scope === EditScope.THIS_AND_FUTURE) {
      qb.andWhere('g.date > :date', { date: group.date });
      // Include the current group too
      const futureGroups = await qb.getMany();
      return [group, ...futureGroups];
    }

    // ALL scope — includes all in series
    return qb.getMany();
  }
}
