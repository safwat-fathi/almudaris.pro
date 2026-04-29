"use client";

import React, { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full h-14 bg-primary text-on-primary rounded-xl font-extrabold shadow-sm hover:shadow-md transition-all text-center ${
        pending ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-0.5"
      }`}
    >
      {pending ? "جاري التحديث..." : "تحديث بيانات الطالب"}
    </button>
  );
}

interface Child {
  id: number;
  name: string;
  email?: string;
  education_stage: string;
  education_year: number;
}

interface EditChildFormProps {
  child: Child;
  action: (
    prevState: { error: string | null },
    formData: FormData
  ) => Promise<{ error: string | null }>;
}

const STAGE_LABELS: Record<string, string> = {
  PRIMARY: "الابتدائي",
  PREPARATORY: "الإعدادي",
  SECONDARY: "الثانوي",
  UNASSIGNED: "غير محدد",
};

const STAGE_MAX_YEARS: Record<string, number> = {
  PRIMARY: 6,
  PREPARATORY: 3,
  SECONDARY: 3,
  UNASSIGNED: 0,
};

const YEAR_LABELS: Record<number, string> = {
  1: "الأول",
  2: "الثاني",
  3: "الثالث",
  4: "الرابع",
  5: "الخامس",
  6: "السادس",
  0: "غير محدد",
};

const initialState = {
  error: null,
};

export function EditChildForm({ child, action }: EditChildFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const [stage, setStage] = useState<string>(child.education_stage || "PRIMARY");
  const [year, setYear] = useState<number>(child.education_year || 1);

  const maxYear = STAGE_MAX_YEARS[stage] || 6;

  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStage = e.target.value;
    setStage(newStage);
    const newMaxYear = STAGE_MAX_YEARS[newStage] || 6;
    if (year > newMaxYear) {
      setYear(1);
    }
  };

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.error && (
        <div className="bg-error/10 text-error px-4 py-3 rounded-lg text-sm flex items-center gap-2 border border-error/20">
          <span className="material-symbols-outlined text-base">error</span>
          {state.error}
        </div>
      )}

      <input type="hidden" name="id" value={child.id} />

      <div className="flex flex-col gap-2">
        <label
          htmlFor="name"
          className="text-sm font-bold text-on-surface-variant ml-1"
        >
          اسم الطالب
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={child.name}
          required
          className="w-full h-14 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 text-on-surface focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          placeholder="مثال: أحمد علي"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-sm font-bold text-on-surface-variant ml-1"
        >
          البريد الإلكتروني (اختياري)
        </label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue={child.email || ""}
          className="w-full h-14 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 text-on-surface focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          placeholder="ahmed@example.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="education_stage"
          className="text-sm font-bold text-on-surface-variant ml-1"
        >
          المرحلة الدراسية
        </label>
        <select
          id="education_stage"
          name="education_stage"
          value={stage}
          onChange={handleStageChange}
          className="w-full h-14 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 text-on-surface focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none"
        >
          {Object.entries(STAGE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="education_year"
          className="text-sm font-bold text-on-surface-variant ml-1"
        >
          الصف الدراسي
        </label>
        <select
          id="education_year"
          name="education_year"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-full h-14 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 text-on-surface focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none"
        >
          {Array.from({ length: maxYear }, (_, i) => i + 1).map((y) => (
            <option key={y} value={y}>
              الصف {YEAR_LABELS[y]}
            </option>
          ))}
          {stage === "UNASSIGNED" && (
            <option value={0}>غير محدد</option>
          )}
        </select>
        {stage !== "UNASSIGNED" && (
          <p className="text-sm text-primary font-medium mt-1">
            العرض النهائي: الصف {YEAR_LABELS[year]} {STAGE_LABELS[stage]}
          </p>
        )}
      </div>

      <div className="pt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
