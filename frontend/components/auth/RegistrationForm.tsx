"use client";

import { useActionState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { signupAction } from "@/app/actions/auth.actions";

export default function RegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "teacher";
  const inviteCode = searchParams.get("inviteCode");

  const [state, formAction, isPending] = useActionState(signupAction, null);

  useEffect(() => {
    if (state?.success) {
      if (inviteCode) {
        // Auto accept the invitation then redirect to dashboard
        import("@/app/(auth)/invite/[code]/actions").then(({ acceptInvitation }) => {
          acceptInvitation(inviteCode).finally(() => {
            router.push("/dashboard?inviteAccepted=true");
          });
        });
      } else {
        router.push("/");
      }
    } else if (state?.requiresOtp && state?.phone) {
      // Pass inviteCode along to verify-otp if present so we can redirect back later
      const redirectParams = new URLSearchParams({ phone: state.phone });
      if (inviteCode) redirectParams.append("inviteCode", inviteCode);
      
      router.push(`/verify-otp?${redirectParams.toString()}`);
    }
  }, [state, router, inviteCode]);

  return (
    <form className="w-full space-y-6" action={formAction}>
      {/* Hidden inputs to pass params to action */}
      <input type="hidden" name="role" value={role} />

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
        <label className="block text-sm font-semibold text-on-surface-variant mr-1">البريد الإلكتروني (اختياري)</label>
        <Input
          name="email"
          placeholder="email@example.com"
          type="email"
          dir="ltr"
          className="text-left"
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

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-on-surface-variant mr-1">تأكيد كلمة المرور</label>
        <Input
          name="confirmPassword"
          placeholder="أعد إدخال كلمة المرور"
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
          {isPending ? "جاري التسجيل..." : "ابدأ الآن"}
        </button>
        <p className="text-center mt-4 text-secondary font-bold text-sm tracking-wide">
          مجاني بالكامل - بدون أي التزام
        </p>
      </div>
    </form>
  );
}
