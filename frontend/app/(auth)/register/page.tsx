import type { Metadata } from "next";
import RegistrationForm from "@/components/auth/RegistrationForm";
import { Suspense } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "إنشاء حساب جديد – Al-Mudaris Pro",
  description: "انضم لآلاف المعلمين والآباء في رحلة التحول الرقمي مع Al-Mudaris Pro",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const role = resolvedSearchParams.role === "parent" ? "parent" : "teacher";
  const inviteCode = resolvedSearchParams.inviteCode as string | undefined;

  const query = new URLSearchParams();
  if (role) query.set("role", role);
  if (inviteCode) query.set("inviteCode", inviteCode);
  const loginUrl = `/login${query.toString() ? `?${query.toString()}` : ""}`;

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-surface">
      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] left-[-10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px]" />
      </div>

      {/* Top App Bar */}
      <header className="w-full top-0 sticky bg-surface z-50 border-b border-outline-variant/10">
        <div className="flex items-center justify-between px-8 py-4 w-full max-w-lg mx-auto">
          <Link
            href={loginUrl}
            className="text-primary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 p-2 rounded-full flex items-center justify-center"
          >
            <span className="material-symbols-outlined" style={{ direction: "ltr" }}>arrow_back</span>
          </Link>
          <div className="text-primary font-extrabold text-xl tracking-tight font-manrope">
            Al-Mudaris Pro
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center px-8 py-10 max-w-md mx-auto w-full">
        {/* Brand Identity Section */}
        <section className="text-center mb-10">
          <h1 className="font-manrope font-extrabold text-3xl text-primary mb-4 tracking-tight leading-tight">
            {role === "parent" ? "انضم كولي أمر للطالب" : "انضم لمنصة التعليم الذكي"}
          </h1>
          <p className="text-on-surface-variant text-lg">سجل الآن لتبدأ رحلتك التعليمية</p>
        </section>

        {/* Value Propositions */}
        {role === "teacher" ? (
          <section className="grid grid-cols-1 gap-4 w-full mb-10">
            <div className="bg-surface-container-low p-5 rounded-xl flex items-center gap-4 transition-all hover:bg-surface-container-high">
              <div className="bg-secondary-container text-on-secondary-container p-3 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">how_to_reg</span>
              </div>
              <span className="font-bold text-on-surface">سجل حضور الطلاب بسهولة</span>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl flex items-center gap-4 transition-all hover:bg-surface-container-high">
              <div className="bg-primary-fixed text-on-primary-fixed-variant p-3 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <span className="font-bold text-on-surface">تابع المدفوعات بدون ورق</span>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl flex items-center gap-4 transition-all hover:bg-surface-container-high">
              <div className="bg-tertiary-fixed text-on-tertiary-fixed-variant p-3 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">calendar_month</span>
              </div>
              <span className="font-bold text-on-surface">نظم كل حصصك في مكان واحد</span>
            </div>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-4 w-full mb-10">
            <div className="bg-surface-container-low p-5 rounded-xl flex items-center gap-4 transition-all hover:bg-surface-container-high">
              <div className="bg-secondary-container text-on-secondary-container p-3 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <span className="font-bold text-on-surface">تابع أداء أبنائك باستمرار</span>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl flex items-center gap-4 transition-all hover:bg-surface-container-high">
              <div className="bg-primary-fixed text-on-primary-fixed-variant p-3 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">notifications_active</span>
              </div>
              <span className="font-bold text-on-surface">استقبل تنبيهات الحضور والغياب</span>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl flex items-center gap-4 transition-all hover:bg-surface-container-high">
              <div className="bg-tertiary-fixed text-on-tertiary-fixed-variant p-3 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">forum</span>
              </div>
              <span className="font-bold text-on-surface">تواصل فعال مع المعلمين</span>
            </div>
          </section>
        )}

        {/* Registration Form (interactive client component) */}
        <Suspense fallback={<div className="h-64 animate-pulse bg-surface-container-low rounded-xl w-full"></div>}>
          <RegistrationForm />
        </Suspense>

        {/* Footer */}
        <footer className="mt-10 text-center pb-20">
          <p className="text-on-surface-variant">
            عندك حساب؟{" "}
            <Link href={loginUrl} className="text-primary font-bold hover:underline underline-offset-4">
              تسجيل الدخول
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
