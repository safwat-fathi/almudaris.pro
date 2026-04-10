"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { mockStudents } from "@/data/mockData";
import { formatNumber } from "@/lib/format";

export default function StudentsTable() {
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const toggleActionMenu = (id: string) => {
    setOpenActionId(openActionId === id ? null : id);
  };

  if (mockStudents.length === 0) {
    return (
      <div className="mt-20 flex flex-col items-center text-center max-w-sm mx-auto">
        <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-4xl text-outline" data-icon="group_off">group_off</span>
        </div>
        <h3 className="text-2xl font-bold text-on-surface mb-2 font-headline">لسه مفيش طلاب</h3>
        <p className="text-on-surface-variant mb-8 font-body">ابدأ في بناء مجتمعك التعليمي من خلال دعوة أول طالب لك الآن.</p>
        <Link href="/students/invite" className="flex items-center justify-center bg-primary text-on-primary h-14 px-10 rounded-lg font-bold shadow-[0_8px_24px_rgba(26,115,232,0.25)] hover:-translate-y-0.5 active:scale-95 transition-all">
          ابدأ بدعوة الطلاب
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-3 overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-outline-variant/20 transition-all">
        <div className="p-6 overflow-x-auto custom-scrollbar">
          <table className="w-full text-right border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-surface-container-high">
                <th className="pb-4 font-bold text-on-surface-variant px-4 font-headline">👤 الاسم</th>
                <th className="pb-4 font-bold text-on-surface-variant px-4 font-headline">📱 الهاتف</th>
                <th className="pb-4 font-bold text-on-surface-variant px-4 text-center font-headline">📊 الحالة</th>
                <th className="pb-4 font-bold text-on-surface-variant px-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {mockStudents.map((student) => {
                // Determine a mock status and styling just to demonstrate the design
                const isActive = student.paymentStatus === "paid";
                
                return (
                  <tr key={student.id} className="group hover:bg-surface-container-low transition-colors">
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-3">
                        {student.avatar ? (
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high shrink-0 relative">
                            <Image 
                              src={student.avatar}
                              alt={student.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                              suppressHydrationWarning
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-extrabold text-sm shrink-0">
                            {student.initials || student.name.charAt(0)}
                          </div>
                        )}
                        <span className="font-semibold text-on-surface font-headline">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-5 px-4 font-body tracking-wider text-on-surface-variant" dir="ltr"> {/* Phone numbers generally left-to-right format */}
                      +{formatNumber(20)} {formatNumber(100)} {formatNumber(Math.floor(Math.random() * 900000) + 100000, { useGrouping: false })}
                    </td>
                    <td className="py-5 px-4 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide ${isActive ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-high text-on-surface-variant"}`}>
                        {isActive ? "نشط" : "لم ينضم بعد"}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-left relative">
                      <button 
                        onClick={() => toggleActionMenu(student.id)}
                        onBlur={() => setTimeout(() => setOpenActionId(null), 200)}
                        className="p-2 hover:bg-surface-container-highest rounded-full transition-colors text-outline active:scale-95"
                      >
                        <span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
                      </button>

                      {openActionId === student.id && (
                        <div className="absolute left-6 top-14 w-48 bg-surface-container-lowest rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-outline-variant/20 py-2 z-50 flex flex-col items-stretch text-right animate-in fade-in slide-in-from-top-2 duration-150">
                          <Link href={`/students/${student.id}`} className="px-4 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-3 w-full text-right font-body">
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                            تفاصيل الطالب
                          </Link>
                          <button className="px-4 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-3 font-body">
                            <span className="material-symbols-outlined text-[18px]">contact_mail</span>
                            إعادة إرسال دعوة
                          </button>
                          <div className="h-px bg-outline-variant/20 my-1 w-full shrink-0"></div>
                          <button className="px-4 py-2.5 text-sm font-bold text-error hover:bg-error-container/50 transition-colors flex items-center gap-3 font-body">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                            حذف الطالب
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
