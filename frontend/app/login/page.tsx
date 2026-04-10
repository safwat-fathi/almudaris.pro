"use client";

import Link from "next/link";
import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { UserRole } from "@/types/user";
import { loginAction } from "@/app/actions/auth.actions";

export default function LoginSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("teacher");
  const router = useRouter();
  
  const [state, formAction, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.success) {
      if (state.role === "teacher") {
        router.push("/");
      } else {
        router.push("/student-dashboard");
      }
    } else if (state?.requiresOtp && state?.phone) {
      router.push(`/verify-otp?phone=${encodeURIComponent(state.phone)}`);
    }
  }, [state, router]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen pt-4">
      {/* Brand Header Section */}
      <header className="w-full max-w-md px-8 pt-12 pb-8 flex flex-col items-center text-center">
        <div className="mb-6 w-20 h-20 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <span
            className="material-symbols-outlined text-on-primary text-4xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            school
          </span>
        </div>
        <h1 className="font-manrope text-3xl font-extrabold tracking-tight text-primary mb-2">
          Al-Mudaris Pro
        </h1>
        <p className="text-on-surface-variant font-medium text-lg leading-relaxed">
          أهلاً بك في منصة التعليم الذكي
        </p>
      </header>

      <main className="w-full max-w-md px-6 flex flex-col gap-10 pb-20 z-10">
        {/* Role Selection Strategy: Intentional Asymmetry */}
        <section aria-label="Role Selection">
          <h2 className="font-manrope text-sm font-bold text-outline mb-4 px-2 uppercase tracking-widest">
            اختر هويتك
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {/* Teacher Card */}
            <button
              type="button"
              onClick={() => setSelectedRole("teacher")}
              className={`group relative flex items-center p-5 rounded-lg border-2 transition-all duration-300 text-right overflow-hidden shadow-sm ${
                selectedRole === "teacher"
                  ? "border-primary bg-primary/5"
                  : "border-transparent bg-surface-container-lowest hover:border-primary/50"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  selectedRole === "teacher"
                    ? "bg-primary text-on-primary"
                    : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-on-primary"
                }`}
              >
                <span className="material-symbols-outlined text-3xl">
                  cast_for_education
                </span>
              </div>
              <div className="mr-4 z-10">
                <span className="block font-manrope text-xl font-bold text-on-surface">
                  المعلم
                </span>
                <span className="block text-sm text-on-surface-variant">
                  إدارة الفصول والدروس
                </span>
              </div>
              <span
                className={`material-symbols-outlined absolute left-6 transition-opacity text-primary  ${
                  selectedRole === "teacher" ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                chevron_left
              </span>
              {selectedRole === "teacher" && (
                <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
              )}
            </button>

            {/* Student/Parent Card */}
            <button
              type="button"
              onClick={() => setSelectedRole("parent")}
              className={`group relative flex items-center p-5 rounded-lg border-2 transition-all duration-300 text-right overflow-hidden shadow-sm ${
                selectedRole === "parent"
                  ? "border-secondary bg-secondary/5"
                  : "border-transparent bg-surface-container-lowest hover:border-secondary/50"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  selectedRole === "parent"
                    ? "bg-secondary text-on-secondary"
                    : "bg-secondary-container text-on-secondary-container group-hover:bg-secondary group-hover:text-on-secondary"
                }`}
              >
                <span className="material-symbols-outlined text-3xl">
                  family_restroom
                </span>
              </div>
              <div className="mr-4 z-10">
                <span className="block font-manrope text-xl font-bold text-on-surface">
                  الطالب / ولي الأمر
                </span>
                <span className="block text-sm text-on-surface-variant">
                  متابعة المستوى والمحتوى التعليمي
                </span>
              </div>
              <span
                className={`material-symbols-outlined absolute left-6 transition-opacity text-secondary  ${
                  selectedRole === "parent" ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                chevron_left
              </span>
              {selectedRole === "parent" && (
                <div className="absolute inset-0 bg-secondary/5 pointer-events-none" />
              )}
            </button>
          </div>
        </section>

        {/* Login Form Section */}
        <section className="bg-surface-container-low rounded-lg p-8 shadow-sm">
          <h2 className="font-manrope text-xl font-bold text-on-surface mb-6">
            تسجيل الدخول
          </h2>
          <form className="space-y-6" action={formAction}>
            {state?.error && (
              <div className="bg-error/10 text-error p-3 rounded-lg text-sm font-semibold">
                {state.error}
              </div>
            )}

            {/* Phone Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface-variant mr-1">
                رقم الهاتف
              </label>
              <Input
                name="phone"
                placeholder="01XXXXXXXXX"
                type="tel"
                dir="ltr"
                icon="smartphone"
                className="text-left font-medium"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-on-surface-variant">
                  كلمة المرور
                </label>
                <Link
                  href="#"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <Input
                name="password"
                placeholder="••••••••"
                type="password"
                dir="ltr"
                icon="lock"
                className="text-left font-medium"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              className="w-full h-16 bg-primary text-on-primary rounded-md font-manrope text-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] transition-all shadow-lg shadow-primary/20 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isPending}
            >
              <span>{isPending ? "جاري الدخول..." : "دخول"}</span>
              {!isPending && (
                <span className="material-symbols-outlined">
                  login
                </span>
              )}
            </button>
          </form>
        </section>

        {/* Footer / Onboarding Link */}
        <footer className="text-center mt-4">
          <p className="text-on-surface-variant font-medium">
            ليس لديك حساب؟{" "}
            <Link
              href="/register"
              className="text-primary font-bold hover:underline mr-1"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </footer>
      </main>

      {/* Decorative Element (The Silent Mentor aesthetic) */}
      <div className="fixed bottom-0 right-0 w-64 h-64 -mb-32 -mr-32 bg-primary/5 rounded-full blur-3xl -z-0 pointer-events-none"></div>
      <div className="fixed top-0 left-0 w-64 h-64 -mt-32 -ml-32 bg-secondary/5 rounded-full blur-3xl -z-0 pointer-events-none"></div>
    </div>
  );
}
