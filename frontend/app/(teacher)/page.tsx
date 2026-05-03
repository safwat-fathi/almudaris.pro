import type { Metadata } from "next";
import Greeting from "@/components/home/Greeting";
import SessionsList from "@/components/home/SessionsList";
import QuickActions from "@/components/home/QuickActions";
import AlertsList from "@/components/home/AlertsList";
import { groupsService, Group } from "@/services/api/groups";
import { Student, teachersService } from "@/services/api/teachers";

export const metadata: Metadata = {
  title: "الرئيسية",
  description: "لوحة التحكم الرئيسية — عرض الجلسات القادمة والتنبيهات والإجراءات السريعة",
};

export default async function Home() {
  let groups: Group[] = [];
  let students: Student[] = [];
  try {
    const today = new Date().toISOString().split('T')[0];
    const paginatedGroups = await groupsService.fetchGroups({ from: today, to: today });
    groups = paginatedGroups?.data?.items || [];
    const studentsResponse = await teachersService.fetchStudents();
    students = studentsResponse.data;
  } catch (err) {
    console.error("Failed to fetch data", err);
  }

  return (
		<main className="max-w-xl mx-auto px-6 mt-8 space-y-10 w-full mb-24">
			<Greeting />
			<SessionsList groups={groups} students={students} />
			<QuickActions students={students} />
			<AlertsList />
		</main>
	);
}
