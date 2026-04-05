import type { Metadata } from "next";
import OtpForm from "@/components/auth/OtpForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "التحقق من الرمز – Al-Mudaris Pro",
  description: "أدخل الرمز المرسل إلى رقم هاتفك لتأكيد حسابك",
};

export default function VerifyOtpPage() {
  return (
		<div className="flex flex-col items-center w-full min-h-screen bg-surface">
			{/* Ambient decorative glow */}
			<div className="fixed -bottom-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
			<div className="fixed -top-24 -left-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

			{/* Top App Bar */}
			<header className="w-full top-0 sticky z-50 bg-surface-container-lowest/85 backdrop-blur-md border-b border-outline-variant/10">
				<div className="relative flex items-center px-6 md:px-12 py-4 w-full max-w-7xl mx-auto min-h-[72px]">
					<Link
						href="/register"
						className="material-symbols-outlined text-slate-500 hover:bg-slate-200/50 transition-colors p-2 rounded-full active:scale-95 duration-150 ease-in-out absolute inset-s-6 md:inset-s-12 z-10"
					>
						arrow_back
					</Link>
					<div className="w-full flex justify-center pointer-events-none">
						<h1 className="font-headline text-xl font-extrabold text-primary tracking-tight">
							Al-Mudaris Pro
						</h1>
					</div>
				</div>
			</header>

			<main className="flex-1 w-full max-w-md px-8 pt-4 pb-4 flex flex-col items-center text-center">
				{/* Visual Anchor */}
				<div className="mb-10 relative">
					<div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl scale-150" />
					<div className="w-32 h-32 bg-surface-container-lowest rounded-xl flex items-center justify-center shadow-sm relative z-10">
						<span
							className="material-symbols-outlined text-primary text-6xl"
							style={{ fontSize: "3rem", fontVariationSettings: "'FILL' 1" }}
						>
							vibration
						</span>
					</div>
				</div>

				{/* Typography */}
				<h2 className="font-manrope font-bold text-3xl text-on-surface mb-4 tracking-tight leading-tight">
					التحقق من الرمز
				</h2>
				<p className="text-outline mb-10 text-lg">تم إرسال كود على رقمك</p>

				{/* OTP Form (interactive client component) */}
				<OtpForm />

				{/* Info tip */}
				<div className="mt-auto pt-12 w-full">
					<div className="bg-surface-container-low p-6 rounded-lg text-sm text-outline flex items-start gap-3 text-right">
						<span className="material-symbols-outlined text-primary mt-0.5">
							info
						</span>
						<p>
							إذا لم يصلك الرمز خلال دقيقة، يرجى التأكد من صحة رقم الهاتف أو
							المحاولة مرة أخرى لاحقاً.
						</p>
					</div>
				</div>
			</main>
		</div>
	);
}
