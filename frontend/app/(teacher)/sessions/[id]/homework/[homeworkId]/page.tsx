import { StatusBadge } from '../../../../../../components/ui/StatusBadge';
import { SubmissionDetails } from '../../../../../../components/submissions/SubmissionDetails';
import Link from "next/link";
import { groupsService } from "@/services/api/groups";
import { homeworkService } from "@/services/api/homework";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

async function getSubmissions(homeworkId: string) {
  // Mock data for MVP
  return [
    { student_id: 1, student_name: 'Ahmed', status: 'SUBMITTED', submission: { id: 1, answer_text: 'My answer 1' } },
    { student_id: 2, student_name: 'Sarah', status: 'MISSING', submission: null },
    { student_id: 3, student_name: 'Omar', status: 'LATE', submission: { id: 2, answer_text: 'Sorry I am late', attachments: [] } },
  ];
}

export default async function HomeworkSubmissionsPage({
	params,
}: {
	params: Promise<{ id: string; homeworkId: string }>;
}) {
	const { id, homeworkId } = await params;
	const submissionsResponse =
		await homeworkService.getSubmissionsByHomeworkId(homeworkId);
	const group = await groupsService.fetchGroup(parseInt(id, 10));
	const homeworksResponse = await homeworkService.fetchHomeworkByGroupId(
		parseInt(id, 10),
	);

	if (
		!group ||
		!group.data ||
		!homeworksResponse ||
		!homeworksResponse.data ||
		!submissionsResponse ||
		!submissionsResponse.data
	) {
		return notFound();
	}

	const homework = homeworksResponse.data.find(
		(homework: any) => homework.id === parseInt(homeworkId, 10),
	);

	return (
		<div className="w-full p-6 mx-auto min-h-screen bg-background">
			<header className="mb-8 flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<Link
						href={`/sessions/${id}`}
						className="flex items-center gap-2 text-primary font-bold"
					>
						<ArrowRightIcon className="size-5" />
						العودة للحصة
					</Link>
					<h1 className="text-center text-3xl font-headline font-bold text-on-surface">
						مراجعة الواجب
					</h1>
				</div>
				<div className="flex flex-col items-center gap-2">
					<p className="text-on-surface-variant ">الحصة: {group.data.title}</p>
					<p className="text-on-surface-variant ">الواجب: {homework?.title}</p>
					{homework?.grade_label && (
						<p className="text-primary font-bold text-sm">{homework.grade_label}</p>
					)}
				</div>
			</header>

			<div className="flex flex-col gap-4 w-full min-w-[148px]">
				{submissionsResponse.data.map((student: any) => (
					<div
						key={student.student_id}
						className="bg-surface-container-lowest p-5 rounded-lg shadow-sm border border-surface-container-highest "
					>
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-lg font-headline font-bold text-on-surface">
								{student.student_name}
							</h2>
							<StatusBadge status={student.status} />
						</div>

						{student.submission ? (
							<SubmissionDetails submission={student.submission} />
						) : (
							<div className="text-outline text-sm py-4 text-center bg-surface-container rounded-2xl">
								لا يوجد تقديم حتى الآن.
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
