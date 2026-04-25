import { SubmissionSheet } from '../../components/submissions/SubmissionSheet';
import { StatusBadge } from '../../components/ui/StatusBadge';

export default function HomeworkPage() {
  return (
    <div className="p-6 max-w-lg mx-auto min-h-screen bg-[var(--color-background)]">
      <header className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-[var(--color-on-surface)]">واجباتي 📚</h1>
      </header>

      <div className="flex flex-col gap-4">
        {/* Mock Homework Item */}
        <div className="bg-[var(--color-surface-container-lowest)] p-5 rounded-[var(--radius-lg)] shadow-sm border border-[var(--color-surface-container-highest)]">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-headline font-bold text-[var(--color-on-surface)]">الرياضيات - الدرس الأول</h2>
            <StatusBadge status="NOT_SUBMITTED" />
          </div>
          <p className="text-sm text-[var(--color-on-surface-variant)] font-body mb-4">أكمل التمارين من 1 إلى 5 في الكتاب</p>
          <div className="text-xs text-[var(--color-outline)] font-body mb-2">
            آخر موعد: 30 أبريل 2026
          </div>
          <SubmissionSheet homeworkId={101} title="الرياضيات - الدرس الأول" />
        </div>
      </div>
    </div>
  );
}
