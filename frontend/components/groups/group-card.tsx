import React from 'react';
import { Group } from '@/services/api/groups';
import { formatTimeUI } from '@/lib/format';

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  // Simple MVP logic: Display stored times
  const isOnline = group.location_type === "Online";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm rtl hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-gray-800">{group.title || "مجموعة تعليمية"}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          group.status === 'Completed' ? 'bg-green-100 text-green-800' :
          group.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {group.status === 'Scheduled' ? 'قادمة' : group.status === 'Completed' ? 'مكتملة' : 'ملغاة'}
        </span>
      </div>
      
      <div className="text-sm text-gray-600 space-y-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-gray-400">calendar_today</span>
          <span>{group.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-gray-400">schedule</span>
          <span>{formatTimeUI(group.start_time)} - {formatTimeUI(group.end_time)} ({group.duration_minutes} دقيقة)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-gray-400">
            {isOnline ? 'laptop_mac' : 'location_on'}
          </span>
          <span>{isOnline ? 'أونلاين' : group.location_place}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-gray-400">group</span>
          <span>{group.students?.length || 0} طلاب مسجلين</span>
        </div>
      </div>
    </div>
  );
}