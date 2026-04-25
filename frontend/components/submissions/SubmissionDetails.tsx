'use client';

import { useState } from 'react';

export function SubmissionDetails({ submission }: { submission: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-[var(--color-primary)] font-bold text-sm"
      >
        {isOpen ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
      </button>

      {isOpen && (
        <div className="mt-4 p-4 bg-[var(--color-surface-container-highest)] rounded-2xl">
          <p className="text-[var(--color-on-surface)] font-body whitespace-pre-wrap text-sm">
            {submission.answer_text || 'لا توجد إجابة نصية.'}
          </p>
          
          {submission.attachments && submission.attachments.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[var(--color-outline-variant)]">
              <h4 className="text-xs font-bold text-[var(--color-on-surface-variant)] mb-2">المرفقات:</h4>
              <ul className="flex flex-col gap-2">
                {submission.attachments.map((att: any, idx: number) => (
                  <li key={idx}>
                    <a href={att.file_url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] text-sm underline">
                      مرفق {idx + 1} ({att.file_type})
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
