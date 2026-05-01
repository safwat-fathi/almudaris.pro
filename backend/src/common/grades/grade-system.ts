/**
 * Represents the canonical stage bucket for Egyptian education levels.
 */
export enum EducationStage {
  PRIMARY = 'PRIMARY',
  PREPARATORY = 'PREPARATORY',
  SECONDARY = 'SECONDARY',
  UNASSIGNED = 'UNASSIGNED',
}

/**
 * Valid year ranges for each education stage.
 */
export const EDUCATION_STAGE_YEARS: Record<EducationStage, number[]> = {
  [EducationStage.PRIMARY]: [1, 2, 3, 4, 5, 6],
  [EducationStage.PREPARATORY]: [1, 2, 3],
  [EducationStage.SECONDARY]: [1, 2, 3],
  [EducationStage.UNASSIGNED]: [0], // 0 is used for unassigned/migration records
};

/**
 * Arabic display labels for education stages.
 */
export const EDUCATION_STAGE_ARABIC: Record<EducationStage, string> = {
  [EducationStage.PRIMARY]: 'الابتدائي',
  [EducationStage.PREPARATORY]: 'الإعدادي',
  [EducationStage.SECONDARY]: 'الثانوي',
  [EducationStage.UNASSIGNED]: 'غير محدد',
};

/**
 * Arabic ordinals for education years.
 */
export const EDUCATION_YEAR_ORDINAL_ARABIC: Record<number, string> = {
  1: 'الأول',
  2: 'الثاني',
  3: 'الثالث',
  4: 'الرابع',
  5: 'الخامس',
  6: 'السادس',
  0: 'غير محدد',
};

/**
 * Checks if a given year is valid for the specified education stage.
 *
 * @param stage The education stage.
 * @param year The education year.
 * @returns boolean indicating if the combination is valid.
 */
export function isValidGrade(stage: EducationStage, year: number): boolean {
  if (!Object.values(EducationStage).includes(stage)) return false;
  return EDUCATION_STAGE_YEARS[stage].includes(year);
}

/**
 * Formats the canonical Arabic label for a given education stage and year.
 *
 * Examples:
 * - PRIMARY, 4 => 'الصف الرابع الابتدائي'
 * - UNASSIGNED, 0 => 'غير محدد - يحتاج مراجعة'
 *
 * @param stage The education stage.
 * @param year The education year.
 * @returns The formatted Arabic grade label string.
 */
export function formatGradeLabel(stage: EducationStage, year: number): string {
  if (stage === EducationStage.UNASSIGNED) {
    return 'غير محدد - يحتاج مراجعة';
  }

  const ordinal = EDUCATION_YEAR_ORDINAL_ARABIC[year];
  const stageName = EDUCATION_STAGE_ARABIC[stage];

  if (!ordinal || !stageName) {
    return 'غير محدد - يحتاج مراجعة';
  }

  return `الصف ${ordinal} ${stageName}`;
}
