import type { Metadata } from "next";
import React from "react";

// In Next 15, params is a Promise. We must type it as such or use `await props.params`.
// Alternatively we can use normal component props depending on configuration, but standard practice in Next 15 is async component.
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // typically we'd fetch the title based on ID
  return {
    title: "تفاصيل الواجب | Al-Mudaris Pro",
  };
}

export default async function SingleHomeworkPage({ params }: PageProps) {
  // await the params promise
  const resolvedParams = await params;
  const homeworkId = resolvedParams.id;

  // Mock checking if the homework is completed or pending
  const isCompleted = homeworkId === "completed"; // demo toggle based on id

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col pb-32">

      {/* Main Content */}
      <main className="px-6 md:max-w-2xl mx-auto w-full mt-6 grow flex flex-col gap-6">
        
        {/* Detail Card Card */}
        <section className="bg-surface-container-lowest rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 border border-outline-variant/30">
          <div className="p-8">
            <div className="flex justify-between items-start mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-on-surface mb-2 font-headline tracking-tight">
                  {isCompleted ? "واجب الميكانيكا - التطبيقات" : "حل تمارين الوحدة الأولى ص ٣٠"}
                </h2>
                <div className="flex items-center gap-2 text-on-surface-variant text-sm font-medium">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  <span>{isCompleted ? "انتهى الموعد الجمعة الماضية" : "غداً - ٦ مساءً"}</span>
                </div>
              </div>
              
              {isCompleted ? (
                <span className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border border-secondary/20">
                  تم التسليم ✅
                </span>
              ) : (
                <span className="bg-tertiary-container/10 text-tertiary px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap">
                  قيد الانتظار
                </span>
              )}
            </div>

            <p className="text-on-surface-variant leading-relaxed text-sm mb-8 font-body">
              مطلوب حل الأسئلة من 1 إلى 20 في الصفحة 30 من كراسة التدريبات. يرجى التركيز على طريقة الحل وخطوات الاستنتاج بشكل واضح. يجب تسليم الحل بصيغة PDF.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              {!isCompleted && (
                <button className="w-full flex-1 flex items-center justify-center gap-2 h-14 bg-primary text-on-primary rounded-xl font-bold transition-all active:scale-[0.98] duration-150 shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>upload_file</span>
                  <span>رفع الحل (PDF)</span>
                </button>
              )}
              <button className={`w-full flex-1 flex items-center justify-center gap-2 h-14 rounded-xl font-bold transition-all active:scale-[0.98] duration-150 ${isCompleted ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5' : 'bg-surface-container-high text-primary hover:bg-surface-container-highest'}`}>
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>download</span>
                <span>تحميل مرفقات الواجب</span>
              </button>
            </div>
            
            {!isCompleted && (
              <div className="mt-8 p-4 bg-error-container/40 rounded-xl flex gap-3 items-start border border-error/10">
                <span className="material-symbols-outlined text-error mt-0.5 text-xl">info</span>
                <div>
                  <h4 className="font-extrabold text-error text-sm mb-1">تنبيه هام</h4>
                  <p className="text-error/80 text-xs leading-relaxed font-medium">لن يتم قبول أي تسليم بعد انقضاء الوقت المحدد ما لم يتم التنسيق مسبقاً مع المدرس.</p>
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* Submissions History (Mock) */}
        {isCompleted && (
          <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6">
            <h3 className="font-bold text-on-surface mb-4">الملفات المرفوعة</h3>
            <div className="flex items-center justify-between p-4 bg-surface-container rounded-lg group hover:bg-surface-container-high transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error">
                  <span className="material-symbols-outlined">picture_as_pdf</span>
                </div>
                <div>
                  <div className="font-bold text-sm text-on-surface">حل_الواجب_احمد_محمد.pdf</div>
                  <div className="text-xs text-on-surface-variant">2.4 MB • تم الرفع منذ أسبوع</div>
                </div>
              </div>
              <button className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors opacity-0 group-hover:opacity-100">
                <span className="material-symbols-outlined text-sm">download</span>
              </button>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
