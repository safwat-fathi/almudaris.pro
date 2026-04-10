"use client";

import { useState } from "react";
import { mockSessions, mockStudents } from "@/data/mockData";
import { formatNumber, formatDate, formatCurrency } from "@/lib/format";
import { useRouter } from "next/navigation";

type AttendanceStatus = "present" | "absent" | "";
type PaymentStatus = "paid" | "unpaid" | "";

export default function SessionAttendanceScreen({ sessionId }: { sessionId: string }) {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = mockSessions.findIndex((s) => s.id === sessionId);
    return idx >= 0 ? idx : 0;
  });

  const session = mockSessions[currentIndex];

  const goNext = () => {
    setCurrentIndex((i) => (i + 1) % mockSessions.length);
  };
  
  const goPrev = () => {
    setCurrentIndex((i) => (i - 1 + mockSessions.length) % mockSessions.length);
  };

  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [payments, setPayments] = useState<Record<string, PaymentStatus>>(() => {
    const initial: Record<string, PaymentStatus> = {};
    mockStudents.forEach((s) => {
      initial[s.id] = s.paymentStatus === "paid" ? "paid" : "unpaid";
    });
    return initial;
  });

  const handleAttendance = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === status ? "" : status,
    }));
  };

  const handlePayment = (studentId: string) => {
    setPayments((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "paid" ? "unpaid" : "paid",
    }));
  };

  const attendAll = () => {
    const allPresent: Record<string, AttendanceStatus> = {};
    mockStudents.forEach((s) => {
      allPresent[s.id] = "present";
    });
    setAttendance(allPresent);
  };

  const presentCount = Object.values(attendance).filter((s) => s === "present").length;
  const unpaidCount = Object.values(payments).filter((s) => s === "unpaid").length;
  const totalCount = mockStudents.length;

  return (
    <>
      {/* Session Switcher Navigation */}
      <nav className="bg-surface-container-lowest border-b border-outline-variant/20 sticky top-16 z-40">
        <div className="flex items-center justify-between h-14 px-4">
          <button 
            onClick={goPrev}
            className="flex items-center gap-1 text-outline hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-xl" style={{ direction: "ltr" }}>arrow_forward</span>
            <span className="text-xs font-bold hidden sm:inline">الحصة السابقة</span>
          </button>
          
          <button className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full hover:bg-surface-container-high transition-all active:scale-95">
            <span className="text-sm font-extrabold text-on-surface">الحصة الحالية</span>
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
          
          <button 
            onClick={goNext}
            className="flex items-center gap-1 text-outline hover:text-primary transition-colors"
          >
            <span className="text-xs font-bold hidden sm:inline">الحصة التالية</span>
            <span className="material-symbols-outlined text-xl" style={{ direction: "ltr" }}>arrow_back</span>
          </button>
        </div>
      </nav>

      {/* Session Header Info */}
      <div className="px-6 py-8 bg-linear-to-b from-surface-container-lowest to-surface">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-on-surface">{session.title}</h2>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-outline font-medium text-sm">
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">location_on</span> {session.location}</span>
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">schedule</span> {session.time}</span>
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">calendar_today</span> {formatDate(session.date)}</span>
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
        <button onClick={attendAll} className="flex items-center gap-2 whitespace-nowrap bg-primary text-on-primary px-5 py-2.5 rounded-full font-bold text-sm shadow-md active:scale-95 transition-all">
          <span className="material-symbols-outlined text-lg">rule</span>
          <span>تحضير الكل</span>
        </button>
        <button onClick={() => router.push(`/homework/new?sessionId=${sessionId}`)} className="flex items-center gap-2 whitespace-nowrap bg-surface-container-highest text-on-surface px-5 py-2.5 rounded-full font-bold text-sm hover:bg-primary-fixed transition-all">
          <span className="material-symbols-outlined text-lg">post_add</span>
          <span>إضافة واجب</span>
        </button>
        <button className="flex items-center gap-2 whitespace-nowrap bg-surface-container-highest text-on-surface px-5 py-2.5 rounded-full font-bold text-sm hover:bg-primary-fixed transition-all">
          <span className="material-symbols-outlined text-lg">payments</span>
          <span>تحصيل الكل</span>
        </button>
        <button className="flex items-center gap-2 whitespace-nowrap bg-surface-container-highest text-on-surface px-5 py-2.5 rounded-full font-bold text-sm hover:bg-primary-fixed transition-all">
          <span className="material-symbols-outlined text-lg">file_download</span>
          <span>تصدير كشف</span>
        </button>
      </div>

      {/* Student List Area */}
      <section className="px-6 mt-2 space-y-3 pb-32">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-outline">قائمة الطلاب</h3>
          <span className="text-xs font-medium text-primary">تم الفرز حسب: الاسم</span>
        </div>

        {mockStudents.map((student) => (
          <div key={student.id} className="bg-surface-container-lowest p-4 rounded-xl flex justify-between items-center shadow-sm border border-outline-variant/10 flex-wrap gap-y-3">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {student.avatar ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-12 h-12 rounded-full object-cover shadow-inner"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary-fixed/50 flex items-center justify-center font-bold text-primary-container text-lg shadow-inner">
                  {student.initials || student.name.substring(0, 1)}
                </div>
              )}
              
              <div className="flex flex-col">
                <span className="font-bold text-on-surface">{student.name}</span>
                {student.subscriptionStatus === "expired" ? (
                  <span className="text-[10px] text-tertiary font-bold">اشتراك منتهي</span>
                ) : student.isNew ? (
                  <span className="text-[10px] text-outline font-bold">طالب جديد</span>
                ) : payments[student.id] === "paid" ? (
                  <span className="text-[10px] text-outline">تم الدفع مسبقاً (اشتراك)</span>
                ) : (
                  <span className="text-[10px] text-tertiary font-bold">مديونية: {formatCurrency(50)}</span>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              {attendance[student.id] === "present" ? (
                <button onClick={() => handleAttendance(student.id, "present")} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container font-bold text-xs ring-1 ring-secondary/20 hover:bg-secondary-container/80 transition-all">
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span>حاضر</span>
                </button>
              ) : attendance[student.id] === "absent" ? (
                <button onClick={() => handleAttendance(student.id, "absent")} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-tertiary-container text-on-tertiary-container font-bold text-xs hover:bg-tertiary-container/80 transition-all">
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
                  <span>غايب</span>
                </button>
              ) : (
                <button onClick={() => handleAttendance(student.id, "present")} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant font-bold text-xs border border-outline-variant/20 hover:bg-surface-variant transition-all">
                  <span className="material-symbols-outlined text-base">circle</span>
                  <span>تحضير</span>
                </button>
              )}
              
              <button 
                onClick={() => handlePayment(student.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs transition-all ${
                  payments[student.id] === "paid" 
                    ? "bg-primary-fixed text-primary ring-1 ring-primary/20 hover:bg-primary-fixed/80" 
                    : "bg-surface-container-high text-on-surface-variant border border-outline-variant/20 hover:bg-surface-variant"
                }`}
              >
                {payments[student.id] === "paid" ? (
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

      {/* Floating Action Button */}
      <button className="fixed bottom-28 left-6 w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40">
        <span className="material-symbols-outlined text-2xl">person_add</span>
        <span className="sr-only">إضافة طالب للحصة</span>
      </button>
    </>
  );
}
