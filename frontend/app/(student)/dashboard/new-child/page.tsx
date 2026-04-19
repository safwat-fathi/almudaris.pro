import Link from "next/link";
import { ChildForm } from "@/components/children/ChildForm";
import { createChildAction } from "./actions";
import { cookies } from "next/headers";
import CONSTANTS from "@/lib/constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getLinkedTeachers() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CONSTANTS.ACCESS_TOKEN)?.value;
  
  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}/parents/teachers`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data || []);
  } catch (error) {
    return [];
  }
}

export const metadata = {
  title: "إضافة طالب جديد",
  description: "أضف طالباً جديداً لتسجيله في فصول المعلمين المرتبطين",
};

export default async function NewChildPage() {
  const linkedTeachers = await getLinkedTeachers();
	
	
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col pb-28">
      <header className="w-full top-0 sticky z-50 bg-surface-container-lowest/85 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-6 md:px-12 py-4 w-full">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="material-symbols-outlined text-slate-500 hover:bg-slate-200/50 transition-colors p-2 rounded-full active:scale-95 duration-150 ease-in-out">
              arrow_back
            </Link>
            <h1 className="font-headline text-xl font-extrabold text-primary tracking-tight">إضافة طالب</h1>
          </div>
        </div>
      </header>

      <main className="grow flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.06)] overflow-hidden relative border border-outline-variant/20 transition-all duration-300">
          <div className="relative p-10 bg-linear-to-br from-primary to-primary-container text-on-primary overflow-hidden">
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col gap-2">
              <h2 className="font-headline text-3xl font-extrabold">طالب جديد</h2>
              <p className="font-body opacity-90 max-w-sm text-sm leading-relaxed">
                قم بإضافة بيانات ابنك لمتابعة تقدمه مع المعلمين المرتبطين بك.
              </p>
            </div>
          </div>

          <div className="p-8">
            <ChildForm
              linkedTeachers={linkedTeachers}
              action={createChildAction}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
