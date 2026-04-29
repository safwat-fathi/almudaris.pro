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
      {pending ? "جاري الإضافة..." : "حفظ بيانات الطالب"}
    </button>
  );
}

interface Teacher {
  id: number;
  name: string;
}

interface ChildFormProps {
  linkedTeachers: Teacher[];
  action: (
    prevState: { error: string | null },
    formData: FormData
  ) => Promise<{ error: string | null }>;
}

const initialState = {
  error: null,
};

const STAGE_LABELS: Record<string, string> = {
  PRIMARY: "الابتدائي",
  PREPARATORY: "الإعدادي",
  SECONDARY: "الثانوي",
};

const YEAR_LABELS: Record<number, string> = {
  1: "الأول",
  2: "الثاني",
  3: "الثالث",
  4: "الرابع",
  5: "الخامس",
  6: "السادس",
};

const STAGE_MAX_YEARS: Record<string, number> = {
  PRIMARY: 6,
  PREPARATORY: 3,
  SECONDARY: 3,
};

export function ChildForm({ linkedTeachers, action }: ChildFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const [stage, setStage] = useState<string>("PRIMARY");
  const [year, setYear] = useState<number>(1);

  const maxYear = STAGE_MAX_YEARS[stage] || 6;
  const availableYears = Array.from({ length: maxYear }, (_, i) => i + 1);

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
      {state?.error && (
        <div className="bg-error/10 text-error p-4 rounded-xl text-sm font-bold">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label
          htmlFor="name"
          className="font-body text-sm font-semibold text-on-surface-variant px-1"
        >
          اسم الطالب <span className="text-error">*</span>
        </label>
        <div className="relative">
          <input
            id="name"
            name="name"
            required
            className="w-full h-14 px-5 pr-12 bg-surface-container-lowest border-2 border-outline-variant/30 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-body text-on-surface"
            placeholder="مثال: عمر أحمد"
            type="text"
          />
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary/60">
            person
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="font-body text-sm font-semibold text-on-surface-variant px-1"
        >
          البريد الإلكتروني (اختياري)
        </label>
        <div className="relative">
          <input
            id="email"
            name="email"
            className="w-full h-14 px-5 pr-12 bg-surface-container-lowest border-2 border-outline-variant/30 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-body text-on-surface text-left"
            dir="ltr"
            placeholder="student@example.com"
            type="email"
          />
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary/60">
            mail
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <label
            htmlFor="education_stage"
            className="font-body text-sm font-semibold text-on-surface-variant px-1"
          >
            المرحلة الدراسية <span className="text-error">*</span>
          </label>
          <div className="relative">
            <select
              id="education_stage"
              name="education_stage"
              required
              value={stage}
              onChange={handleStageChange}
              className="w-full h-14 px-5 pr-5 appearance-none bg-surface-container-lowest border-2 border-outline-variant/30 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-body text-on-surface cursor-pointer"
            >
              {Object.entries(STAGE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  المرحلة {label}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <label
            htmlFor="education_year"
            className="font-body text-sm font-semibold text-on-surface-variant px-1"
          >
            الصف الدراسي <span className="text-error">*</span>
          </label>
          <div className="relative">
            <select
              id="education_year"
              name="education_year"
              required
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full h-14 px-5 pr-5 appearance-none bg-surface-container-lowest border-2 border-outline-variant/30 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-body text-on-surface cursor-pointer"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  الصف {YEAR_LABELS[y]}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>
      
      {/* Preview block */}
      <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 text-center font-bold text-primary">
        الصف {YEAR_LABELS[year]} {STAGE_LABELS[stage]}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="teacherId"
          className="font-body text-sm font-semibold text-on-surface-variant px-1"
        >
          تعيين إلى المعلم
        </label>
        <div className="relative">
          <select
            id="teacherId"
            name="teacherId"
            className="w-full h-14 px-5 pr-5 appearance-none bg-surface-container-lowest border-2 border-outline-variant/30 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-body text-on-surface cursor-pointer"
            defaultValue=""
          >
            <option value="">لا تعين لأي معلم الآن</option>
            {linkedTeachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
            expand_more
          </span>
        </div>
      </div>

      <div className="mt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
