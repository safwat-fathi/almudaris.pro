import type { Metadata } from "next";
import SessionAttendanceScreen from "@/components/sessions/SessionAttendanceScreen";
import { groupsService } from "@/services/api/groups";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "تفاصيل الجلسة",
  description: "تفاصيل الجلسة التعليمية — سجل الحضور والغياب وإدارة الطلاب",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SessionDetailsPage({ params }: Props) {
  const { id } = await params;
  const groupId = parseInt(id, 10);

	if (isNaN(groupId)) {
		return notFound();
	}

	let group;
	try {
		const response = await groupsService.fetchGroup(groupId);
		group = response.data;
	} catch {
		return notFound();
	}

  return (
		<>
			<main className="max-w-5xl mx-auto w-full">
				<SessionAttendanceScreen group={group} />
			</main>
		</>
	);
}
