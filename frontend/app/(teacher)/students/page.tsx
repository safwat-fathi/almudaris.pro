import type { Metadata } from "next";
import StudentsHeader from "@/components/students/StudentsHeader";
import StudentsTable from "@/components/students/StudentsTable";
import StudentsStats from "@/components/students/StudentsStats";
import StudentFAB from "@/components/students/StudentFAB";

export const metadata: Metadata = {
  title: "قائمة الطلاب | المدرس برو",
  description: "إدارة بيانات طلابك وتتبع دفعاتهم الأسبوعية",
};

export default function StudentsPage() {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col pb-32">
      <main className="max-w-7xl mx-auto px-6 md:px-12 mt-8 w-full grow">
        <StudentsHeader />
        <StudentsStats />
        <StudentsTable />
      </main>
      {/* <StudentFAB /> */}
    </div>
  );
}
