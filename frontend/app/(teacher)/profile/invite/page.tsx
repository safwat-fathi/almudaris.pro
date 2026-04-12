import Link from "next/link";
import { InviteQRCode } from "@/components/invite/InviteQRCode";
import { cookies } from "next/headers";
import CONSTANTS from "@/lib/constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getInviteCode() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CONSTANTS.ACCESS_TOKEN)?.value;
  console.log(token);
	
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/teachers/invite-code`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const response = await res.json();
		console.log(response);
    return response.data?.inviteCode || response.inviteCode;
  } catch (error) {
    return null;
  }
}

export const metadata = {
  title: "رابط الدعوة",
  description: "شارك هذا الرابط مع أولياء الأمور لتسجيل أبنائهم في فصولك.",
};

export default async function TeacherInvitePage() {
  const inviteCode = await getInviteCode();

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col pb-28">
      {/* TopAppBar Shell */}
      <header className="w-full top-0 sticky z-50 bg-surface-container-lowest/85 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-6 md:px-12 py-4 w-full">
          <div className="flex items-center gap-4">
            <Link href="/" className="material-symbols-outlined text-slate-500 hover:bg-slate-200/50 transition-colors p-2 rounded-full active:scale-95 duration-150 ease-in-out">
              arrow_back
            </Link>
            <h1 className="font-headline text-xl font-extrabold text-primary tracking-tight">رابط الدعوة</h1>
          </div>
        </div>
      </header>

      <main className="grow flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.06)] overflow-hidden relative border border-outline-variant/20 transition-all duration-300">
          
          <div className="relative p-10 bg-linear-to-br from-primary to-primary-container text-on-primary overflow-hidden">
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col gap-2">
              <h2 className="font-headline text-3xl font-extrabold">مشاركة الدعوة</h2>
              <p className="font-body opacity-90 max-w-sm text-sm leading-relaxed">
                دع أولياء الأمور ينضمون إليك الآن بسهولة من خلال هذا الرابط.
              </p>
            </div>
          </div>

          <div className="p-8">
            {inviteCode ? (
              <InviteQRCode inviteCode={inviteCode} />
            ) : (
              <div className="text-center p-6 font-bold text-error">
                تعذر جلب رابط الدعوة الخاص بك. يرجى المحاولة مرة أخرى لاحقاً.
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
