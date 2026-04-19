import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "مرحباً بك – Al-Mudaris Pro",
  description: "ابدأ رحلتك مع Al-Mudaris Pro وأضف أول دفعة أو حصة",
};

export default function WelcomePage() {
  return (
		<div className="flex flex-col w-full min-h-screen bg-surface text-on-surface">
			{/* Background decorations */}
			<div className="fixed top-0 right-0 -z-10 opacity-20 pointer-events-none">
				<div className="w-96 h-96 bg-primary rounded-full blur-[100px] -mr-48 -mt-48" />
			</div>
			<div className="fixed bottom-0 left-0 -z-10 opacity-10 pointer-events-none">
				<div className="w-64 h-64 bg-secondary rounded-full blur-[80px] -ml-32 -mb-32" />
			</div>

			{/* Top App Bar */}
			{/* <header className="w-full top-0 sticky bg-surface z-50 border-b border-outline-variant/10">
        <div className="flex items-center justify-between px-8 py-4 w-full max-w-2xl mx-auto">
          <a
            href="/verify-otp"
            className="text-primary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 p-2 rounded-full flex items-center justify-center"
          >
            <span className="material-symbols-outlined" style={{ direction: "ltr" }}>arrow_back</span>
          </a>
          <h1 className="font-manrope font-bold text-xl tracking-tight text-primary">Al-Mudaris Pro</h1>
          <div className="w-10" />
        </div>
      </header> */}
			<header className="w-full top-0 sticky z-50 bg-surface-container-lowest/85 backdrop-blur-md border-b border-outline-variant/10">
				<div className="relative flex items-center px-6 md:px-12 py-4 w-full max-w-7xl mx-auto min-h-[72px]">
					<Link
						href="/students"
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
			<main className="flex-grow flex flex-col px-8 py-10 max-w-2xl mx-auto w-full pb-4">
				{/* Welcome Section */}
				<section className="mb-10 text-center md:text-right">
					<h2 className="text-4xl font-extrabold text-on-surface mb-4 font-manrope leading-tight">
						أهلاً بيك 👋
					</h2>
					<p className="text-lg text-on-surface-variant">عايز تبدأ بإيه؟</p>
				</section>

				{/* Onboarding Progress */}
				<div className="mb-10 p-6 bg-primary/5 rounded-xl flex items-center gap-6">
					<div className="relative w-16 h-16 flex-shrink-0">
						<svg
							className="w-full h-full transform -rotate-90"
							viewBox="0 0 64 64"
						>
							<circle
								className="text-surface-container-high"
								cx="32"
								cy="32"
								fill="transparent"
								r="28"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<circle
								className="text-primary"
								cx="32"
								cy="32"
								fill="transparent"
								r="28"
								stroke="currentColor"
								strokeDasharray="175"
								strokeDashoffset="130"
								strokeWidth="4"
							/>
						</svg>
						<div className="absolute inset-0 flex items-center justify-center font-bold text-primary text-sm">
							25%
						</div>
					</div>
					<div>
						<h3 className="font-bold text-primary">خطوة واحدة متبقية!</h3>
						<p className="text-sm text-on-surface-variant">
							إضافة بياناتك بتساعدنا ننظم شغلك صح.
						</p>
					</div>
				</div>

				{/* Action Cards */}
				<div className="grid grid-cols-1 gap-6">
					{/* Add First Group */}
					<Link
						href="/students"
						className="group relative overflow-hidden bg-surface-container-lowest p-8 rounded-xl text-right flex flex-col gap-4 shadow-sm hover:shadow-lg transition-all active:scale-95 duration-150"
					>
						<div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
						<div className="w-14 h-14 bg-primary-container text-white rounded-full flex items-center justify-center mb-2">
							<span
								className="material-symbols-outlined text-3xl"
								style={{ fontVariationSettings: "'FILL' 1" }}
							>
								group_add
							</span>
						</div>
						<div>
							<h3 className="text-2xl font-bold text-on-surface mb-2">
								إضافة أول دفعة
							</h3>
							<p className="text-on-surface-variant leading-relaxed">
								نظم مجموعاتك الدراسية، المواعيد، وأسماء الطلاب في مكان واحد.
							</p>
						</div>
						<div className="mt-4 flex items-center text-primary font-bold gap-2">
							<span>يلا بينا</span>
							<span className="material-symbols-outlined">chevron_left</span>
						</div>
					</Link>

					{/* Add First Session */}
					<Link
						href="/sessions"
						className="group relative overflow-hidden bg-surface-container-lowest p-8 rounded-xl text-right flex flex-col gap-4 shadow-sm hover:shadow-lg transition-all active:scale-95 duration-150"
					>
						<div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
						<div className="w-14 h-14 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mb-2">
							<span
								className="material-symbols-outlined text-3xl"
								style={{ fontVariationSettings: "'FILL' 1" }}
							>
								menu_book
							</span>
						</div>
						<div>
							<h3 className="text-2xl font-bold text-on-surface mb-2">
								إضافة أول حصة
							</h3>
							<p className="text-on-surface-variant leading-relaxed">
								سجل تحضيرك، الواجبات، ومحتوى الحصة عشان تتابع مستواهم.
							</p>
						</div>
						<div className="mt-4 flex items-center text-secondary font-bold gap-2">
							<span>ابدأ الآن</span>
							<span className="material-symbols-outlined">chevron_left</span>
						</div>
					</Link>
				</div>

				{/* Tip */}
				<div className="mt-10 p-6 bg-surface-container-low rounded-lg flex items-start gap-4">
					<span className="material-symbols-outlined text-primary mt-1">
						lightbulb
					</span>
					<p className="text-sm text-on-surface-variant leading-relaxed">
						<strong>نصيحة:</strong> إضافة الطلاب أولاً بتسهل عليك متابعة الحضور
						والغياب في كل حصة بعد كدة.
					</p>
				</div>
			</main>
		</div>
	);
}
