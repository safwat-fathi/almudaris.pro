export type EducationStage =
	| "PRIMARY"
	| "PREPARATORY"
	| "SECONDARY"
	| "UNASSIGNED";

export interface GradeTarget {
	education_stage: EducationStage;
	education_year: number;
	grade_label: string;
}

export const EDUCATION_STAGE_LABELS: Record<EducationStage, string> = {
	PRIMARY: "الابتدائي",
	PREPARATORY: "الإعدادي",
	SECONDARY: "الثانوي",
	UNASSIGNED: "غير محدد",
};

export const EDUCATION_YEAR_LABELS: Record<number, string> = {
	0: "غير محدد",
	1: "الأول",
	2: "الثاني",
	3: "الثالث",
	4: "الرابع",
	5: "الخامس",
	6: "السادس",
};

export const EDUCATION_STAGE_YEARS: Record<EducationStage, number[]> = {
	PRIMARY: [1, 2, 3, 4, 5, 6],
	PREPARATORY: [1, 2, 3],
	SECONDARY: [1, 2, 3],
	UNASSIGNED: [0],
};
