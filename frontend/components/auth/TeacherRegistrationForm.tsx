"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { requestOtpAction } from "@/app/actions/auth.actions";

export default function TeacherRegistrationForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(requestOtpAction, null);

  useEffect(() => {
    if (state?.success && state?.phone) {
      // Pass the phone number to the OTP verification page securely
      router.push(`/verify-otp?phone=${encodeURIComponent(state.phone)}`);
    }
  }, [state, router]);

  return (
    <form className="w-full space-y-6" action={formAction}>
      {state?.error && (
        <div className="bg-error/10 text-error p-3 rounded-lg text-sm font-semibold">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-on-surface-variant mr-1">الاسم الكامل</label>
        <Input
          name="name"
          placeholder="اسمك بالكامل"
          type="text"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-on-surface-variant mr-1">رقم الموبايل</label>
        <Input
          name="phone"
          inputMode="numeric"
          placeholder="01xxxxxxxxx"
          type="tel"
          dir="ltr"
          className="text-left"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-on-surface-variant mr-1">كلمة المرور</label>
        <Input
          name="password"
          placeholder="كلمة مرور سهلة ليك"
          type="password"
          required
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-16 bg-primary text-on-primary font-manrope font-bold text-xl rounded-lg shadow-lg shadow-primary/20 hover:bg-primary-container hover:text-on-primary-container disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {isPending ? "جاري الإرسال..." : "ابدأ الآن"}
        </button>
        <p className="text-center mt-4 text-secondary font-bold text-sm tracking-wide">
          مجاني بالكامل - بدون أي التزام
        </p>
      </div>
    </form>
  );
}
