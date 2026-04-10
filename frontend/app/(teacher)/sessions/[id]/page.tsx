import type { Metadata } from "next";
import SessionAttendanceScreen from "@/components/sessions/SessionAttendanceScreen";

export const metadata: Metadata = {
  title: "تفاصيل الجلسة",
  description: "تفاصيل الجلسة التعليمية — سجل الحضور والغياب وإدارة الطلاب",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SessionDetailsPage({ params }: Props) {
  const { id } = await params;

  return (
    <>
      <main className="max-w-5xl mx-auto w-full">
        <SessionAttendanceScreen sessionId={id} />
      </main>
    </>
  );
}
