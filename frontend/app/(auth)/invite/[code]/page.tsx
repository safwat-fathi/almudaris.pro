import { cookies } from "next/headers";
import CONSTANTS from "@/lib/constants";
import Link from "next/link";
import InviteClientActions from "./InviteClientActions";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getTeacherByCode(code: string) {
  try {
    const res = await fetch(`${API_URL}/teachers/invite/${code}`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    return null;
  }
}

export default async function InviteAcceptPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const teacher = await getTeacherByCode(code);
  const cookieStore = await cookies();
  const token = cookieStore.get(CONSTANTS.ACCESS_TOKEN)?.value;
  const userDataStr = cookieStore.get(CONSTANTS.USER_DATA)?.value;
  
  let user = null;
  if (userDataStr) {
    try { user = JSON.parse(userDataStr); } catch {}
  }

  if (!teacher) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col justify-center items-center p-6" dir="rtl">
        <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-10 text-center">
          <span className="material-symbols-outlined text-error text-5xl mb-4">error</span>
          <h1 className="font-headline text-2xl font-bold mb-2 text-on-surface">رابط الدعوة غير صالح</h1>
          <p className="text-on-surface-variant">هذا الرابط غير صحيح أو انتهت صلاحيته.</p>
          <Link href="/" className="inline-block mt-6 px-6 py-3 bg-primary text-on-primary rounded-xl font-bold">العودة للرئيسية</Link>
        </div>
      </div>
    );
  }

  const isParent = user?.role === 'parent';
  const isLoggedIn = !!token && !!user;

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col justify-center items-center p-6" dir="rtl">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
        
        <div className="p-10 bg-linear-to-br from-primary to-primary-container text-on-primary text-center">
          <h1 className="font-headline text-2xl font-extrabold mb-2">دعوة انضمام</h1>
          <p className="opacity-90 mb-4">لقد دعاك المعلم <span className="font-bold">{teacher.name}</span> للانضمام إلى فصوله.</p>
          
          {(teacher.phone || teacher.email) && (
            <div className="flex flex-col items-center justify-center gap-2 mt-4 pt-4 border-t border-on-primary/20 text-sm">
              {teacher.phone && (
                <div className="flex items-center gap-2" dir="ltr">
                  <span className="material-symbols-outlined text-lg">phone</span>
                  <span>{teacher.phone}</span>
                </div>
              )}
              {teacher.email && (
                <div className="flex items-center gap-2" dir="ltr">
                  <span className="material-symbols-outlined text-lg">mail</span>
                  <span>{teacher.email}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-8 flex flex-col gap-6">
          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-start gap-4">
            <span className="material-symbols-outlined text-primary mt-1">info</span>
            <p className="text-sm font-body text-on-surface-variant leading-relaxed">
              بمجرد قبول الدعوة، ستتمكن من متابعة تقدم أبنائك وحضورهم مع المعلم {teacher.name}.
            </p>
          </div>

          {!isLoggedIn ? (
             <div className="flex flex-col gap-3">
               <Link href={`/login?inviteCode=${code}`} className="w-full flex items-center justify-center h-14 bg-primary text-on-primary rounded-xl font-bold shadow-sm hover:shadow-md transition-all text-center">
                  تسجيل الدخول كولي أمر
               </Link>
               <Link href={`/register?role=parent&inviteCode=${code}`} className="w-full flex items-center justify-center h-14 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary/5 transition-all text-center">
                  إنشاء حساب جديد
               </Link>
               <p className="text-center text-xs text-on-surface-variant/70 pt-4 border-t border-outline-variant/20 mt-2">
                 يجب تسجيل الدخول أو إنشاء حساب كولي أمر لقبول الدعوة.
               </p>
             </div>
          ) : !isParent ? (
             <div className="bg-error/10 p-4 rounded-xl border border-error/20 flex flex-col items-center gap-3 text-center">
               <span className="material-symbols-outlined text-error text-3xl">block</span>
               <p className="font-bold text-error">عذراً، حسابك الحالي ليس حساب ولي أمر.</p>
               <p className="text-sm text-error/80">يرجى تسجيل الخروج والدخول بحساب ولي أمر لتتمكن من قبول هذه الدعوة.</p>
             </div>
          ) : (
            <InviteClientActions code={code} />
          )}

        </div>

      </div>
    </div>
  );
}
