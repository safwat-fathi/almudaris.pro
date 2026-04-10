"use client";

import { useState } from "react";
import Image from "next/image";
import { mockStudents } from "@/data/mockData";
import { formatCurrency, formatDate } from "@/lib/format";

export default function PaymentsList() {
  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "unpaid">("all");

  const filteredStudents = mockStudents.filter(student => {
    if (filterStatus === "all") return true;
    return student.paymentStatus === filterStatus;
  });

  return (
    <>
      {/* Section Label */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold font-headline">حالة الدفع للطلاب</h2>
        <div className="flex gap-2 relative">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | "paid" | "unpaid")}
            className="appearance-none bg-surface-container-high px-4 py-2 pr-10 rounded-full text-sm font-medium hover:bg-surface-container-highest transition-all border-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="all">الكل</option>
            <option value="paid">مسدد</option>
            <option value="unpaid">غير مسدد</option>
          </select>
          <span className="material-symbols-outlined text-sm absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">filter_list</span>
        </div>
      </div>

      {/* High-Contrast Data Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm mb-12 pb-24 md:pb-0 overflow-visible">
        <div className="overflow-x-auto custom-scrollbar overflow-visible">
          <table className="w-full text-right border-collapse min-w-[600px] overflow-visible">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30">
                <th className="px-6 py-4 font-headline font-bold text-on-surface-variant text-sm">اسم الطالب</th>
                <th className="px-6 py-4 font-headline font-bold text-on-surface-variant text-sm">تاريخ الاستحقاق</th>
                <th className="px-6 py-4 font-headline font-bold text-on-surface-variant text-sm">المبلغ</th>
                <th className="px-6 py-4 font-headline font-bold text-on-surface-variant text-sm">حالة الدفع</th>
                <th className="px-6 py-4 font-headline font-bold text-on-surface-variant text-sm w-16">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                  <td className="px-6 py-4">
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
                        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-sm shrink-0">
                          {student.initials || student.name.substring(0,2)}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-on-surface font-headline block">{student.name}</span>
                        <span className="text-xs text-on-surface-variant">{student.group}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-on-surface">{formatDate(new Date('2024-05-01'))}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-on-surface">{formatCurrency(350)}</span>
                  </td>
                  <td className="px-6 py-4">
                    {student.paymentStatus === "paid" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-secondary-container text-on-secondary-container">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                        تم الدفع
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-error-container text-on-error-container">
                        <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                        غير مسدد
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-left relative">
                    {student.paymentStatus === "unpaid" ? (
                      <button className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors active:scale-95 shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">payments</span>
                        تسديد
                      </button>
                    ) : (
                      <button className="flex items-center gap-2 bg-surface-container-high text-on-surface px-4 py-2 rounded-full text-sm font-bold hover:bg-surface-container-highest transition-colors active:scale-95 shadow-sm border border-outline-variant/30">
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">receipt_long</span>
                        الإيصال
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="w-full py-12 flex flex-col items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
              <p>لا توجد نتائج مطابقة لخيارات التصفية</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
