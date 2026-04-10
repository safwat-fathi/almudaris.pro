import type { Metadata } from "next";
import Link from "next/link";
import SessionForm from "@/components/sessions/SessionForm";

export const metadata: Metadata = {
  title: "إضافة حصة جديدة - Al-Mudaris Pro",
  description: "أضف حصة دراسية جديدة للطلاب والمجموعات الخاصة بك",
};

export default function CreateSessionPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Top AppBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-md flex items-center px-6 h-16 shadow-sm">
        <Link href="/sessions" className="flex items-center gap-2 active:scale-95 duration-150 ease-in-out group z-10">
          <span className="material-symbols-outlined text-primary group-hover:bg-primary/10 rounded-full p-1 transition-colors">arrow_forward</span>
          <span className="font-manrope font-bold text-lg tracking-tight text-primary">رجوع</span>
        </Link>
        <h1 className="absolute left-0 right-0 text-center font-manrope font-extrabold text-lg text-primary pointer-events-none">
          إضافة حصة
        </h1>
      </nav>

      <main className="pt-20 px-6 max-w-md mx-auto">
        {/* Quick Templates Section - Statics from design */}
        <section className="mt-4">
          <header className="mb-4">
            <h2 className="text-on-surface-variant font-manrope font-bold text-lg">اختر من حصصك السابقة</h2>
            <p className="text-outline text-sm">توفيراً لوقتك، يمكنك استنساخ إعدادات حصة سابقة</p>
          </header>
          
          <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
            {/* Template Card 1 */}
            <button className="flex-shrink-0 w-44 p-4 bg-surface-container-lowest rounded-lg border-none hover:bg-surface-container-high transition-colors active:scale-95 text-right flex flex-col gap-2 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined">history</span>
              </div>
              <div>
                <div className="font-bold text-on-surface text-sm">تالتة ثانوي</div>
                <div className="text-outline text-xs mt-1">5 مساءً</div>
              </div>
            </button>
            
            {/* Template Card 2 */}
            <button className="flex-shrink-0 w-44 p-4 bg-surface-container-lowest rounded-lg border-none hover:bg-surface-container-high transition-colors active:scale-95 text-right flex flex-col gap-2 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined">school</span>
              </div>
              <div>
                <div className="font-bold text-on-surface text-sm">أولى ثانوي</div>
                <div className="text-outline text-xs mt-1">7 مساءً</div>
              </div>
            </button>
            
            {/* Template Card 3 */}
            <button className="flex-shrink-0 w-44 p-4 bg-surface-container-lowest rounded-lg border-none hover:bg-surface-container-high transition-colors active:scale-95 text-right flex flex-col gap-2 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
                <span className="material-symbols-outlined">event_repeat</span>
              </div>
              <div>
                <div className="font-bold text-on-surface text-sm">مراجعة</div>
                <div className="text-outline text-xs mt-1">جمعة</div>
              </div>
            </button>
          </div>
        </section>

        {/* Client Interactive Form */}
        <SessionForm />
        
        {/* Visual Anchor/Decorative Element */}
        {/* <div className="mt-12 mb-8 rounded-xl overflow-hidden relative h-32 group shadow-sm">
          <img 
            className="w-full h-full object-cover" 
            alt="بيئة تعليمية" 
            src="https://plus.unsplash.com/premium_photo-1663089688180-444ff0066e5d?q=80&w=2670&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
            <span className="text-white font-medium text-sm">بيئة تعليمية مريحة لطلابك</span>
          </div>
        </div> */}
      </main>
    </div>
  );
}
