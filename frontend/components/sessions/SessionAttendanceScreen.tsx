"use client";

import { useState, useTransition } from "react";
import { formatNumber, formatDate, formatTimeUI } from "@/lib/format";
import { useRouter } from "next/navigation";
import { Group } from "@/services/api/groups";
import { updateAttendanceAction, markCompleteAction } from "@/app/actions/group.actions";

type UIStatus = "present" | "absent" | "";

export default function SessionAttendanceScreen({ group }: { group: Group }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Map backend students to local attendance state
  const [attendance, setAttendance] = useState<Record<number, UIStatus>>(() => {
    const initial: Record<number, UIStatus> = {};
    group.students.forEach((s) => {
      initial[s.student_id] = s.attendance_status === "Present" ? "present" : s.attendance_status === "Absent" ? "absent" : "";
    });
    return initial;
  });

  // Local payments state (mock for now as backend doesn't support it yet)
  const [payments, setPayments] = useState<Record<number, boolean>>({});

  const handleAttendance = async (studentId: number, status: UIStatus) => {
    const newStatus = attendance[studentId] === status ? "" : status;
    const backendStatus = newStatus === "present" ? "Present" : newStatus === "absent" ? "Absent" : "Not set";
    
    setAttendance((prev) => ({
      ...prev,
      [studentId]: newStatus,
    }));

    startTransition(async () => {
      const formData = new FormData();
      formData.append(`student_${studentId}_status`, backendStatus);
      await updateAttendanceAction(group.id, undefined, formData);
    });
  };

  const handlePayment = (studentId: number) => {
    setPayments((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const attendAll = () => {
    const newAttendance: Record<number, UIStatus> = {};
    const formData = new FormData();
    
    group.students.forEach((s) => {
      newAttendance[s.student_id] = "present";
      formData.append(`student_${s.student_id}_status`, "Present");
    });
    
    setAttendance(newAttendance);
    
    startTransition(async () => {
      await updateAttendanceAction(group.id, undefined, formData);
    });
  };

  const handleMarkComplete = () => {
    startTransition(async () => {
      await markCompleteAction(group.id);
      router.refresh();
    });
  };

  const presentCount = Object.values(attendance).filter((s) => s === "present").length;
  const unpaidCount = group.students.length - Object.values(payments).filter(Boolean).length;
  const totalCount = group.students.length;

  return (
    <>
      {/* Session Switcher Navigation - Simplified for now */}
      <nav className="bg-surface-container-lowest border-b border-outline-variant/20 sticky top-16 z-40">
        <div className="flex items-center justify-between h-14 px-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-1 text-outline hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-xl" style={{ direction: "ltr" }}>arrow_forward</span>
            <span className="text-xs font-bold hidden sm:inline">رجوع</span>
          </button>
          
          <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full">
            <span className="text-sm font-extrabold text-on-surface">الحصة الحالية</span>
          </div>
          
          <div className="w-20"></div>
        </div>
      </nav>

      {/* Session Header Info */}
      <div className="px-6 py-8 bg-linear-to-b from-surface-container-lowest to-surface">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-on-surface">{group.title || "حصة تعليمية"}</h2>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-outline font-medium text-sm">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">location_on</span> 
                {group.location_type === 'Online' ? 'أونلاين' : (group.location_place || 'سنتر')}
              </span>
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">schedule</span> {formatTimeUI(group.start_time)}</span>
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">calendar_today</span> {formatDate(group.date)}</span>
            </div>
          </div>
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-3 mt-6">
          <div className="flex-1 bg-surface-container-low p-3 rounded-xl flex flex-col items-center justify-center">
            <span className="text-[10px] text-outline uppercase tracking-wider font-bold">إجمالي الطلاب</span>
            <span className="text-lg font-bold text-on-surface">{formatNumber(totalCount)}</span>
          </div>
          <div className="flex-1 bg-secondary-container/30 p-3 rounded-xl flex flex-col items-center justify-center border border-secondary-container">
            <span className="text-[10px] text-on-secondary-container uppercase tracking-wider font-bold">حضر الآن</span>
            <span className="text-lg font-bold text-on-secondary-container">{formatNumber(presentCount)}</span>
          </div>
          <div className="flex-1 bg-tertiary-container/10 p-3 rounded-xl flex flex-col items-center justify-center border border-tertiary-container/20">
            <span className="text-[10px] text-on-tertiary-container uppercase tracking-wider font-bold">لم يدفع</span>
            <span className="text-lg font-bold text-on-tertiary-container">{formatNumber(unpaidCount)}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar">
        <button 
          onClick={attendAll} 
          disabled={isPending || group.status === 'Cancelled'}
          className="flex items-center gap-2 whitespace-nowrap bg-primary text-on-primary px-5 py-2.5 rounded-full font-bold text-sm shadow-md active:scale-95 transition-all disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-lg">rule</span>
          <span>تحضير الكل</span>
        </button>
        {group.status === 'Scheduled' && (
          <button 
            onClick={handleMarkComplete}
            disabled={isPending}
            className="flex items-center gap-2 whitespace-nowrap bg-green-600 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md active:scale-95 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-lg">check_circle</span>
            <span>إكمال الحصة</span>
          </button>
        )}
        <button className="flex items-center gap-2 whitespace-nowrap bg-surface-container-highest text-on-surface px-5 py-2.5 rounded-full font-bold text-sm hover:bg-primary-fixed transition-all">
          <span className="material-symbols-outlined text-lg">payments</span>
          <span>تحصيل الكل</span>
        </button>
      </div>

      {/* Student List Area */}
      <section className="px-6 mt-2 space-y-3 pb-32">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-outline">قائمة الطلاب</h3>
          <span className="text-xs font-medium text-primary">تم الفرز حسب: الاسم</span>
        </div>

        {group.students.map((gs) => (
          <div key={gs.student_id} className="bg-surface-container-lowest p-4 rounded-xl flex justify-between items-center shadow-sm border border-outline-variant/10 flex-wrap gap-y-3">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-full bg-primary-fixed/50 flex items-center justify-center font-bold text-primary-container text-lg shadow-inner">
                {gs.student_name.substring(0, 1)}
              </div>
              
              <div className="flex flex-col">
                <span className="font-bold text-on-surface">{gs.student_name}</span>
                {payments[gs.student_id] ? (
                  <span className="text-[10px] text-outline">تم الدفع</span>
                ) : (
                  <span className="text-[10px] text-tertiary font-bold">لم يتم الدفع</span>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              {attendance[gs.student_id] === "present" ? (
                <button 
                  onClick={() => handleAttendance(gs.student_id, "present")} 
                  disabled={isPending || group.status === 'Cancelled'}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container font-bold text-xs ring-1 ring-secondary/20 hover:bg-secondary-container/80 transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span>حاضر</span>
                </button>
              ) : attendance[gs.student_id] === "absent" ? (
                <button 
                  onClick={() => handleAttendance(gs.student_id, "absent")} 
                  disabled={isPending || group.status === 'Cancelled'}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-tertiary-container text-on-tertiary-container font-bold text-xs hover:bg-tertiary-container/80 transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
                  <span>غايب</span>
                </button>
              ) : (
                <button 
                  onClick={() => handleAttendance(gs.student_id, "present")} 
                  disabled={isPending || group.status === 'Cancelled'}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant font-bold text-xs border border-outline-variant/20 hover:bg-surface-variant transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base">circle</span>
                  <span>تحضير</span>
                </button>
              )}
              
              <button 
                onClick={() => handlePayment(gs.student_id)}
                disabled={isPending || group.status === 'Cancelled'}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs transition-all ${
                  payments[gs.student_id] 
                    ? "bg-primary-fixed text-primary ring-1 ring-primary/20 hover:bg-primary-fixed/80" 
                    : "bg-surface-container-high text-on-surface-variant border border-outline-variant/20 hover:bg-surface-variant"
                }`}
              >
                {payments[gs.student_id] ? (
                  <>
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                    <span>دفع</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base text-[#f59e0b]">warning</span>
                    <span>لم يدفع</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Floating Action Button - Disabled for now */}
      {/* <button className="fixed bottom-28 left-6 w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40">
        <span className="material-symbols-outlined text-2xl">person_add</span>
        <span className="sr-only">إضافة طالب للحصة</span>
      </button> */}
    </>
  );
}
