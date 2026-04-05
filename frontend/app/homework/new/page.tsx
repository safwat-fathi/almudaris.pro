import type { Metadata } from "next";
import BottomNav from "@/components/layout/BottomNav";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "إضافة واجب جديد | Al-Mudaris Pro",
  description: "إنشاء واجب جديد وتعيينه للطلاب",
};

export default function CreateHomeworkPage() {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col pb-28">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-slate-50/85 backdrop-blur-md flex justify-between items-center px-6 h-16 shadow-none">
        <div className="flex items-center gap-3">
          <Link href="/homework" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors text-slate-600 active:scale-95">
            <span className="material-symbols-outlined font-bold">arrow_forward</span>
          </Link>
          <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 border border-slate-100">
            <img 
              alt="Teacher profile" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqCq-wjRoaUcZFyJcNgTdJMyxUvdBOfgnS6mQLGr4dcjoNA1340d_G1hI2ldmGgFZqK1TnP2RfIkUbH1OPISgRD3E_FwXSo2wA-a88zPffnjrAP7cPItN21gCeG6XZb7QwfcSoI7mfh0R_37KJwYkcDhWWox1P0bz44wiRfgDKhtMY8ir9lCwK0zs1PzHY8hZC-fOvwcX3kCSSNk4aGUW9U9Yt6zQV_8Rq6Q1agjfCtSbdzJWGOB1IkgFdLwCVtg_s56vIFY1Y1AA"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-headline text-lg font-extrabold tracking-tight text-primary">Al-Mudaris Pro</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors">
          <span className="material-symbols-outlined text-slate-500">notifications</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-6 md:px-20 max-w-2xl mx-auto w-full grow">
        
        {/* Session Context */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary rounded-full text-sm font-semibold">
            <span>📚 حصة: شرح الدرس ٥</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-on-surface-variant rounded-full text-sm font-semibold">
            <span>👥 الدفعة: تالتة ثانوي</span>
          </div>
        </div>

        <header className="mb-8">
          <h2 className="font-headline text-2xl font-extrabold text-on-surface mb-2">إضافة واجب جديد</h2>
          <p className="text-on-surface-variant font-body text-sm">قم بتعبئة تفاصيل الواجب المدرسي للدفعة المختارة</p>
        </header>

        <form className="space-y-6">
          {/* Group Selector */}
          <div className="space-y-2">
            <label className="block text-on-surface font-bold text-sm mr-1">الدفعة</label>
            <div className="relative">
              <select className="w-full h-14 pr-12 pl-4 bg-surface-container-lowest border-none rounded-full text-on-surface focus:ring-2 focus:ring-primary appearance-none transition-all shadow-sm font-body">
                <option>تالتة ثانوي</option>
                <option>تانية ثانوي</option>
                <option>أولى ثانوي</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <span className="material-symbols-outlined text-primary">group</span>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant mr-1">سيتم تعيين الواجب لكل طلاب الدفعة</p>
          </div>

          {/* Homework Title (Optional) */}
          <div className="space-y-2">
            <label className="flex text-on-surface font-bold text-sm mr-1 justify-between">
              عنوان الواجب
              <span className="text-slate-400 font-normal text-[10px] uppercase">اختياري</span>
            </label>
            <div className="relative">
              <input 
                className="w-full h-14 pr-12 pl-4 bg-surface-container-lowest border-none rounded-full text-on-surface focus:ring-2 focus:ring-primary transition-all shadow-sm font-body" 
                placeholder="مثلاً: مراجعة الوحدة الأولى" 
                type="text" 
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <span className="material-symbols-outlined text-primary">edit_note</span>
              </div>
            </div>
          </div>

          {/* Description (Required & Prominent) */}
          <div className="space-y-2">
            <label className="block text-on-surface font-bold text-sm mr-1">
              وصف الواجب <span className="text-error">*</span>
            </label>
            <textarea 
              className="w-full p-5 bg-white border-2 border-primary/20 rounded-3xl text-on-surface focus:ring-2 focus:ring-primary transition-all shadow-sm leading-relaxed min-h-[140px] font-body resize-none" 
              placeholder="مثال: حل صفحة ٣٠ من الكتاب، من سؤال ١ إلى ١٠" 
              required
            ></textarea>
          </div>

          {/* File Upload Area */}
          <div className="space-y-2">
            <label className="block text-on-surface font-bold text-sm mr-1">📎 أضف ملفات (PDF - صور - ورق الواجب)</label>
            <div className="group relative flex flex-col items-center justify-center w-full min-h-[180px] bg-white border-2 border-dashed border-outline-variant hover:border-primary rounded-3xl transition-all p-6 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-primary-container/10 rounded-full flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-primary text-3xl">upload_file</span>
                </div>
                <p className="font-bold text-on-surface mb-1 font-body text-sm">اضغط هنا أو قم بسحب الملفات</p>
                <p className="text-xs text-on-surface-variant font-body">الحد الأقصى للملف 25 ميجابايت</p>
              </div>
            </div>
          </div>

          {/* Due Date Picker */}
          <div className="space-y-2">
            <label className="block text-on-surface font-bold text-sm mr-1">تاريخ التسليم النهائي</label>
            <div className="relative">
              <input 
                className="w-full h-14 pr-12 pl-4 bg-surface-container-lowest border-none rounded-full text-on-surface focus:ring-2 focus:ring-primary transition-all shadow-sm appearance-none font-body" 
                type="date" 
                defaultValue="2023-10-27" 
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <span className="material-symbols-outlined text-primary">calendar_today</span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-none">
              <button type="button" className="whitespace-nowrap px-4 py-1.5 bg-primary text-on-primary text-xs rounded-full font-bold active:scale-95 transition-transform">اليوم</button>
              <button type="button" className="whitespace-nowrap px-4 py-1.5 bg-surface-container-high text-on-surface-variant text-xs rounded-full font-bold active:scale-95 transition-transform hover:bg-surface-container-highest">غداً</button>
              <button type="button" className="whitespace-nowrap px-4 py-1.5 bg-surface-container-high text-on-surface-variant text-xs rounded-full font-bold active:scale-95 transition-transform hover:bg-surface-container-highest">نهاية الأسبوع</button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full h-16 bg-primary text-on-primary font-extrabold text-lg rounded-full shadow-[0_12px_32px_rgba(26,115,232,0.3)] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-10 font-headline"
          >
            <span className="material-symbols-outlined">assignment_add</span>
            إضافة الواجب
          </button>
        </form>

        {/* Contextual Help Card */}
        <div className="mt-12 p-6 bg-blue-50/50 rounded-3xl flex gap-4 items-start border border-blue-100">
          <span className="material-symbols-outlined text-primary mt-0.5 text-xl">lightbulb</span>
          <div>
            <h4 className="font-extrabold text-primary text-sm mb-1 font-headline">نصيحة</h4>
            <p className="text-blue-800/80 text-sm leading-relaxed font-body">
              تخصيص تاريخ تسليم محدد يساعد الطلاب على تنظيم وقتهم بشكل أفضل وتلقي إشعارات تذكيرية قبل الموعد النهائي.
            </p>
          </div>
        </div>

      </main>

      <BottomNav />
    </div>
  );
}
