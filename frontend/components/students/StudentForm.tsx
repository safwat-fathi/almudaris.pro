"use client";

import React from "react";
import { useFormState, useFormStatus } from "react-dom";

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

interface StudentFormProps {
  linkedTeachers: Teacher[];
  action: (
    prevState: { error: string | null },
    formData: FormData
  ) => Promise<{ error: string | null }>;
}

const initialState = {
  error: null,
};

export function StudentForm({ linkedTeachers, action }: StudentFormProps) {
  const [state, formAction] = useFormState(action, initialState);

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
