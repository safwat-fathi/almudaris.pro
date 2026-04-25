'use client';

type StatusType = 'SUBMITTED' | 'LATE' | 'MISSING' | 'NOT_SUBMITTED';

interface StatusBadgeProps {
  status: StatusType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    SUBMITTED: { label: 'تم التقديم', colors: 'bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]' },
    LATE: { label: 'متأخر', colors: 'bg-orange-100 text-orange-800' }, // Using basic tailwind colors as fallback for orange
    MISSING: { label: 'مفقود', colors: 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)]' },
    NOT_SUBMITTED: { label: 'لم يتم التقديم', colors: 'bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)]' },
  };

  const { label, colors } = config[status] || config.NOT_SUBMITTED;

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-bold font-label ${colors}`}>
      {label}
    </span>
  );
}
