import type { Metadata } from "next";
import DashboardBottomNav from "@/components/layout/DashboardBottomNav";

export const metadata: Metadata = {
  title: "الواجبات | Al-Mudaris Pro",
  description: "الواجبات الدراسية والمهام المعلقة",
};

export default function HomeworkTasksPage() {
  return (
    <div className="bg-surface text-on-surface antialiased pb-32 min-h-screen">
      {/* TopAppBar */}
      <header className="bg-surface sticky top-0 z-50 transition-colors duration-200 ease-in-out">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-full">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-container bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-2xl">
                person
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="font-manrope font-bold text-2xl text-primary leading-none mb-1">
                Al Mudaris Pro
              </h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="text-xs font-medium text-secondary">
                  🟢 تقدم ممتاز
                </span>
              </div>
            </div>
          </div>
          <div className="p-2 rounded-full hover:bg-primary/10 cursor-pointer">
            <span className="material-symbols-outlined text-outline">
              notifications
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-8 space-y-10">
        {/* Hero Section / Title */}
        <section className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">الواجبات</h1>
          <p className="text-on-surface-variant text-lg max-w-lg">مرحباً بك في مساحتك الدراسية. تتبع مهامك الدراسية وحافظ على تفوقك.</p>
        </section>

        {/* Pending Tasks Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              مهام معلقة
              <span className="bg-primary/10 text-primary text-sm font-bold px-3 py-1 rounded-full">2</span>
            </h2>
          </div>

          {/* Bento Grid Layout for Pending Tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Physics Task - Priority Card */}
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-8 flex flex-col justify-between shadow-[0_-8px_32px_rgba(0,0,0,0.06)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <span className="material-symbols-outlined text-[18px]">science</span>
                  فيزياء
                </div>
                <h3 className="text-3xl font-extrabold">حل ورقة عمل 5 - الفيزياء</h3>
                <div className="flex items-center gap-4 text-on-surface-variant flex-wrap">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px] text-tertiary">schedule</span>
                    <span className="font-medium">تاريخ الاستحقاق: غداً</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">history_edu</span>
                    <span>3 تمارين متبقية</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <button className="bg-primary text-on-primary px-8 py-4 rounded-lg font-bold flex items-center gap-3 hover:scale-95 duration-150 shadow-lg shadow-primary/20">
                  ابدأ الآن
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
              </div>
            </div>

            {/* Math Task - Secondary Card */}
            <div className="bg-surface-container-low rounded-xl p-6 flex flex-col gap-4 border-2 border-transparent hover:border-primary/10 transition-all">
              <div className="flex items-center gap-2 text-secondary font-bold text-sm">
                <span className="material-symbols-outlined text-[18px]">calculate</span>
                رياضيات
              </div>
              <h3 className="text-xl font-bold leading-tight">قراءة الفصل الثالث - الهندسة الفراغية</h3>
              <div className="mt-auto space-y-4">
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-1/4 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant text-sm font-medium">
                  <span>25% مكتمل</span>
                  <span>باقي 4 أيام</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Completed Tasks Section */}
        <section className="space-y-6 pt-6">
          <h2 className="text-2xl font-bold text-on-surface-variant">مهام مكتملة</h2>
          <div className="space-y-4">
            {/* Completed Card */}
            <div className="bg-surface-container-lowest rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between group hover:bg-surface-container-low transition-colors duration-300 gap-4">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-secondary-container text-on-secondary-container rounded-full flex shrink-0 items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">ورقة عمل 4 - الفيزياء</h3>
                  <p className="text-on-surface-variant text-sm">تم التسليم في 12 أكتوبر • 95/100</p>
                </div>
              </div>
              <button className="text-primary font-bold flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/5 sm:w-auto w-full justify-center">
                عرض التقرير
                <span className="material-symbols-outlined text-sm">visibility</span>
              </button>
            </div>

            {/* Another placeholder completed task */}
            <div className="bg-surface-container-lowest rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between group hover:bg-surface-container-low transition-colors duration-300 gap-4">
              <div className="flex items-center gap-6 opacity-60">
                <div className="w-14 h-14 bg-secondary-container/50 text-on-secondary-container rounded-full flex shrink-0 items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">مراجعة المفردات - اللغة الإنجليزية</h3>
                  <p className="text-on-surface-variant text-sm">تم التسليم في 10 أكتوبر • 100/100</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <DashboardBottomNav />
    </div>
  );
}
