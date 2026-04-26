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
      <div className="bg-surface-container-low p-6 rounded-lg flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-secondary text-4xl mb-2">check_circle</span>
        <span className="text-on-surface-variant text-sm mb-1">نسبة الإنجاز</span>
        <span className="text-2xl font-bold text-on-surface">{completionPercentage}٪</span>
      </div>
      <div className="bg-surface-container-low p-6 rounded-lg flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-tertiary text-4xl mb-2">pending</span>
        <span className="text-on-surface-variant text-sm mb-1">متأخرين</span>
        <span className="text-2xl font-bold text-on-surface">{delayedCount}</span>
      </div>
    </div>
  );
}
