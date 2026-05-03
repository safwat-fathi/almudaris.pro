import type { Metadata } from "next";
import SessionsView from "@/components/sessions/SessionsView";
import { Group, groupsService } from "@/services/api/groups";
import { Student, teachersService } from "@/services/api/teachers";
import type { EducationStage } from "@/types/grade";

export const metadata: Metadata = {
	title: "الجلسات",
	description:
		"عرض وإدارة جميع الجلسات التعليمية — جدول الحصص والحضور والتفاصيل",
};

export default async function SessionsPage({
	searchParams,
}: {
	searchParams: Promise<{ education_stage?: string; education_year?: string }>
}) {
	const params = await searchParams;
	const educationStage = params.education_stage as EducationStage | undefined;
	const educationYear = params.education_year ? Number(params.education_year) : undefined;

	let groups: Group[] = [];
	let students: Student[] = [];
	let error = null;

	try {
		const paginatedGroups = await groupsService.fetchGroups({
			education_stage: educationStage,
			education_year: educationYear,
		});
		groups = paginatedGroups?.data?.items || [];
		const studentsResponse = await teachersService.fetchStudents();
		students = studentsResponse.data;
	} catch (err: unknown) {
		const errorObj = err as Error;
		error = errorObj.message || "Failed to fetch sessions";
	}

	if (error) {
		return (
			<div className="bg-red-50 text-red-800 p-4 rounded-lg text-sm text-center">
				{error}
			</div>
		);
	}

	return (
		<main className="max-w-5xl mx-auto px-4 md:px-8 pt-6 md:pt-8 w-full pb-32">
			<form method="GET" className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
				<select name="education_stage" defaultValue={educationStage || ""} className="h-11 rounded-lg border border-outline-variant/40 bg-surface-container-low px-3">
					<option value="">كل المراحل</option>
					<option value="PRIMARY">ابتدائي</option>
					<option value="PREPARATORY">إعدادي</option>
					<option value="SECONDARY">ثانوي</option>
				</select>
				<select name="education_year" defaultValue={params.education_year || ""} className="h-11 rounded-lg border border-outline-variant/40 bg-surface-container-low px-3">
					<option value="">كل الصفوف</option>
					<option value="1">الصف الأول</option>
					<option value="2">الصف الثاني</option>
					<option value="3">الصف الثالث</option>
					<option value="4">الصف الرابع</option>
					<option value="5">الصف الخامس</option>
					<option value="6">الصف السادس</option>
				</select>
				<button type="submit" className="h-11 rounded-lg bg-primary text-on-primary font-semibold">تطبيق الفلتر</button>
			</form>
			<SessionsView groups={groups} students={students} />
		</main>
	);
}
