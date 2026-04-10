import type { Metadata } from "next";
import ComingSoon from "@/components/ui/ComingSoon";

export const metadata: Metadata = {
  title: "المحادثة | Al-Mudaris Pro",
  description: "ميزة المحادثة ستكون متاحة قريباً",
};

export default function ChatComingSoonPage() {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">

      <ComingSoon 
        title="ميزة المحادثة ستكون متاحة قريبًا 💬" 
        description="نحن نعمل بجد لتوفير أفضل وأسرع تجربة تواصل بين الطالب والمدرس. شكراً لصبرك وانضمامك لمجتمع Al-Mudaris Pro."
      />
    </div>
  );
}
