import { StatusBadge } from '../../../../../../components/ui/StatusBadge';
import { SubmissionDetails } from '../../../../../../components/submissions/SubmissionDetails';

async function getSubmissions(homeworkId: string) {
  // Mock data for MVP
  return [
    { student_id: 1, student_name: 'Ahmed', status: 'SUBMITTED', submission: { id: 1, answer_text: 'My answer 1' } },
    { student_id: 2, student_name: 'Sarah', status: 'MISSING', submission: null },
    { student_id: 3, student_name: 'Omar', status: 'LATE', submission: { id: 2, answer_text: 'Sorry I am late', attachments: [] } },
  ];
}

export default async function HomeworkSubmissionsPage({ params }: { params: { id: string, homeworkId: string } }) {
  const submissions = await getSubmissions(params.homeworkId);

  return (
    <div className="p-6 max-w-2xl mx-auto min-h-screen bg-[var(--color-background)]">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold text-[var(--color-on-surface)]">مراجعة الواجب</h1>
          <p className="text-[var(--color-on-surface-variant)] mt-2">الحصة: {params.id}</p>
        </div>
        <a href={`/sessions/${params.id}`} className="text-[var(--color-primary)] font-bold">العودة للحصة</a>
      </header>

      <div className="flex flex-col gap-4">
        {submissions.map((student: any) => (
          <div key={student.student_id} className="bg-[var(--color-surface-container-lowest)] p-5 rounded-[var(--radius-lg)] shadow-sm border border-[var(--color-surface-container-highest)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-headline font-bold text-[var(--color-on-surface)]">{student.student_name}</h2>
              <StatusBadge status={student.status} />
            </div>
            
            {student.submission ? (
              <SubmissionDetails submission={student.submission} />
            ) : (
              <div className="text-[var(--color-outline)] text-sm py-4 text-center bg-[var(--color-surface-container)] rounded-2xl">
                لا يوجد تقديم حتى الآن.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
