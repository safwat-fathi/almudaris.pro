import React from 'react';
import { GroupForm } from '@/components/groups/group-form';
import Link from 'next/link';

export default async function NewGroupPage() {
  // Fetch mock students for MVP since no students API exists yet
  const students = [
    { id: 1, name: "أحمد محمد" },
    { id: 2, name: "يوسف خالد" },
    { id: 3, name: "مريم علي" },
  ];

  return (
    <main className="p-4 max-w-xl mx-auto rtl pb-20">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/groups" className="text-gray-500 hover:text-gray-800 transition-colors">
          <span className="material-symbols-outlined rtl:rotate-180">arrow_back</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">إنشاء مجموعة جديدة</h1>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <GroupForm students={students} />
      </div>
    </main>
  );
}