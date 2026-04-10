import React from "react";

export interface HomeworkStatsGridProps {
  completionPercentage: number;
  delayedCount: number;
}

export function HomeworkStatsGrid({
  completionPercentage,
  delayedCount,
}: HomeworkStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-10">
      <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-outline-variant/30 transition-transform hover:-translate-y-1 duration-200">
        <span className="material-symbols-outlined text-secondary text-[40px] mb-3 drop-shadow-sm font-light">check_circle</span>
        <span className="text-on-surface-variant text-sm mb-1 font-body font-medium">نسبة الإنجاز</span>
        <span className="text-2xl font-extrabold text-on-surface font-headline">{completionPercentage}٪</span>
      </div>
      <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-outline-variant/30 transition-transform hover:-translate-y-1 duration-200">
        <span className="material-symbols-outlined text-tertiary text-[40px] mb-3 drop-shadow-sm font-light">pending</span>
        <span className="text-on-surface-variant text-sm mb-1 font-body font-medium">متأخرين</span>
        <span className="text-2xl font-extrabold text-on-surface font-headline">{delayedCount}</span>
      </div>
    </div>
  );
}
