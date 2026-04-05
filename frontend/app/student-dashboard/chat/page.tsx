import type { Metadata } from "next";
import DashboardBottomNav from "@/components/layout/DashboardBottomNav";
import ComingSoon from "@/components/ui/ComingSoon";

export const metadata: Metadata = {
  title: "المحادثة | Al-Mudaris Pro",
  description: "ميزة المحادثة ستكون متاحة قريباً",
};

export default function ChatComingSoonPage() {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="bg-surface sticky top-0 z-50 transition-colors duration-200 ease-in-out">
        <div className="flex items-center justify-between px-8 py-4 w-full max-w-full">
          <div className="flex items-center gap-4">
            <h1 className="font-manrope font-bold text-2xl text-primary leading-none">
              المحادثة
            </h1>
          </div>
          <div className="p-2 rounded-full hover:bg-primary/10 cursor-pointer text-outline">
            <span className="material-symbols-outlined">notifications</span>
          </div>
        </div>
      </header>

      <ComingSoon 
        title="ميزة المحادثة ستكون متاحة قريبًا 💬" 
        description="نحن نعمل بجد لتوفير أفضل وأسرع تجربة تواصل بين الطالب والمدرس. شكراً لصبرك وانضمامك لمجتمع Al-Mudaris Pro."
      />

      <DashboardBottomNav />
    </div>
  );
}
