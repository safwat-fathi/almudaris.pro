import type { Metadata } from "next";
import TopAppBar from "@/components/layout/TopAppBar";
import Greeting from "@/components/home/Greeting";
import SessionsList from "@/components/home/SessionsList";
import QuickActions from "@/components/home/QuickActions";
import AlertsList from "@/components/home/AlertsList";
import BottomNav from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "الرئيسية",
  description: "لوحة التحكم الرئيسية — عرض الجلسات القادمة والتنبيهات والإجراءات السريعة",
};

export default function Home() {
  return (
    <>
      <TopAppBar />
      <main className="max-w-xl mx-auto px-6 mt-8 space-y-10 w-full mb-8">
        <Greeting />
        <SessionsList />
        <QuickActions />
        <AlertsList />
      </main>
      <BottomNav />
    </>
  );
}
