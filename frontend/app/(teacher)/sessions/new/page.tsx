import type { Metadata } from "next";
import Link from "next/link";
import SessionForm from "@/components/sessions/SessionForm";
import { teachersService } from "@/services/api/teachers";

export const metadata: Metadata = {
  title: "إضافة حصة جديدة - Al-Mudaris Pro",
  description: "أضف حصة دراسية جديدة للطلاب والمجموعات الخاصة بك",
};

export default async function CreateSessionPage() {
  let students = [];
  try {
    students = await teachersService.fetchStudents();
  } catch (error) {
    console.error("Failed to fetch students:", error);
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Top AppBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-md flex items-center px-6 h-16 shadow-sm">
        <Link href="/sessions" className="flex items-center gap-2 active:scale-95 duration-150 ease-in-out group z-10">
          <span className="material-symbols-outlined text-primary group-hover:bg-primary/10 rounded-full p-1 transition-colors">arrow_forward</span>
          <span className="font-manrope font-bold text-lg tracking-tight text-primary">رجوع</span>
        </Link>
        <h1 className="absolute left-0 right-0 text-center font-manrope font-extrabold text-lg text-primary pointer-events-none">
          إضافة حصة
        </h1>
      </nav>

      <main className="pt-20 px-6 max-w-md mx-auto">
        {/* Client Interactive Form */}
        <SessionForm students={students} />
      </main>
    </div>
  );
}
