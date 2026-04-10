import type { Metadata } from "next";
import Link from "next/link";
import SessionForm from "@/components/sessions/SessionForm";

export const metadata: Metadata = {
  title: "تعديل الحصة - Al-Mudaris Pro",
  description: "قم بتعديل بيانات وتفاصيل الحصة التعليمية",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditSessionPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Top AppBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-md flex items-center justify-between px-6 h-16 shadow-sm">
        <Link href={`/sessions`} className="flex items-center gap-2 active:scale-95 duration-150 ease-in-out group">
          <span className="material-symbols-outlined text-primary group-hover:bg-primary/10 rounded-full p-1 transition-colors">arrow_forward</span>
          <span className="font-manrope font-bold text-lg tracking-tight text-primary">رجوع</span>
        </Link>
        <h1 className="font-manrope font-extrabold text-lg text-primary">تعديل الحصة</h1>
        <button className="text-primary font-bold hover:bg-primary/10 px-4 py-2 rounded-full transition-colors active:scale-95 duration-150">
          حفظ
        </button>
      </nav>

      <main className="pt-20 px-6 max-w-md mx-auto">
        {/* Client Interactive Form */}
        <SessionForm 
          isEdit={true} 
          initialData={{
            name: "مراجعة ليلة الامتحان",
            group: "تالتة ثانوي",
            date: "غداً",
            price: "50 جنيه",
            location: "center"
          }}
        />
      </main>
    </div>
  );
}
