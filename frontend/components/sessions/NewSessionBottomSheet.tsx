"use client";

import { BottomSheet } from "@/components/ui/BottomSheet";
import SessionForm from "./SessionForm";
import { Student } from "@/services/api/teachers";

interface NewSessionBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
}

export function NewSessionBottomSheet({
  isOpen,
  onClose,
  students,
}: NewSessionBottomSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <header className="bg-surface/85 backdrop-blur-md sticky top-0 z-10 flex items-center justify-center px-6 py-4 border-b border-outline-variant/10 relative">
        <h1 className="font-headline font-extrabold text-lg text-primary text-center">
          إضافة حصة جديدة
        </h1>
        <button
          onClick={onClose}
          className="absolute left-6 w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-highest hover:text-primary transition-colors active:scale-95 duration-150"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
        <SessionForm
          key={isOpen ? "new-session-open" : "new-session-closed"}
          students={students}
          isBottomSheet={true}
          onSuccess={onClose}
        />
      </div>
    </BottomSheet>
  );
}
