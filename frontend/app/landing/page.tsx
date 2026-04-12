import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = {
	title: "Al-Mudaris Pro | المدرس برو - المنصة الذكية للمعلمين",
	description:
		"المساعد الذكي للمعلمين الخصوصيين. نظم مواعيدك، تابع غياب طلابك، وتحكم في حساباتك بضغطة واحدة.",
};

export default function LandingPage() {
	return (
		<div className="bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed w-full min-h-screen pb-0">
			{/* TopNavBar */}
			<nav className="sticky top-0 w-full z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shadow-sm dark:shadow-none transition-all duration-200">
				<div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto font-manrope text-sm font-medium tracking-tight">
					<div className="flex items-center gap-8">
						<span className="text-2xl font-bold tracking-tighter text-blue-700 dark:text-blue-400">
							المدرس برو
						</span>
						<div className="hidden md:flex items-center gap-6">
							<Link
								className="text-blue-700 dark:text-blue-400 font-bold border-b-2 border-blue-600 pb-1"
								href="#features"
							>
								المميزات
							</Link>
							<Link
								className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
								href="#pricing"
							>
								الباقات
							</Link>
							<Link
								className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
								href="#faq"
							>
								الأسئلة الشائعة
							</Link>
						</div>
					</div>
					<Link
						href="/welcome"
						className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold hover:scale-105 active:scale-95 transition-all"
					>
						إبدأ مجاناً
					</Link>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="relative pt-20 pb-32 overflow-hidden">
				<div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row items-center gap-16">
					<div className="flex-1 text-right w-full z-10">
						<h1 className="text-5xl lg:text-7xl font-headline font-extrabold text-on-surface leading-tight mb-6">
							خلّي إدارة دروسك أسهل… <br />{" "}
							<span className="text-primary">وركز على الشرح بس</span>
						</h1>
						<p className="text-xl text-on-surface-variant mb-10 max-w-xl mx-auto lg:mr-0 lg:ml-auto leading-relaxed">
							المساعد الذكي للمعلمين الخصوصيين. نظم مواعيدك، تابع غياب طلابك،
							وتحكم في حساباتك بضغطة واحدة.
						</p>
						<div className="flex flex-col sm:flex-row-reverse gap-4 justify-start">
							<Link
								href="/welcome"
								className="bg-primary text-on-primary px-10 py-4 text-center rounded-lg text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-95"
							>
								ابدأ مجانًا الآن
							</Link>
							<button className="bg-surface-container-high text-primary px-10 py-4 rounded-lg text-lg font-bold hover:bg-surface-variant transition-all">
								شاهد فيديو توضيحي
							</button>
						</div>
						{/* <div className="mt-12 flex items-center justify-end gap-4 text-on-surface-variant font-medium">
							<span>موثوق من +5000 معلم</span>
							<div className="flex -space-x-2 space-x-reverse">
								<div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative">
									<Image
										alt="professional male teacher smiling"
										src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_a1-849CVOX4dmUBeOhV0CuBMU4VFsmY9fM4ugRHxPg6KJ984wwkWzsOFaPnl-yQpZdbqeYo25s09NdYCZ44UN82b2NANqJW2rmwUXHoom1i52PTM9D60r-SQbfFFq9WPYCHQul-PtMJk-PdVcqpaV7zavT382kXgOdmGRQ7kkREQhd_K3p5WKDkzGywcTnrTWgAuHyAUrBglsIMwxwUQJdr3A1SUqrUzdzLqmvG_VN3JzlOAokPdqiaw_XT9DStXyqLeKXRdVQs"
										fill
										sizes="40px"
										className="object-cover"
									/>
								</div>
								<div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative">
									<Image
										alt="friendly female educator"
										src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwNhehkQdVVNuhQU4WhtiMqsXkOcAnQS-wZEYsGVr_AmIwWnWghhm4Q-gZZJYwjRRL5gWBifMcgZ-Cs69EP0Apav2GLlCH6KBUoRG_9MjdsD367YK2kwioW5-Kl1WaXLjAEh629n2Db6ccV7vJ3Lk6yfu_WKrNztIWVQDjTnodU8xz4s_NPZGHo3OMYQs3BfcA-fdCInmCYVfm2pVn6Ybm_zotGCl6VjCAn33xsGkvSXErvWvau85Tvur7Xy60z9kio19U1INxjcU"
										fill
										sizes="40px"
										className="object-cover"
									/>
								</div>
								<div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative">
									<Image
										alt="confident mature professor"
										src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgZYtorqzHEr82MSMyZgWPqsR_VilinCcNnAMT7xKHH1TG6xovGMml___zCimVC-W6R4v-OOVdrcSjqx6HLyBoQeRhpYdFeAs9plN5dtca-_-7n4hQY3nCY0J11VGMC0sTE2g73yaqP_86ZNa3WkqUO2r7jMv82PIOSStTbAVXKJk1ABJ7rAomRA8ek7NkUfAZcWvCUq2KpfbBL9NBLpOhTASHinIXwOMyjlJwq7pgetTB04jfAjiYh-E2QcKjGU1ujOLhC7HJ_xQ"
										fill
										sizes="40px"
										className="object-cover"
									/>
								</div>
							</div>
						</div> */}
					</div>
					<div className="flex-1 relative w-full max-w-lg lg:max-w-none">
						<div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full"></div>
						<div className="relative bg-surface-container-lowest p-4 rounded-[3rem] shadow-2xl border-4 border-white/50">
							<Image
								className="rounded-[2.5rem] w-full shadow-inner h-auto"
								alt="teacher dashboard interface"
								src="https://lh3.googleusercontent.com/aida-public/AB6AXuDI5kyXmf2LxZm9zJkrQKzJMyX-mPTMYl4JxjPlpT19cGcouZDR582x2Mnl6S5K--k0jJ3iKHW0f6UMtR-4YOiiBtLx9Yctw8mxkpY0TKN4cfd3kJSu7yTPHSpEL0ZW6ozSzJ2HHLlKi-sS8y6U0gu7EhIRGmsIlasOuaYmU-ukAU76XCWvxx-iWGJpGqYNP5W3vIQ7YFzfxkYEc7c00PqgTM412CqiBgaeGnDF43-kKzz9nq34jvX0hrMUuseIe9an7NpL0UdT1bs"
								width={1000}
								height={700}
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Problem Section */}
			<section className="bg-surface-container-low py-24">
				<div className="max-w-7xl mx-auto px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-headline font-bold text-on-surface mb-4">
							تعبت من اللخبطة في إدارة الدروس؟
						</h2>
						<p className="text-on-surface-variant">
							الورقة والقلم ما عادوا يكفون لطموحك التعليمي
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						<div className="bg-surface-container-lowest p-8 rounded-xl text-center hover:scale-105 transition-transform">
							<div className="w-16 h-16 bg-error-container text-on-error-container rounded-full flex items-center justify-center mx-auto mb-6">
								<span className="material-symbols-outlined text-3xl">
									event_busy
								</span>
							</div>
							<h3 className="text-xl font-bold mb-3">نسيان الحضور</h3>
							<p className="text-on-surface-variant leading-relaxed">
								تضيع وقتك في مراجعة كشوف الحضور اليدوية كل مرة.
							</p>
						</div>
						<div className="bg-surface-container-lowest p-8 rounded-xl text-center hover:scale-105 transition-transform">
							<div className="w-16 h-16 bg-error-container text-on-error-container rounded-full flex items-center justify-center mx-auto mb-6">
								<span className="material-symbols-outlined text-3xl">
									payments
								</span>
							</div>
							<h3 className="text-xl font-bold mb-3">صعوبة التحصيل</h3>
							<p className="text-on-surface-variant leading-relaxed">
								لخبطة في مين دفع ومين لسه، ومواعيد الاشتراكات الشهرية.
							</p>
						</div>
						<div className="bg-surface-container-lowest p-8 rounded-xl text-center hover:scale-105 transition-transform">
							<div className="w-16 h-16 bg-error-container text-on-error-container rounded-full flex items-center justify-center mx-auto mb-6">
								<span className="material-symbols-outlined text-3xl">quiz</span>
							</div>
							<h3 className="text-xl font-bold mb-3">أسئلة الطلبة</h3>
							<p className="text-on-surface-variant leading-relaxed">
								رسائل ما تنتهي على واتساب بخصوص الواجبات والمواعيد.
							</p>
						</div>
						<div className="bg-surface-container-lowest p-8 rounded-xl text-center hover:scale-105 transition-transform">
							<div className="w-16 h-16 bg-error-container text-on-error-container rounded-full flex items-center justify-center mx-auto mb-6">
								<span className="material-symbols-outlined text-3xl">
									record_voice_over
								</span>
							</div>
							<h3 className="text-xl font-bold mb-3">تواصل الأهالي</h3>
							<p className="text-on-surface-variant leading-relaxed">
								مكالمات مستمرة من أولياء الأمور لمتابعة مستوى أبنائهم.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Solution & Features (Bento Grid) */}
			<section className="py-24" id="features">
				<div className="max-w-7xl mx-auto px-8">
					<div className="mb-16">
						<span className="text-primary font-bold tracking-widest uppercase text-sm">
							الحل المتكامل
						</span>
						<h2 className="text-4xl font-headline font-bold text-on-surface mt-2">
							منصة واحدة لكل حاجة
						</h2>
					</div>
					<div className="grid grid-cols-12 gap-6">
						<div className="col-span-12 lg:col-span-8 bg-primary-container text-on-primary-container p-10 rounded-xl flex flex-col justify-between min-h-[400px]">
							<div>
								<span className="material-symbols-outlined text-5xl mb-6">
									calendar_month
								</span>
								<h3 className="text-3xl font-bold mb-4">
									إدارة الحصص والمجموعات
								</h3>
								<p className="text-lg opacity-90 max-w-md">
									نظم مجموعاتك، حدد مواعيدك، وسيصل تنبيه تلقائي لكل الطلاب قبل
									موعد الحصة.
								</p>
							</div>
							<div className="mt-8">
								<Image
									className="rounded-lg shadow-xl w-full h-auto"
									alt="weekly schedule"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8-d2v524P85DkTB_Y1G2Sg_az8mCP7zFDEUwKW0jc25h5UgP3B8g3HiGSjL9emEyF9xcKZCGgGL9vM14F_8dVorsUjVxslMFFGJhxPeqFaq4SLTJjdtspHs8h9zhSfcYS-kRSmLq2ZpvHLv79XdJwqilOA2srQK1QFLz7OTQHbbROkHy59ZnkweqStzDLnDbS014w_KaBoCuREKK5aYlD0Q7O8O_x64_GRkZBUIr3cgfuYLpfsA27U3-sFZXF-5Zvsr5pOFwr-AU"
									width={800}
									height={400}
								/>
							</div>
						</div>
						<div className="col-span-12 lg:col-span-4 bg-secondary-container text-on-secondary-container p-10 rounded-xl flex flex-col justify-between">
							<div>
								<span
									className="material-symbols-outlined text-5xl mb-6"
									style={{ fontVariationSettings: "'FILL' 1" }}
								>
									how_to_reg
								</span>
								<h3 className="text-2xl font-bold mb-4">الحضور والانصراف</h3>
								<p className="opacity-90">
									سجل حضور طلابك بلمسة واحدة، مع تقارير فورية لنسب الغياب لكل
									طالب.
								</p>
							</div>
							<div className="mt-8 flex justify-center">
								<span className="text-6xl font-bold">98%</span>
								<span className="text-sm self-end mb-2 mr-2">دقة تتبع</span>
							</div>
						</div>
						<div className="col-span-12 lg:col-span-4 bg-surface-container-high p-10 rounded-xl">
							<span className="material-symbols-outlined text-primary text-5xl mb-6">
								monitoring
							</span>
							<h3 className="text-2xl font-bold mb-4">تقارير ذكية</h3>
							<p className="text-on-surface-variant">
								احصل على تحليل كامل لمستوى طلابك المتقدم والمتعثر لتحسين أدائهم.
							</p>
						</div>
						<div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant/20 p-10 rounded-xl shadow-sm">
							<span className="material-symbols-outlined text-primary text-5xl mb-6">
								account_balance_wallet
							</span>
							<h3 className="text-2xl font-bold mb-4">إدارة الفلوس</h3>
							<p className="text-on-surface-variant">
								تتبع الإيرادات، المدفوعات، والمستحقات المتبقية على الطلاب بكل
								سهولة.
							</p>
						</div>
						<div className="col-span-12 lg:col-span-4 bg-surface-container-high p-10 rounded-xl">
							<span className="material-symbols-outlined text-primary text-5xl mb-6">
								forum
							</span>
							<h3 className="text-2xl font-bold mb-4">تواصل مع الطلبة</h3>
							<p className="text-on-surface-variant">
								نظام مراسلة داخلي لإرسال الواجبات والملاحظات دون الحاجة لرقم
								الهاتف.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* How It Works */}
			<section className="bg-surface py-24">
				<div className="max-w-7xl mx-auto px-8">
					<h2 className="text-4xl font-headline font-bold text-center mb-20">
						ابدأ في 3 خطوات بسيطة
					</h2>
					<div className="relative">
						<div className="hidden lg:block absolute top-[40px] left-0 w-full h-1 bg-primary-fixed -z-10"></div>
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
							<div className="bg-surface lg:bg-transparent p-6 text-center z-10">
								<div className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto text-3xl font-bold mb-8 shadow-xl shadow-primary/30 relative">
									1
									<div className="absolute -bottom-2 -right-2 bg-secondary text-[10px] px-2 py-1 rounded-full text-white">
										البداية
									</div>
								</div>
								<h3 className="text-2xl font-bold mb-4">أنشئ حسابك</h3>
								<p className="text-on-surface-variant">
									سجل بياناتك كمعلم في أقل من دقيقة مجانًا.
								</p>
							</div>
							<div className="bg-surface lg:bg-transparent p-6 text-center z-10">
								<div className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto text-3xl font-bold mb-8 shadow-xl shadow-primary/30">
									2
								</div>
								<h3 className="text-2xl font-bold mb-4">أضف حصصك وطلابك</h3>
								<p className="text-on-surface-variant">
									ادخل أسماء الطلاب ومواعيد المجموعات الخاصة بك.
								</p>
							</div>
							<div className="bg-surface lg:bg-transparent p-6 text-center z-10">
								<div className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto text-3xl font-bold mb-8 shadow-xl shadow-primary/30">
									3
								</div>
								<h3 className="text-2xl font-bold mb-4">ابدأ الإدارة</h3>
								<p className="text-on-surface-variant">
									استمتع بالتنظيم الكامل وركز فقط على التميز في شرحك.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Why This Works (Product Preview) */}
			<section className="py-24 bg-surface-container-low overflow-hidden">
				<div className="max-w-7xl mx-auto px-8">
					<div className="grid lg:grid-cols-2 gap-20 items-center">
						<div className="relative">
							<div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary-fixed rounded-full blur-[80px] opacity-40"></div>
							<div className="space-y-6 relative z-10">
								<div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-r-4 border-primary">
									<h4 className="font-bold text-lg mb-2">
										كل شيء في مكان واحد
									</h4>
									<p className="text-on-surface-variant text-sm">
										وداعاً لتشتت البيانات بين الأوراق وتطبيقات المحادثة.
									</p>
								</div>
								<div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-r-4 border-secondary">
									<h4 className="font-bold text-lg mb-2">
										لا غياب يفوتك بعد اليوم
									</h4>
									<p className="text-on-surface-variant text-sm">
										نظام حضور ذكي يرسل تقارير فورية لأولياء الأمور.
									</p>
								</div>
								<div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-r-4 border-primary">
									<h4 className="font-bold text-lg mb-2">متابعة مالية دقيقة</h4>
									<p className="text-on-surface-variant text-sm">
										لوحة تحكم توضح أرباحك ومدفوعات الطلاب الشهرية.
									</p>
								</div>
							</div>
						</div>
						<div>
							<h2 className="text-4xl font-headline font-bold mb-8">
								شوف النظام بنفسك
							</h2>
							<div className="grid grid-cols-2 gap-4">
								<Image
									className="rounded-xl shadow-lg border-2 border-white w-full h-auto"
									alt="mobile app interface"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDegROgZq4Jo17XRglUHQPweWkxe9EPAk5hNb9XjGGPyFnPNAJrQDM8mpy6mQurkRGTJ7duRTP8iMOrszcWXhiQK3fmO9iDcQnjK0G-SqfosHUCfeOR-kITqM5eGo8n-CkJY2Lt6_P5rkQaReOThMkS-9vcoi9ha1wxZIuR_ksAjrc2oc2r0zd4yMgQjI7cUES0FCBoeBHrNvcZ6OUstdKSPMlj1LVShUS2cpRFIoT1saLkDRiVZr5brjvTe5RVBjQkHYL4HbqNdQ"
									width={400}
									height={400}
								/>
								<Image
									className="rounded-xl shadow-lg border-2 border-white mt-8 w-full h-auto"
									alt="analytics dashboard"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-mOV9TvFQkdMO04zyZOp-1_MeSf1XCOmLh1Fw8vdl5jmZr4WnukeSsSwjxbvH-pYkzd_fGQu6_4amcVmJ-3b6HQ_vV2YBO1uG5R_s6BBpDwwoA2s5ENlSeVvngHgVZPIz33BsTI2queLot7qnCnm5sDM9-8IbSY4TBp1WFfKhL-MjGGwrLdTVe75iSKwiw31rr2nPl4nibrCsJtiBYDd2k1jQF1fOeiYBhCdEYPJLhlAyDTPVTOgiSYXAO41XYxPnnvRRWMSEN2o"
									width={400}
									height={400}
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Pricing */}
			<section className="py-24" id="pricing">
				<div className="max-w-4xl mx-auto px-8">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-headline font-bold mb-4">
							باقات تناسب نموك
						</h2>
						<p className="text-on-surface-variant">
							اختر الخطة المناسبة لعدد طلابك الحالي
						</p>
					</div>
					<div className="grid md:grid-cols-2 gap-8">
						{/* Free Tier */}
						<div className="bg-surface border border-outline-variant/30 p-10 rounded-2xl flex flex-col items-center text-center">
							<span className="text-primary font-bold mb-2">
								الباقة الأساسية
							</span>
							<h3 className="text-5xl font-extrabold mb-6">مجاني</h3>
							<ul className="space-y-4 mb-10 text-on-surface-variant justify-center items-center">
								<li className="flex items-center gap-2 justify-center">
									<span className="material-symbols-outlined text-secondary text-sm">
										check_circle
									</span>{" "}
									حتى 10 طلاب
								</li>
								<li className="flex items-center gap-2 justify-center">
									<span className="material-symbols-outlined text-secondary text-sm">
										check_circle
									</span>{" "}
									إدارة حصص أساسية
								</li>
								<li className="flex items-center gap-2 justify-center">
									<span className="material-symbols-outlined text-secondary text-sm">
										check_circle
									</span>{" "}
									تسجيل حضور يدوي
								</li>
							</ul>
							<Link
								href="/register"
								className="w-full py-4 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-colors block"
							>
								ابدأ الآن
							</Link>
						</div>

						{/* Paid Tier */}
						<div className="bg-primary-container text-on-primary-container p-10 rounded-2xl flex flex-col items-center text-center shadow-xl shadow-primary/20 relative">
							<div className="absolute -top-4 bg-secondary text-white px-4 py-1 rounded-full text-sm font-bold">
								الأكثر طلباً
							</div>
							<span className="opacity-80 font-bold mb-2">باقة المحترفين</span>
							<div className="flex items-baseline gap-1 mb-6">
								<span className="text-5xl font-extrabold">199</span>
								<span className="text-lg">ج.م/شهر</span>
							</div>
							<ul className="space-y-4 mb-10 text-on-primary-container/90 justify-center items-center">
								<li className="flex items-center gap-2 justify-center">
									<span
										className="material-symbols-outlined text-secondary-fixed text-sm"
										style={{ fontVariationSettings: "'FILL' 1" }}
									>
										check_circle
									</span>{" "}
									عدد طلاب غير محدود
								</li>
								<li className="flex items-center gap-2 justify-center">
									<span
										className="material-symbols-outlined text-secondary-fixed text-sm"
										style={{ fontVariationSettings: "'FILL' 1" }}
									>
										check_circle
									</span>{" "}
									تقارير أداء ذكية
								</li>
								<li className="flex items-center gap-2 justify-center">
									<span
										className="material-symbols-outlined text-secondary-fixed text-sm"
										style={{ fontVariationSettings: "'FILL' 1" }}
									>
										check_circle
									</span>{" "}
									رسائل تلقائية للأهالي
								</li>
								<li className="flex items-center gap-2 justify-center">
									<span
										className="material-symbols-outlined text-secondary-fixed text-sm"
										style={{ fontVariationSettings: "'FILL' 1" }}
									>
										check_circle
									</span>{" "}
									دعم فني مخصص
								</li>
							</ul>
							<button className="w-full py-4 bg-white text-primary font-bold rounded-lg hover:bg-surface-bright transition-colors block">
								اشترك الآن
							</button>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="py-24 bg-surface-container-low" id="faq">
				<div className="max-w-3xl mx-auto px-8">
					<h2 className="text-3xl font-headline font-bold text-center mb-12">
						الأسئلة الشائعة
					</h2>
					<div className="space-y-4">
						<details className="group bg-surface-container-lowest rounded-xl">
							<summary className="list-none p-6 flex justify-between items-center cursor-pointer font-bold">
								هل التطبيق متاح على الأندرويد والآيفون؟
								<span className="material-symbols-outlined group-open:rotate-180 transition-transform">
									expand_more
								</span>
							</summary>
							<div className="px-6 pb-6 text-on-surface-variant leading-relaxed">
								نعم، المنصة متاحة كتطبيق على المتجرين وأيضاً من خلال المتصفح
								لأجهزة الكمبيوتر.
							</div>
						</details>
						<details className="group bg-surface-container-lowest rounded-xl">
							<summary className="list-none p-6 flex justify-between items-center cursor-pointer font-bold">
								كيف يتابع ولي الأمر مستوى ابنه؟
								<span className="material-symbols-outlined group-open:rotate-180 transition-transform">
									expand_more
								</span>
							</summary>
							<div className="px-6 pb-6 text-on-surface-variant leading-relaxed">
								يمكن لولي الأمر تحميل نسخة خاصة من التطبيق &quot;المدرس برو - أولياء
								الأمور&quot; ومتابعة تقارير الحضور والنتائج فورياً.
							</div>
						</details>
						<details className="group bg-surface-container-lowest rounded-xl">
							<summary className="list-none p-6 flex justify-between items-center cursor-pointer font-bold">
								هل بياناتي وبيانات طلابي آمنة؟
								<span className="material-symbols-outlined group-open:rotate-180 transition-transform">
									expand_more
								</span>
							</summary>
							<div className="px-6 pb-6 text-on-surface-variant leading-relaxed">
								بكل تأكيد، نستخدم أعلى معايير التشفير والحماية لضمان خصوصية
								بياناتك ومعلومات طلابك.
							</div>
						</details>
						<details className="group bg-surface-container-lowest rounded-xl">
							<summary className="list-none p-6 flex justify-between items-center cursor-pointer font-bold">
								هل يمكنني تجربة الباقة المدفوعة؟
								<span className="material-symbols-outlined group-open:rotate-180 transition-transform">
									expand_more
								</span>
							</summary>
							<div className="px-6 pb-6 text-on-surface-variant leading-relaxed">
								نعم، نوفر فترة تجريبية مجانية لمدة 14 يوم لجميع المميزات
								المتقدمة عند إنشاء حساب جديد.
							</div>
						</details>
					</div>
				</div>
			</section>

			{/* Final CTA */}
			<section className="py-32 px-8">
				<div className="max-w-5xl mx-auto bg-primary rounded-[3rem] p-16 text-center text-on-primary relative overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container opacity-50"></div>
					<div className="relative z-10">
						<h2 className="text-4xl lg:text-6xl font-headline font-extrabold mb-8 leading-tight">
							ابدأ دلوقتي وخلّي شغلك أسهل
						</h2>
						<p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto">
							انضم لآلاف المعلمين الذين غيروا طريقتهم في إدارة دروسهم للأفضل مع
							المدرس برو.
						</p>
						<Link
							href="/welcome"
							className="bg-white text-primary px-12 py-5 rounded-xl text-2xl font-bold hover:scale-105 transition-all shadow-2xl inline-block"
						>
							ابدأ مجانًا
						</Link>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-slate-50 dark:bg-slate-950 w-full border-t border-slate-200 dark:border-slate-800">
				<div className="flex flex-col md:flex-row justify-between items-center px-10 py-12 gap-6 max-w-7xl mx-auto font-manrope text-xs text-slate-500 dark:text-slate-400">
					<div className="flex flex-col items-center md:items-start gap-2">
						<span className="text-lg font-bold text-slate-900 dark:text-slate-100">
							المدرس برو
						</span>
						<p>
							© المدرس برو. المساعد الذكي للمعلمين. {formatNumber(new Date().getFullYear())}
						</p>
					</div>
					<div className="flex flex-wrap justify-center gap-8 items-center">
						<Link
							href="https://www.facebook.com/profile.php?id=61577818875544"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-blue-600 transition-colors bg-white shadow-sm p-3 rounded-full hover:shadow-md border border-slate-200"
							aria-label="Facebook Profile"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="#1877F2"
							>
								<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
							</svg>
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
