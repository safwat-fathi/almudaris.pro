'use client';

import { useState } from 'react';
import { submitHomework } from '../../app/actions/submissions.actions';
import { StatusBadge } from '../ui/StatusBadge';

export function SubmissionSheet({ homeworkId, title }: { homeworkId: number, title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Mock student ID
  const studentId = 2;

  async function handleSubmit(formData: FormData) {
    formData.append('homework_id', homeworkId.toString());
    formData.append('student_id', studentId.toString());
    
    const res = await submitHomework(formData);
    
    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      setIsOpen(false);
      setError(null);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] rounded-full font-headline text-sm font-bold w-full mt-4"
      >
        تقديم الواجب
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-[var(--color-surface)] w-full max-w-md p-6 rounded-t-3xl sm:rounded-[3rem] shadow-xl relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)]"
            >
              ×
            </button>
            <h2 className="text-2xl font-headline font-bold text-[var(--color-on-surface)] mb-2 text-center">{title}</h2>
            <div className="flex justify-center mb-4">
              <StatusBadge status="NOT_SUBMITTED" />
            </div>

            {/* Late Warning Mock (should be based on actual due_date comparison) */}
            <div className="mb-6 p-3 bg-orange-100 text-orange-800 rounded-2xl text-sm font-bold text-center">
              سيتم تسجيل هذا الواجب كمتأخر
            </div>
            
            {error && <div className="mb-4 p-3 bg-[var(--color-error-container)] text-[var(--color-on-error-container)] rounded-2xl text-sm">{error}</div>}

            <form action={handleSubmit} className="flex flex-col gap-4 font-body">
              <div>
                <textarea 
                  name="answer_text" 
                  placeholder="إجابتك..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                />
              </div>
              <div className="text-xs text-[var(--color-on-surface-variant)] text-center">
                إرفاق الملفات غير مدعوم في هذه النسخة التجريبية
              </div>
              <button 
                type="submit"
                className="mt-2 w-full py-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-full font-headline font-bold text-lg hover:bg-[var(--color-primary-container)] transition-colors"
              >
                تأكيد التقديم
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
