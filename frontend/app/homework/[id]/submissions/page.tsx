import type { Metadata } from "next";
import BottomNav from "@/components/layout/BottomNav";
import Link from "next/link";
import React from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: "متابعة الواجبات | Al-Mudaris Pro",
    description: "متابعة تسليمات الطلاب للواجبات",
  };
}

export default async function HomeworkSubmissionsPage({ params }: PageProps) {
  // Await params per Next 15 standard
  const resolvedParams = await params;
  const homeworkId = resolvedParams.id;

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col pb-28">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-slate-50/85 backdrop-blur-md flex justify-between items-center px-6 md:px-8 h-16 shadow-none">
        <div className="flex items-center gap-4">
          <Link href="/homework" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors text-slate-600 active:scale-95">
            <span className="material-symbols-outlined font-bold">arrow_forward</span>
          </Link>
          <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden ring-2 ring-primary/10 hidden sm:block">
            <img 
              className="w-full h-full object-cover" 
              alt="Teacher Profile" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-AVl3FuueheKMO4DkAiQOPa77tZAAZ_VK7JewZBWtYYuyHZhmmuZ7blx4M54ekIIGfCoICEAuTiH5R_oo6-kCncmAw_kOPFiPdxFcUez7VSRlOVYYGETnfySu8lEys2GDrFevewLtRJLl5a1PLQxfAEhv5As0Vpnmhe3HX08umnZBBShbkT1q-IppPbBMFG1XTxmUnBVlxxY8Hq1zlXjZCHaw8qLXFkJv2KH6xOatNiP_48cOYKg6vsnlmFE9sP3M6WLb-s9Z32w" 
            />
          </div>
          <h1 className="font-headline font-bold text-xl md:text-2xl text-on-surface tracking-tight">متابعة الواجبات</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors active:scale-95 text-slate-500">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      <main className="pt-24 px-6 md:px-20 max-w-2xl mx-auto w-full grow">
        
        {/* Selected Homework Info Card */}
        <section className="bg-primary-container rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden text-on-primary-container shadow-lg">
          <div 
            className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-cover bg-center" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBDF9Kgi1SMxTmQeqf5YeNp2yO23B1QJ4btPD6sWtBjTbRYRtOJXOgfpTIh_uU3DPxCMtlsrF0tNu2Lieo1_2gp424GE7rqSD3MPLSsko6zPxwtPNFGTzBvRPfBTCFCEZafVZyGg6YAkUOUP1G95d3QdKMXcQz0EmHr3KNtutt64bmCaxqOK84z1ARZn3R7rifNFwDqEhd4HK6u9fCGLIu7X9nLHuy78ngbKsQp-7enBEWS4MHf2GAw6Mhj2P7W0I2yUv5Snpn5HAc')" }}
          ></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-medium uppercase tracking-widest opacity-80 block mb-1 font-body">الواجب الحالي</span>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight font-headline text-white">حل تمارين ص ٣٠ - تالتة ثانوي</h2>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center min-w-[70px] md:min-w-[80px] shadow-sm border border-white/10">
                <span className="block text-2xl md:text-3xl font-black text-white font-headline">15</span>
                <span className="text-[10px] font-bold opacity-90 text-white uppercase tracking-wider">تم التسليم</span>
              </div>
            </div>
            
            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden mt-6 mb-3">
              <div className="bg-white h-full w-3/4 rounded-full transition-all duration-1000 ease-out shadow-sm"></div>
            </div>
            
            <div className="flex justify-between text-sm font-medium text-white/90 font-body">
              <span>إجمالي الطلاب: ٢٠</span>
              <span>المتبقي: ٥</span>
            </div>
          </div>
        </section>

        {/* Stats Grid (Bento Style) */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-outline-variant/30 transition-transform hover:-translate-y-1 duration-200">
            <span className="material-symbols-outlined text-secondary text-[40px] mb-3 drop-shadow-sm font-light">check_circle</span>
            <span className="text-on-surface-variant text-sm mb-1 font-body font-medium">نسبة الإنجاز</span>
            <span className="text-2xl font-extrabold text-on-surface font-headline">٧٥٪</span>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-outline-variant/30 transition-transform hover:-translate-y-1 duration-200">
            <span className="material-symbols-outlined text-tertiary text-[40px] mb-3 drop-shadow-sm font-light">pending</span>
            <span className="text-on-surface-variant text-sm mb-1 font-body font-medium">متأخرين</span>
            <span className="text-2xl font-extrabold text-on-surface font-headline">٥</span>
          </div>
        </div>

        {/* Student List Header */}
        <div className="flex justify-between items-center mb-6 px-1">
          <h3 className="text-xl font-bold text-on-surface font-headline">قائمة الطلاب</h3>
          <button className="text-primary font-bold text-sm flex items-center gap-1 hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors active:scale-95">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            تصفية
          </button>
        </div>

        {/* Student List */}
        <div className="space-y-4">
          
          {/* Student 1: Submitted */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl flex items-center justify-between shadow-sm border-r-4 border-secondary hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center overflow-hidden">
                <img className="w-full h-full object-cover" alt="Student" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD59s0y1K3_0mlIvCUcLiPeYxDCrCrEnBJPvUwnaYrm0jE849T7iksDC-So8WxGxRa5FFgy3MAwUkG0GL7MuEohwYtkXHNfmLXwecbSyxF7K23M_ZQPis4KDKr-jV1-db0fMxLINzVmXbs3dtE72bKQYEp7R3NU4ZC6JyTBqHIueGe-ojczs6MHHlcx7kcXpxQyFismBoGaDSD_HeCZpDlVzHMysd9xdzaGApn_15xoltSbTvCv8TQ-JEWuhyrW0DU7XhQYC64k1j0"/>
              </div>
              <div>
                <h4 className="font-bold text-on-surface font-headline text-[15px]">أحمد محمد</h4>
                <div className="items-center gap-1 text-on-secondary-container text-xs font-bold mt-1 bg-secondary-container/30 px-2 py-0.5 rounded-md inline-flex">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  تم التسليم
                </div>
              </div>
            </div>
            <button className="bg-primary/10 text-primary px-3 py-2 md:px-4 rounded-xl font-bold text-sm flex items-center gap-2 active:scale-95 transition-transform hover:bg-primary/20">
              <span className="hidden sm:inline">مشاهدة الحل</span>
              <span className="material-symbols-outlined text-[18px]">visibility</span>
            </button>
          </div>

          {/* Student 2: Not Submitted */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl flex items-center justify-between shadow-sm border-r-4 border-tertiary hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 opacity-80">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center overflow-hidden">
                <img className="w-full h-full object-cover grayscale-30" alt="Student" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_DAJ7evye7hQOM8ojoN0IhS6y4Z-sQqBlUTfqWhNt0O-XGZhpVc5QKXhaMAG5GaNgtHGPjZeYSLsG5QKOFJJ8hTEJGquvAvF3AMJlEqNJPBIFgdAScuDI8snPbI8LE_EMdCa2BVdsO2E0U7TvaGlEdjvtStwHtdqy8H2BWA5897TjSVozvJ-awChrKnxPdqAl-2JtyyOQumyvmSlBmxhgCePzvKEpBAxoubgC26MMksJrPDDFfzgQoyudxsc70yg4UvwfhsW9W_g"/>
              </div>
              <div>
                <h4 className="font-bold text-on-surface font-headline text-[15px]">سارة خالد</h4>
                <div className="items-center gap-1 text-tertiary text-xs font-bold mt-1 bg-tertiary-container/30 px-2 py-0.5 rounded-md inline-flex">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
                  لم يتم التسليم
                </div>
              </div>
            </div>
            <button className="bg-surface-container-high text-on-surface-variant px-4 py-2 rounded-xl font-bold text-sm active:scale-95 transition-transform hover:bg-surface-container-highest hover:text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              <span className="hidden sm:inline">تنبيه</span>
            </button>
          </div>

          {/* Student 3: Submitted */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl flex items-center justify-between shadow-sm border-r-4 border-secondary hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center overflow-hidden">
                <img className="w-full h-full object-cover" alt="Student" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQbDnBiauhVxRNSDFoUrSFhJNkkxhivHQskQjTYeqigpQ9_9e5vBwq4H5WNrRugH4_tQ9UcN9xpScKU3jQUgBi91oshCHRlQ3AZbF9IgafrE4OqaOzsa3bYqLxN9UUIXoRyJgs7kuARSSStyZ30GHJPe7kPtBGHlpwFW4gII8J2ZBf3H5rn9RmMm6w3kziGvi5-nGY4ocfX5o7km9YdmJA-rqWK1jHGTxYMccgU2b1F6iBfQlumMAdhyhhByPc8BolyoQ21xQcVUc"/>
              </div>
              <div>
                <h4 className="font-bold text-on-surface font-headline text-[15px]">محمد علي</h4>
                <div className="items-center gap-1 text-on-secondary-container text-xs font-bold mt-1 bg-secondary-container/30 px-2 py-0.5 rounded-md inline-flex">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  تم التسليم
                </div>
              </div>
            </div>
            <button className="bg-primary/10 text-primary px-3 py-2 md:px-4 rounded-xl font-bold text-sm flex items-center gap-2 active:scale-95 transition-transform hover:bg-primary/20">
              <span className="hidden sm:inline">مشاهدة الحل</span>
              <span className="material-symbols-outlined text-[18px]">visibility</span>
            </button>
          </div>

        </div>

      </main>

      <BottomNav />
    </div>
  );
}
