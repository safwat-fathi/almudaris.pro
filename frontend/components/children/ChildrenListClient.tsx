"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AssignTeacherBottomSheet } from "./AssignTeacherBottomSheet";
import { Child, Teacher } from "./AssignTeacherBottomSheet";
import { enrollChildAction } from "@/app/(student)/dashboard/children/actions";

// ── Toast component ────────────────────────────────────────────────────────────
function Toast({
  message,
  type,
  onDismiss,
}: {
  message: string;
  type: "success" | "error";
  onDismiss: () => void;
}) {
  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-body font-medium max-w-[90vw] transition-all
        ${type === "success"
          ? "bg-secondary text-on-secondary"
          : "bg-error text-on-error"
        }`}
    >
      <span className="material-symbols-outlined text-[18px] shrink-0">
        {type === "success" ? "check_circle" : "error"}
      </span>
      <span>{message}</span>
      <button
        onClick={onDismiss}
        className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="إغلاق"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function ChildrenListClient({
  initialChildren,
  teachers,
}: {
  initialChildren: Child[];
  teachers: Teacher[];
}) {
  const router = useRouter();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 4000);
    },
    []
  );

  const handleOpenAssignTeacher = useCallback((child: Child) => {
    setSelectedChild(child);
    setIsBottomSheetOpen(true);
  }, []);

  const handleAssignTeacher = useCallback(
    async (childId: number, teacherId: number) => {
      const result = await enrollChildAction(childId, teacherId);
      if (result.success) {
        showToast(result.message, "success");
        router.refresh(); // re-fetch server data without full reload
      } else {
        showToast(result.message, "error");
        // Re-throw so the bottom sheet can stay open on error
        throw new Error(result.message);
      }
    },
    [showToast, router]
  );

  return (
    <>
      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}

      <div className="flex-1 overflow-y-auto px-6 md:px-12 space-y-4 pb-28 pt-2 relative z-10 w-full max-w-2xl mx-auto">
        {initialChildren.map((child: Child) => (
          <div
            key={child.id}
            className="relative p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 shadow-[0_8px_24px_rgba(0,0,0,0.04)] pb-8 mb-4"
          >
            {/* Header info */}
            <div className="flex items-center gap-4 mb-6">
              {child.image ? (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-sm">
                  <Image
                    src={child.image}
                    alt={child.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-headline font-bold text-2xl shadow-sm">
                  {child.name.charAt(0)}
                </div>
              )}

              <div className="flex-1">
                <h2 className="font-headline font-extrabold text-xl text-on-surface">
                  {child.name}
                </h2>
                {child.email && (
                  <p className="font-body text-outline font-medium text-sm mt-1">
                    {child.email}
                  </p>
                )}
                {child.grade_level && (
                  <p className="font-body text-primary font-semibold text-sm mt-0.5">
                    {child.grade_level}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-surface-container-low p-2 rounded-xl">
              <button className="flex flex-col items-center justify-center py-4 px-2 rounded-lg bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow group active:scale-95">
                <div className="w-10 h-10 rounded-full bg-secondary-container/50 text-secondary flex items-center justify-center mb-2 group-hover:bg-secondary-container transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    calendar_month
                  </span>
                </div>
                <span className="font-headline font-bold text-xs text-on-surface">
                  الجدول
                </span>
              </button>

              <button
                onClick={() => handleOpenAssignTeacher(child)}
                className="flex flex-col items-center justify-center py-4 px-2 rounded-lg bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow group active:scale-95"
              >
                <div className="w-10 h-10 rounded-full bg-primary-container/50 text-primary flex items-center justify-center mb-2 group-hover:bg-primary-container transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    groups
                  </span>
                </div>
                <span className="font-headline font-bold text-xs text-on-surface">
                  المعلمون
                </span>
              </button>

              <button className="flex flex-col items-center justify-center py-4 px-2 rounded-lg bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow group active:scale-95">
                <div className="w-10 h-10 rounded-full bg-tertiary-container/50 text-tertiary flex items-center justify-center mb-2 group-hover:bg-tertiary-container transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    menu_book
                  </span>
                </div>
                <span className="font-headline font-bold text-xs text-on-surface">
                  الواجبات
                </span>
              </button>

              <button className="flex flex-col items-center justify-center py-4 px-2 rounded-lg bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow group active:scale-95">
                <div className="w-10 h-10 rounded-full bg-error-container/50 text-error flex items-center justify-center mb-2 group-hover:bg-error-container transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    analytics
                  </span>
                </div>
                <span className="font-headline font-bold text-xs text-on-surface">
                  التقارير
                </span>
              </button>
            </div>
          </div>
        ))}

        {initialChildren.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm">
            <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center text-outline-variant mb-6">
              <span className="material-symbols-outlined text-4xl">face</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-2">
              لا يوجد أبناء مضافين
            </h3>
            <p className="font-body text-on-surface-variant max-w-sm mb-8 text-sm leading-relaxed">
              قم بإضافة أبنائك لمتابعة دراستهم وربطهم بالمعلمين بكل سهولة.
            </p>
            <Link
              href="/dashboard/new-child"
              className="h-12 px-8 bg-primary hover:bg-primary/90 text-on-primary rounded-full font-headline font-bold flex items-center gap-2 transition-transform active:scale-95"
            >
              <span className="material-symbols-outlined">add</span>
              <span>إضافة طالب</span>
            </Link>
          </div>
        )}
      </div>

      <AssignTeacherBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        child={selectedChild}
        teachers={teachers}
        onAssign={handleAssignTeacher}
      />
    </>
  );
}
