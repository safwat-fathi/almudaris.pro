import Link from "next/link";
import { cookies } from "next/headers";
import CONSTANTS from "@/lib/constants";
import { ChildrenListClient } from "@/components/children/ChildrenListClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Child = {
  id: number;
  name: string;
  email?: string;
  education_stage?: string;
  education_year?: number;
  grade_label?: string;
  image?: string;
};

async function getChildren(token: string): Promise<Child[]> {
  try {
    const res = await fetch(`${API_URL}/parents/children`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data || []);
  } catch {
    return [];
  }
}

async function getLinkedTeachers(token: string) {
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
  } catch {
    return [];
  }
}

export const metadata = {
  title: "قائمة الأبناء",
  description: "عرض الأبناء المسجلين وإدارة المعلمين والواجبات",
};

export default async function ChildrenListPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CONSTANTS.ACCESS_TOKEN)?.value;
  
  if (!token) {
    return <div>الرجاء تسجيل الدخول</div>;
  }

  const [children, teachers] = await Promise.all([
    getChildren(token),
    getLinkedTeachers(token)
  ]);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col pt-16 sm:pt-0">
      {/* Header section with Add button */}
      <div className="px-6 md:px-12 py-6 max-w-2xl mx-auto w-full relative z-10 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline font-extrabold text-2xl text-on-surface">أبنائي</h1>
          <p className="font-body text-sm text-on-surface-variant">إدارة ومتابعة أبنائك</p>
        </div>
        <Link 
          href="/dashboard/new-child" 
          className="w-12 h-12 bg-primary text-on-primary rounded-xl flex items-center justify-center hover:bg-primary/95 transition-all shadow-md active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>
        </Link>
      </div>

      <ChildrenListClient initialChildren={children} teachers={teachers} />
    </div>
  );
}
