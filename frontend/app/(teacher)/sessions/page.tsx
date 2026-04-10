import type { Metadata } from "next";
import SessionsHeader from "@/components/sessions/SessionsHeader";
import SessionsList from "@/components/sessions/SessionsList";

export const metadata: Metadata = {
  title: "الجلسات",
  description: "عرض وإدارة جميع الجلسات التعليمية — جدول الحصص والحضور والتفاصيل",
};


export default function SessionsPage() {
  return (
    <>
      <main className="max-w-5xl mx-auto px-4 md:px-8 pt-6 md:pt-8 w-full pb-32">
        <SessionsHeader />
        <SessionsList />
      </main>
    </>
  );
}
