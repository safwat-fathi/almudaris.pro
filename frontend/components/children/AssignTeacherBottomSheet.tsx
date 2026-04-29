"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";

export interface Teacher {
  id: number;
  name: string;
  subject?: string;
  image?: string;
  isLinked?: boolean; // If already linked to the parent but not necessarily to the child. Let's assume all passed teachers are linked to the parent.
}

export interface Child {
  id: number;
  name: string;
  email?: string;
  education_stage?: string;
  education_year?: number;
  grade_label?: string;
  image?: string;
}

interface AssignTeacherBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  child: Child | null;
  teachers: Teacher[];
  onAssign: (childId: number, teacherId: number) => Promise<void>;
}

export function AssignTeacherBottomSheet({
  isOpen,
  onClose,
  child,
  teachers,
  onAssign
}: AssignTeacherBottomSheetProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!child) return null;

  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = async () => {
    if (!selectedTeacherId) return;
    setIsSubmitting(true);
    try {
      await onAssign(child.id, selectedTeacherId);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      {/* TopAppBar */}
      <header className="bg-surface/85 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8 py-4 border-b border-surface-container-highest">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="material-symbols-outlined text-on-surface p-2 rounded-full hover:bg-slate-200/50 transition-colors active:scale-95 duration-200"
          >
            arrow_forward
          </button>
          <div className="flex flex-col">
            <h1 className="font-headline font-extrabold text-lg text-on-surface">تعيين معلم</h1>
            <span className="font-body text-xs text-on-surface-variant">الملف الشخصي: {child.name}</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg ring-2 ring-primary/20">
          {child.name.charAt(0)}
        </div>
      </header>

      {/* Search & Editorial Header */}
      <div className="px-8 pt-6 pb-4 bg-surface shrink-0">
        <div className="mb-6">
          <h2 className="font-headline font-extrabold text-2xl text-on-surface mb-1">اختيار معلم</h2>
          <p className="font-body text-base text-on-surface-variant">اختر معلماً لإضافته إلى {child.name}</p>
        </div>

        {/* Search Field */}
        <div className="relative group">
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
            search
          </span>
          <input 
            className="w-full h-14 pr-12 pl-4 bg-surface-container-lowest rounded-md border-none ring-1 ring-outline/20 focus:ring-2 focus:ring-primary transition-all font-body text-base placeholder:text-outline"
            placeholder="ابحث عن معلم" 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable Teacher List */}
      <div className="flex-1 overflow-y-auto px-8 space-y-4 pb-32 pt-2">
        {filteredTeachers.map((teacher) => {
          const isSelected = selectedTeacherId === teacher.id;
          const isDisabled = teacher.isLinked; // For example, already teaching this child

          return (
            <div 
              key={teacher.id}
              onClick={() => !isDisabled && setSelectedTeacherId(teacher.id)}
              className={`relative p-4 sm:p-5 rounded-lg transition-all active:scale-[0.98] cursor-pointer flex items-center gap-4
                ${isDisabled ? "bg-surface-container-low opacity-50 cursor-not-allowed" : 
                  isSelected ? "bg-surface-container-lowest ring-2 ring-primary shadow-sm" : 
                  "bg-surface-container-low hover:bg-surface-container-high"}
              `}
            >
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-secondary-container text-secondary flex items-center justify-center text-xl font-bold">
                {teacher.name.charAt(0)}
                {isSelected && (
                  <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary rounded-full p-0.5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-hidden">
                <h3 className="font-headline font-bold text-base text-on-surface truncate">{teacher.name}</h3>
                <p className={`font-body text-sm ${isSelected ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                  {teacher.subject || "مواد عامة"}
                </p>
              </div>

              <div className="shrink-0 flex items-center justify-center">
                {isDisabled ? (
                  <span className="bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded-full text-[10px] font-bold">
                    مرتبط بالفعل
                  </span>
                ) : (
                  <span className={`material-symbols-outlined ${isSelected ? 'text-primary' : 'text-outline-variant'}`}>
                    {isSelected ? "radio_button_checked" : "radio_button_unchecked"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {filteredTeachers.length === 0 && (
          <div className="text-center text-on-surface-variant py-8 font-body">
            لم يتم العثور على معلمين.
          </div>
        )}
      </div>

      {/* Sticky Action Button */}
      <div className="absolute bottom-0 w-full p-6 sm:p-8 bg-surface/90 backdrop-blur-md border-t border-surface-container-highest">
        <button 
          disabled={!selectedTeacherId || isSubmitting}
          onClick={handleConfirm}
          className="w-full h-14 bg-primary text-on-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-md font-headline font-bold text-lg flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
        >
          <span>{isSubmitting ? "جاري التعيين..." : "تأكيد الاختيار"}</span>
          <span className="material-symbols-outlined shrink-0" style={{ transform: 'rotate(180deg)' }}>arrow_back</span>
        </button>
      </div>
    </BottomSheet>
  );
}
