import type { Metadata } from "next";
import { mockStudents } from "@/data/mockData";
import { notFound } from "next/navigation";
import Link from "next/link";
import StudentProfileHeader from "@/components/students/details/StudentProfileHeader";
import StudentQuickActions from "@/components/students/details/StudentQuickActions";
import StudentTimeline from "@/components/students/details/StudentTimeline";

interface StudentDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return mockStudents.map((student) => ({
    id: student.id,
  }));
}

export async function generateMetadata(
  props: StudentDetailsPageProps
): Promise<Metadata> {
  const params = await props.params;
  const student = mockStudents.find((s) => s.id === params.id);
  return {
    title: student ? `${student.name} — ملف الطالب` : "تفاصيل الطالب",
    description: student
      ? `ملف الطالب ${student.name} — الحضور والمستوى والجدول الزمني`
      : "تفاصيل الطالب وسجل حضوره وأدائه الدراسي",
  };
}

export default async function StudentDetailsPage(props: StudentDetailsPageProps) {
  const params = await props.params;
  const student = mockStudents.find((s) => s.id === params.id);

  if (!student) {
    notFound();
  }

  return (
    <>
      {/* Top AppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-surface/85 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link 
            href="/students"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <span className="material-symbols-outlined text-primary">arrow_forward</span>
          </Link>
          <h1 className="font-headline text-xl font-bold text-on-surface">تفاصيل الطالب</h1>
        </div>
        
        <div className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-md mx-auto space-y-8">
        <StudentProfileHeader student={student} />
        <StudentQuickActions />
        <StudentTimeline />
      </main>

    </>
  );
}
