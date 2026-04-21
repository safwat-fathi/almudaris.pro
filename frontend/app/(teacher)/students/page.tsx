import type { Metadata } from "next";
import StudentsHeader from "@/components/students/StudentsHeader";
import StudentsTable from "@/components/students/StudentsTable";
import StudentsStats from "@/components/students/StudentsStats";
import { Student, teachersService } from "@/services/api/teachers";

export const metadata: Metadata = {
  title: "قائمة الطلاب | المدرس برو",
  description: "إدارة بيانات طلابك وتتبع دفعاتهم الأسبوعية",
};

export default async function StudentsPage() {
	let students: Student[] = [];
	let error = null;

	try {
		const response = await teachersService.fetchStudents();
		students = response.data;
	} catch (err: unknown) {
		const errorObj = err as Error;
		error = errorObj.message || "Failed to fetch students";
	}

	return (
		<div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col pb-32">
			<main className="max-w-7xl mx-auto px-6 md:px-12 mt-8 w-full grow">
				<StudentsHeader />
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
