import type { Metadata } from "next";
import TeacherRegistrationForm from "@/components/auth/TeacherRegistrationForm";

export const metadata: Metadata = {
  title: "تسجيل معلم جديد – Al-Mudaris Pro",
  description: "انضم لآلاف المعلمين في رحلة التحول الرقمي مع Al-Mudaris Pro",
};

export default function RegisterPage() {
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
          <a
            href="/login"
            className="text-primary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 p-2 rounded-full flex items-center justify-center"
          >
            <span className="material-symbols-outlined" style={{ direction: "ltr" }}>arrow_back</span>
          </a>
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
            ابدأ إدارة حصصك وطلابك بسهولة
          </h1>
          <p className="text-on-surface-variant text-lg">انضم لآلاف المعلمين في رحلة التحول الرقمي</p>
        </section>

        {/* Value Propositions */}
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

        {/* Registration Form (interactive client component) */}
        <TeacherRegistrationForm />

        {/* Footer */}
        <footer className="mt-10 text-center pb-20">
          <p className="text-on-surface-variant">
            عندك حساب؟{" "}
            <a href="/login" className="text-primary font-bold hover:underline underline-offset-4">
              تسجيل الدخول
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
