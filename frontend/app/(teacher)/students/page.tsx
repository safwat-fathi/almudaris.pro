import type { Metadata } from "next";
import StudentsHeader from "@/components/students/StudentsHeader";
import StudentsTable from "@/components/students/StudentsTable";
import StudentsStats from "@/components/students/StudentsStats";
import { Student, teachersService } from "@/services/api/teachers";

export const metadata: Metadata = {
  title: "قائمة الطلاب | المدرس برو",
  description: "إدارة بيانات طلابك وتتبع دفعاتهم الأسبوعية",
};

export default async function StudentsPage({
	searchParams,
}: {
	searchParams: Promise<{ education_stage?: string; education_year?: string }>
}) {
	let students: Student[] = [];
	let error = null;

	const params = await searchParams;
	const educationStage = params.education_stage;
	const educationYear = params.education_year ? Number(params.education_year) : undefined;

	try {
		const response = await teachersService.fetchStudents({
			education_stage: educationStage,
			education_year: educationYear,
		});
		students = response.data;
	} catch (err: unknown) {
		const errorObj = err as Error;
		error = errorObj.message || "Failed to fetch students";
	}

	return (
		<div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col pb-32">
			<main className="max-w-7xl mx-auto px-6 md:px-12 mt-8 w-full grow">
				<StudentsHeader />

				<form method="GET" className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
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
				<StudentsStats
					studentsCount={students.length}
					collectionRate={0}
					activeSessions={0}
				/>
				{error ? (
					<div className="bg-red-50 text-red-800 p-4 rounded-lg text-sm text-center">
						{error}
					</div>
				) : (
					<StudentsTable students={students} />
				)}
			</main>
		</div>
	);
}
