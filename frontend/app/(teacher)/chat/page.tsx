import type { Metadata } from "next";
import ComingSoon from "@/components/ui/ComingSoon";

export const metadata: Metadata = {
  title: "المحادثة | Al-Mudaris Pro",
  description: "ميزة المحادثة ستكون متاحة قريباً",
};

export default function ChatComingSoonPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 mt-6 pb-32">
      <ComingSoon 
        title="ميزة المحادثة ستكون متاحة قريبًا 💬" 
        description="نحن نعمل بجد لتوفير أفضل وأسرع تجربة تواصل بين الطالب والمدرس. شكراً لصبرك وانضمامك لمجتمع Al-Mudaris Pro."
      />
    </main>
  );
}
