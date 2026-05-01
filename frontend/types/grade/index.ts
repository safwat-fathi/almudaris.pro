export type EducationStage = 'PRIMARY' | 'PREPARATORY' | 'SECONDARY' | 'UNASSIGNED';

export interface GradeTarget {
  education_stage: EducationStage;
  education_year: number;
  grade_label: string;
}
