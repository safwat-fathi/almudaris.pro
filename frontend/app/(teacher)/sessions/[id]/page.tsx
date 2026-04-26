import type { Metadata } from "next";
import SessionAttendanceScreen from "@/components/sessions/SessionAttendanceScreen";
import { groupsService } from "@/services/api/groups";
import { notFound } from "next/navigation";
import { AddHomeWorkSheet } from "@/components/homework/AddHomeWorkSheet";
import { toggleHomeworkStatus } from "@/app/actions/homework.actions";
import { homeworkService } from "@/services/api/homework";	
import Link from "next/link";

type Props = {
	params: Promise<{ id: string }>;
};

const fetchGroupData = async (id: number) => {
	try {
		const response = await groupsService.fetchGroup(id);
		return response.data;
	} catch {
		return null;
	}
};

const fetchHomeworksByGroupId = async (groupId: number) => {
	try {
		const response = await homeworkService.fetchHomeworkByGroupId(groupId);
		return response.data;
	} catch {
		return [];
	}
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const groupId = parseInt(id, 10);

	if (isNaN(groupId)) {
		return notFound();
	}

	const group = await fetchGroupData(groupId);
	if (!group) {
		return notFound();
	}

	return {
		title: group.title,
		description: group.notes,
	};
};

export default async function SessionDetailsPage({ params }: Props) {
	const { id } = await params;
	const groupId = parseInt(id, 10);

	if (isNaN(groupId)) {
		return notFound();
	}

	const group = await fetchGroupData(groupId);
	if (!group) {
		return notFound();
	}

	const homeworkList = await fetchHomeworksByGroupId(groupId);

	return (
		<>
			<main className="max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col">
				<SessionAttendanceScreen group={group} />

				<section className="p-6 rounded-lg pb-24 mt-4">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-headline font-bold text-[--color-on-surface]">
							الواجبات 📚
						</h2>
						<AddHomeWorkSheet groupId={groupId} />
					</div>

					<div className="flex flex-col gap-4 mt-4">
						{homeworkList.length === 0 ? (
							<div className="text-[--color-outline] text-sm py-8 text-center bg-[--color-surface-container] rounded-2xl">
								لا توجد واجبات حالياً.
							</div>
						) : (
							homeworkList.map(homework => (
								<Link
									href={`/sessions/${groupId}/homework/${homework.id}`}
									key={homework.id}
									className="p-4 bg-surface-container rounded-2xl flex justify-between items-center"
								>
									<div>
										<h3 className="font-bold text-on-surface">
											{homework.title}
										</h3>
										<p className="text-xs text-on-surface-variant mt-1">
											الحالة: {homework.is_open ? "مفتوح للتقديم" : "مغلق"}
										</p>
									</div>

									<form
										action={async () => {
											"use server";
											await toggleHomeworkStatus(
												homework.id,
												!homework.is_open,
											);
										}}
									>
										<button
											type="submit"
											className={`px-3 py-1 text-xs font-bold rounded-full ${
												homework.is_open
													? "bg-error text-on-error"
													: "bg-secondary text-on-secondary"
											}`}
										>
											{homework.is_open ? "إغلاق الواجب" : "فتح الواجب"}
										</button>
									</form>
								</Link>
							))
						)}
					</div>
				</section>
			</main>
		</>
	);
}