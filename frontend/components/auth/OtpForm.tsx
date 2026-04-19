"use client";

import { useActionState, useEffect, useRef, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtpAction, requestOtpAction } from "@/app/actions/auth.actions";
import { formatNumber } from "@/lib/format";

export default function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = useMemo(() => searchParams.get("phone") || "", [searchParams]);
  const inviteCode = searchParams.get("inviteCode");
  
  const [state, formAction, isPending] = useActionState(verifyOtpAction, null);
  const [resendState, resendAction, isResendPending] = useActionState(requestOtpAction, null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [otpValue, setOtpValue] = useState("");
  
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    if (!phone) {
      router.push("/register");
    }
  }, [phone, router]);

  useEffect(() => {
		if (state?.success) {
			if (inviteCode) {
				// Auto accept the invitation then redirect to dashboard
				import("@/app/(auth)/invite/[code]/actions").then(({ acceptInvitation }) => {
					acceptInvitation(inviteCode).finally(() => {
						router.push("/dashboard?inviteAccepted=true");
					});
				});
			} else if (state.role === "teacher") {
				router.push("/");
			} else {
				router.push("/dashboard");
			}
		}
	}, [state, router, inviteCode]);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleInput = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 1);
    e.target.value = value;
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
    
    // Update state
    const currentOtp = inputsRef.current.map((input) => input?.value || "").join("");
    setOtpValue(currentOtp);
    
    // Auto submit if all filled
    if (currentOtp.length === 6 && formRef.current) {
      // The form will be submitted using the button but we could optionally submit here
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // 6 digits OTP grid
  const DIGITS = 6;
  const otpArray = Array.from({ length: DIGITS }, (_, i) => i);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${formatNumber(m)}:${formatNumber(s, { minimumIntegerDigits: 2 })}`;
  };

  return (
		<div className="w-full flex flex-col items-center gap-6">
			{state?.error && (
				<div className="bg-error/10 text-error p-3 rounded-lg text-sm font-semibold w-full">
					{state.error}
				</div>
			)}
			{resendState?.error && (
				<div className="bg-error/10 text-error p-3 rounded-lg text-sm font-semibold w-full">
					{resendState.error}
				</div>
			)}
			{resendState?.success && (
				<div className="bg-primary/10 text-primary p-3 rounded-lg text-sm font-semibold w-full">
					تم إعادة إرسال الرمز بنجاح
				</div>
			)}

			{/* OTP Input Form */}
			<form ref={formRef} action={formAction} className="w-full space-y-6">
				<input type="hidden" name="phone" value={phone} />

				{/* Hidden combined OTP field */}
				<input type="hidden" name="otp" value={otpValue} />

				<div className="grid grid-cols-6 gap-2 w-full" dir="ltr">
					{otpArray.map(i => (
						<input
							key={i}
							ref={el => {
								inputsRef.current[i] = el;
							}}
							className="w-12 h-14 text-center text-2xl font-bold bg-surface-container-lowest border-2 border-transparent rounded-lg shadow-sm focus:border-primary focus:ring-0 focus:outline-none transition-all duration-200 disabled:opacity-50"
							maxLength={1}
							placeholder="·"
							type="text"
							inputMode="numeric"
							disabled={isPending || timeLeft <= 0}
							onChange={e => handleInput(i, e)}
							onKeyDown={e => handleKeyDown(i, e)}
						/>
					))}
				</div>

				{/* Primary Action */}
				<button
					type="submit"
					disabled={isPending || timeLeft <= 0}
					className="w-full h-16 bg-primary text-on-primary font-manrope font-bold text-xl rounded-lg hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] transition-all duration-150 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isPending ? "جاري التأكيد..." : "تأكيد"}
				</button>
			</form>

			{/* Resend Action Form */}
			<form action={resendAction} className="w-full">
				<input type="hidden" name="phone" value={phone} />
				<button
					type="submit"
					disabled={timeLeft > 0 || isResendPending}
					onClick={() => {
						if (timeLeft <= 0 && !isResendPending) {
							setTimeLeft(300);
						}
					}}
					className="w-full flex items-center justify-center gap-2 text-primary font-semibold text-base hover:bg-surface-container-high px-6 py-3 rounded-full transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-transparent"
				>
					<span className="material-symbols-outlined text-xl">refresh</span>
					{timeLeft > 0
						? `إعادة إرسال الكود (${formatTime(timeLeft)})`
						: "إعادة إرسال الكود"}
				</button>
			</form>
		</div>
	);
}
