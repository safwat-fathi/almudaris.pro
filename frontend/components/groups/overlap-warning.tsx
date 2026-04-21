import React from 'react';

interface OverlapWarningProps {
  warnings?: string[];
}

export function OverlapWarning({ warnings }: OverlapWarningProps) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4 rtl">
      <div className="flex items-center mb-2">
        <span className="material-symbols-outlined ml-2 text-red-600">warning</span>
        <h3 className="font-bold text-sm">تنبيه: تعارض في المواعيد</h3>
      </div>
      <ul className="list-disc list-inside text-sm pr-6">
        {warnings.map((warning, idx) => (
          <li key={idx}>{warning}</li>
        ))}
      </ul>
    </div>
  );
}