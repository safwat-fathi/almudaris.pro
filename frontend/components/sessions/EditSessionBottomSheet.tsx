"use client";

import { useRef } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import SessionForm from "./SessionForm";
import { Group } from "@/services/api/groups";
import { Student } from "@/services/api/teachers";

interface EditSessionBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group | null;
  students: Student[];
}

export function EditSessionBottomSheet({
  isOpen,
  onClose,
  group,
  students,
}: EditSessionBottomSheetProps) {
  const lastGroupRef = useRef<Group | null>(null);
  const formKeyRef = useRef(0);
  const prevIsOpen = useRef(isOpen);

  if (isOpen && !prevIsOpen.current) {
    formKeyRef.current += 1;
  }
  prevIsOpen.current = isOpen;

  if (group) {
    lastGroupRef.current = group;
  }

  const displayGroup = group || lastGroupRef.current;

  if (!displayGroup) return null;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      {/* TopAppBar */}
      <header className="bg-surface/85 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
        <div className="w-20"></div> {/* Spacer for symmetry */}
				<div className="flex items-center gap-4">

        <button 
          onClick={onClose}
          className="flex items-center justify-end gap-1 text-primary font-bold active:scale-95 duration-150 group w-20"
        >
          <span className="font-manrope text-lg">رجوع</span>
          <span className="material-symbols-outlined p-1 rounded-full group-hover:bg-primary/10 transition-colors" style={{ direction: 'ltr' }}>
            arrow_forward
          </span>
        </button>
        <h1 className="font-headline font-extrabold text-lg text-primary text-center">تعديل الحصة</h1>
				</div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
        <SessionForm 
          key={`${displayGroup.id}-${formKeyRef.current}`}
          isEdit={true} 
          group={displayGroup} 
          students={students} 
          isBottomSheet={true}
          onSuccess={onClose}
        />
      </div>
    </BottomSheet>
  );
}
