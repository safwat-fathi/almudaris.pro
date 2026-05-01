import Link from "next/link";
import { EditChildForm } from "@/components/children/EditChildForm";
import { editChildAction } from "./actions";
import { cookies } from "next/headers";
import CONSTANTS from "@/lib/constants";
import { notFound } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type ChildRecord = {
  id: number;
  name: string;
  email?: string;
  education_stage: string;
  education_year: number;
};

async function getChild(id: string): Promise<ChildRecord | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CONSTANTS.ACCESS_TOKEN)?.value;
  
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/parents/children`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const children = (await res.json()) as ChildRecord[];
    return children.find((c) => c.id.toString() === id) || null;
  } catch {
    return null;
  }
}

export const metadata = {
  title: "تعديل بيانات الطالب",
  description: "تحديث بيانات الطالب والمرحلة الدراسية",
};

export default async function EditChildPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const child = await getChild(params.id);
	
  if (!child) {
    notFound();
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col pb-28">
      <header className="w-full top-0 sticky z-50 bg-surface-container-lowest/85 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-6 md:px-12 py-4 w-full">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="material-symbols-outlined text-slate-500 hover:bg-slate-200/50 transition-colors p-2 rounded-full active:scale-95 duration-150 ease-in-out">
              arrow_back
            </Link>
            <h1 className="font-headline text-xl font-extrabold text-primary tracking-tight">تعديل طالب</h1>
          </div>
        </div>
      </header>

      <main className="grow flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.06)] overflow-hidden relative border border-outline-variant/20 transition-all duration-300">
          <div className="relative p-10 bg-linear-to-br from-primary to-primary-container text-on-primary overflow-hidden">
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col gap-2">
              <h2 className="font-headline text-3xl font-extrabold">تعديل بيانات الطالب</h2>
              <p className="font-body opacity-90 max-w-sm text-sm leading-relaxed">
                قم بتحديث المرحلة أو الصف الدراسي الخاص بالطالب.
              </p>
            </div>
          </div>

          <div className="p-8">
            <EditChildForm
              child={child}
              action={editChildAction}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
