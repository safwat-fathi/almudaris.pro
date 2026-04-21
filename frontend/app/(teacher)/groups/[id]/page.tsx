import React from 'react';
import { GroupsApi } from '@/services/api/groups';
import { GroupForm } from '@/components/groups/group-form';
import { AttendanceForm } from '@/components/groups/attendance-form';
import Link from 'next/link';

export default async function EditGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const groupId = parseInt(id, 10);
  
  let group;
  let error = null;

  try {
    group = await GroupsApi.fetchGroup(groupId);
  } catch (err: unknown) {
    const errorObj = err as Error;
    error = errorObj.message || "Failed to fetch group details";
  }

  // Fetch mock students for MVP
  const students = [
    { id: 1, name: "أحمد محمد" },
    { id: 2, name: "يوسف خالد" },
    { id: 3, name: "مريم علي" },
  ];

  if (error) {
    return (
      <main className="p-4 max-w-xl mx-auto rtl pb-20">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg text-sm text-center">
          {error}
        </div>
      </main>
    );
  }

  if (!group) return null;

  const isEditable = group.status === 'Scheduled';

  return (
    <main className="p-4 max-w-xl mx-auto rtl pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/groups" className="text-gray-500 hover:text-gray-800 transition-colors">
            <span className="material-symbols-outlined rtl:rotate-180">arrow_back</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditable ? 'تعديل المجموعة' : 'تفاصيل المجموعة'}
          </h1>
        </div>
        {!isEditable && (
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
            group.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {group.status === 'Completed' ? 'مكتملة' : 'ملغاة'}
          </span>
        )}
      </div>
      
      {isEditable ? (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <GroupForm students={students} group={group} />
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner">
          <p className="text-gray-500 text-center text-sm py-4">
            هذه المجموعة {group.status === 'Completed' ? 'مكتملة' : 'ملغاة'} ولا يمكن تعديل تفاصيلها.
            يمكنك فقط إضافة ملاحظات الطلاب أو حضورهم إذا كانت مكتملة.
          </p>
        </div>
      )}
      
      {group.status !== 'Cancelled' && (
        <AttendanceForm group={group} />
      )}
    </main>
  );
}