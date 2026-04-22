import type { Metadata } from "next";
import SessionsView from "@/components/sessions/SessionsView";
import { groupsService } from "@/services/api/groups";
import { Student, teachersService } from "@/services/api/teachers";

export const metadata: Metadata = {
	title: "الجلسات",
	description:
		"عرض وإدارة جميع الجلسات التعليمية — جدول الحصص والحضور والتفاصيل",
};

export default async function SessionsPage() {
	let groups = [];
	let students: Student[] = [];
	let error = null;

	try {
		const paginatedGroups = await groupsService.fetchGroups();
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
			<SessionsView groups={groups} students={students} />
		</main>
	);
}
