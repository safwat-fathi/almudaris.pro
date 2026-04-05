"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";

export default function CreateInvitePage() {
  const router = useRouter();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/students/invite/success");
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col pb-28">
      {/* TopAppBar Shell */}
      <header className="w-full top-0 sticky z-50 bg-surface-container-lowest/85 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-6 md:px-12 py-4 w-full">
          <div className="flex items-center gap-4">
            <Link href="/students" className="material-symbols-outlined text-slate-500 hover:bg-slate-200/50 transition-colors p-2 rounded-full active:scale-95 duration-150 ease-in-out">
              arrow_back
            </Link>
            <h1 className="font-headline text-xl font-extrabold text-primary tracking-tight">Al-Mudaris Pro</h1>
          </div>
        </div>
      </header>

      <main className="grow flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.06)] overflow-hidden relative border border-outline-variant/20 transition-all duration-300">
          
          {/* Asymmetric Header Design */}
          <div className="relative p-10 bg-linear-to-br from-primary to-primary-container text-on-primary overflow-hidden">
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col gap-2">
              <h2 className="font-headline text-3xl font-extrabold">دعوة طالب جديد</h2>
              <p className="font-body opacity-90 max-w-sm text-sm leading-relaxed">
                قم بإعداد تفاصيل الطالب لإنشاء رابط دعوة مخصص وسهل الانضمام.
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="p-8 md:p-12 flex flex-col gap-8">
            {/* Inputs Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="font-body text-sm font-semibold text-on-surface-variant px-1">اسم الطالب (اختياري)</label>
                <div className="relative">
                  <input 
                    className="w-full h-14 px-5 pr-12 bg-surface-container-lowest border-2 border-outline-variant/30 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-body text-on-surface shadow-sm" 
                    placeholder="مثال: أحمد محمد" 
                    type="text"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary/60">person</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-body text-sm font-semibold text-on-surface-variant px-1">رقم الموبايل (اختياري)</label>
                <div className="relative">
                  <input 
                    className="w-full h-14 px-5 pr-12 bg-surface-container-lowest border-2 border-outline-variant/30 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-body text-on-surface shadow-sm text-left" 
                    dir="ltr" 
                    placeholder="+20 1xx xxx xxxx" 
                    type="tel"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary/60">phone_iphone</span>
                </div>
              </div>
            </div>

            {/* Required Selector */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <label className="font-body text-sm font-semibold text-on-surface-variant">الدفعة / المجموعة <span className="text-error">*</span></label>
                <span className="text-[10px] uppercase tracking-wider text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">مطلوب</span>
              </div>
              <div className="relative">
                <select 
                  className="w-full h-14 px-5 pr-5 appearance-none bg-surface-container-lowest border-2 border-outline-variant/30 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-body text-on-surface cursor-pointer shadow-sm" 
                  required
                  defaultValue=""
                >
                  <option disabled value="">اختر الدفعة الدراسية</option>
                  <option value="1">تالتة ثانوي - المجموعة أ</option>
                  <option value="2">تالتة ثانوي - المجموعة ب</option>
                  <option value="3">تانية ثانوي - مراجعة</option>
                </select>
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Guidance Info */}
            <div className="flex gap-4 p-5 bg-blue-50/50 rounded-xl items-start border border-blue-100 mt-2">
              <span className="material-symbols-outlined text-primary mt-0.5">info</span>
              <p className="text-sm leading-relaxed text-blue-900/80 font-body">
                بمجرد النقر على "إنشاء رابط الدعوة"، سيتم توليد رابط فريد يمكنك مشاركته مع الطالب عبر الواتساب أو منصات التواصل الاجتماعي.
              </p>
            </div>

            {/* CTA Button */}
            <button 
              type="submit" 
              className="w-full h-16 mt-4 bg-primary text-on-primary rounded-xl font-extrabold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_rgba(26,115,232,0.3)] hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] focus:ring-4 focus:ring-primary/30"
            >
              <span className="material-symbols-outlined">link</span>
              إنشاء رابط الدعوة
            </button>
          </form>

          {/* Decorative Image Anchor */}
          <div className="h-1.5 flex">
            <div className="h-full w-1/3 bg-primary"></div>
            <div className="h-full w-2/3 bg-secondary"></div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
