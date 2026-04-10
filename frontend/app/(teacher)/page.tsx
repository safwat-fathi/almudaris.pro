import type { Metadata } from "next";
import Greeting from "@/components/home/Greeting";
import SessionsList from "@/components/home/SessionsList";
import QuickActions from "@/components/home/QuickActions";
import AlertsList from "@/components/home/AlertsList";

export const metadata: Metadata = {
  title: "الرئيسية",
  description: "لوحة التحكم الرئيسية — عرض الجلسات القادمة والتنبيهات والإجراءات السريعة",
};

export default function Home() {
  return (
    <>
      <main className="max-w-xl mx-auto px-6 mt-8 space-y-10 w-full mb-24">
        <Greeting />
        <SessionsList />
        <QuickActions />
        <AlertsList />
      </main>
    </>
  );
}
