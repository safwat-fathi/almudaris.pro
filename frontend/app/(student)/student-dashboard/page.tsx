import type { Metadata } from "next";
import { formatCurrency } from "@/lib/format";
import { cookies } from "next/headers";
import CONSTANTS from "@/lib/constants";

export const metadata: Metadata = {
  title: "لوحة تحكم الطالب",
  description: "لوحة تحكم الطالب وولي الأمر — متابعة الحضور والمستوى والواجبات والمدفوعات",
};

export default async function StudentDashboardHome() {
  const cookieStore = await cookies();
  const userDataStr = cookieStore.get(CONSTANTS.USER_DATA)?.value;
  let userName = "أحمد محمد";
  let userPhone = "";
  
  if (userDataStr) {
    try {
      const userData = JSON.parse(userDataStr);
      userName = userData.name || userName;
      userPhone = userData.phone || "";
    } catch {
      // Ignore parse error
    }
  }

  return (
		<div className="bg-surface text-on-surface antialiased pb-32 min-h-screen">
			<main className="max-w-4xl mx-auto px-6 space-y-10 mt-6">
				{/* Welcome Section */}
				<section className="space-y-2 text-right">
					<h2 className="text-3xl font-bold font-manrope tracking-tight text-on-surface">
						أهلاً بك، {userName}
					</h2>
					<p className="text-on-surface-variant text-lg">
						{userPhone ? `ولي الأمر - ${userPhone}` : "الصف الثالث الثانوي - فيزياء"}
					</p>
				</section>

				{/* Summary Horizontal Scroll Cards */}
				<section className="overflow-x-auto no-scrollbar -mx-6 px-6">
					<div className="flex gap-4 pb-4">
						{/* Attendance */}
						<div className="shrink-0 w-44 p-5 bg-secondary-container text-on-secondary-container rounded-lg space-y-3">
							<span className="material-symbols-outlined text-3xl">
								calendar_today
							</span>
							<div className="space-y-1">
								<p className="text-xs opacity-80">الحضور</p>
								<p className="text-xl font-bold">8 / 10 حصص</p>
							</div>
						</div>
						{/* Performance */}
						<div className="shrink-0 w-44 p-5 bg-surface-container-highest text-on-surface rounded-lg space-y-3">
							<span className="material-symbols-outlined text-3xl text-primary">
								analytics
							</span>
							<div className="space-y-1">
								<p className="text-xs text-on-surface-variant">المتوسط</p>
								<p className="text-xl font-bold text-on-surface">78%</p>
							</div>
						</div>
						{/* Homework */}
						<div className="shrink-0 w-44 p-5 bg-tertiary-container text-on-tertiary-container rounded-lg space-y-3">
							<span className="material-symbols-outlined text-3xl">
								assignment
							</span>
							<div className="space-y-1">
								<p className="text-xs opacity-90">الواجبات</p>
								<p className="text-xl font-bold">2 متبقي</p>
							</div>
						</div>
						{/* Payments */}
						<div className="shrink-0 w-44 p-5 bg-primary-container text-on-primary-container rounded-lg space-y-3">
							<span className="material-symbols-outlined text-3xl">
								payments
							</span>
							<div className="space-y-1">
								<p className="text-xs opacity-80">مدفوع حتى</p>
								<p className="text-xl font-bold">25 مارس</p>
							</div>
						</div>
					</div>
				</section>

				{/* Bento Grid Main Content */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Next Session Card */}
					<div className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex flex-col justify-between">
						<div className="space-y-4">
							<div className="flex justify-between items-start">
								<span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold">
									الحصة القادمة
								</span>
								<span className="material-symbols-outlined text-primary-container">
									near_me
								</span>
							</div>
							<div className="space-y-2 text-right">
								<h3 className="text-2xl font-bold">غداً - 06:00 م</h3>
								<div className="flex items-center gap-2 text-on-surface-variant">
									<span className="material-symbols-outlined text-sm">
										location_on
									</span>
									<span>المركز التعليمي الرئيسي</span>
								</div>
							</div>
						</div>
						<div className="flex gap-3 mt-8">
							<button className="flex-1 bg-primary text-on-primary py-4 rounded-md font-bold transition-transform active:scale-95 shadow-lg shadow-primary/20">
								تنبيه
							</button>
							<button className="flex-1 bg-surface-container-high text-primary py-4 rounded-md font-bold transition-transform active:scale-95">
								كل الحصص
							</button>
						</div>
					</div>

					{/* Announcements & Teacher Note */}
					<div className="space-y-8">
						{/* Announcement */}
						<div className="bg-tertiary-container/10 p-6 rounded-lg border-r-4 border-tertiary flex gap-4 items-center">
							<span className="material-symbols-outlined text-tertiary text-3xl">
								campaign
							</span>
							<div>
								<p className="font-bold text-tertiary text-right">تنبيه هام</p>
								<p className="text-on-surface-variant text-right">
									لا يوجد حصة يوم الجمعة القادم نظراً للإجازة الرسمية.
								</p>
							</div>
						</div>
						{/* Teacher Note */}
						<div className="bg-surface-container-low p-6 rounded-lg flex gap-4 items-start">
							<span
								className="material-symbols-outlined text-primary text-2xl"
								style={{ fontVariationSettings: "'FILL' 1" }}
							>
								chat_bubble
							</span>
							<div className="space-y-2 text-right">
								<p className="text-sm font-bold text-primary">ملاحظة المدرس</p>
								<p className="text-on-surface leading-relaxed italic">
									&quot;أحمد يتحسن بشكل ملحوظ في الفهم النظري، ولكن يحتاج لمزيد من
									التركيز والتدريب على حل المعادلات الرياضية المعقدة.&quot;
								</p>
							</div>
						</div>
					</div>

					{/* Performance Deep Dive */}
					<div className="md:col-span-2 bg-surface-container-low p-8 rounded-lg space-y-8">
						<div className="flex justify-between items-end">
							<div className="space-y-1 text-right">
								<h3 className="text-xl font-bold text-on-surface">
									تطور مستوى الفيزياء
								</h3>
								<p className="text-on-surface-variant text-sm">
									بناءً على آخر 5 اختبارات
								</p>
							</div>
							<span className="text-3xl font-black text-primary">80%</span>
						</div>
						<div className="w-full bg-surface-container-high h-4 rounded-full overflow-hidden">
							<div
								className="bg-primary h-full rounded-full"
								style={{ width: "80%" }}
							></div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
							<div className="flex justify-between items-center p-5 bg-surface-container-lowest rounded-lg">
								<div className="flex items-center gap-3">
									<span className="material-symbols-outlined text-secondary">
										check_circle
									</span>
									<span className="font-medium text-on-surface">
										اختبار شامل 1
									</span>
								</div>
								<span className="font-bold text-on-surface-variant">75%</span>
							</div>
							<div className="flex justify-between items-center p-5 bg-surface-container-lowest rounded-lg">
								<div className="flex items-center gap-3">
									<span className="material-symbols-outlined text-secondary">
										check_circle
									</span>
									<span className="font-medium text-on-surface">
										كويز مفاهيم
									</span>
								</div>
								<span className="font-bold text-on-surface-variant">80%</span>
							</div>
						</div>
					</div>

					{/* Homework Section */}
					<div className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.06)] space-y-6">
						<div className="flex justify-between items-center">
							<h3 className="text-xl font-bold text-on-surface">
								الواجبات المنزلية
							</h3>
							<span className="text-tertiary text-sm font-bold">1 متبقي</span>
						</div>
						<div className="space-y-4">
							{/* Pending */}
							<div className="p-5 border-2 border-primary/10 rounded-lg flex justify-between items-center bg-primary/5">
								<div className="space-y-1 text-right">
									<p className="font-bold text-on-surface">
										حل شيت 5 - الميكانيكا
									</p>
									<p className="text-xs text-tertiary">ينتهي غداً</p>
								</div>
								<button className="bg-primary text-on-primary px-5 py-2.5 rounded-md text-sm font-bold shadow-md shadow-primary/20">
									ابدأ الآن
								</button>
							</div>
							{/* Completed */}
							<div className="p-5 bg-surface-container-low rounded-lg flex justify-between items-center opacity-60">
								<div className="space-y-1 text-right">
									<p className="font-medium line-through text-on-surface">
										شيت 4 - الكهرباء
									</p>
									<p className="text-xs text-secondary">تم التسليم</p>
								</div>
								<span
									className="material-symbols-outlined text-secondary"
									style={{ fontVariationSettings: "'FILL' 1" }}
								>
									check_circle
								</span>
							</div>
						</div>
					</div>

					{/* Payments Detail */}
					<div className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.06)] space-y-6">
						<h3 className="text-xl font-bold text-on-surface text-right">
							المدفوعات والرسوم
						</h3>
						<div className="space-y-4">
							<div className="flex justify-between items-center py-2">
								<span className="text-on-surface-variant">الحالة الحالية</span>
								<span className="text-secondary font-bold">
									مدفوع حتى 25 مارس
								</span>
							</div>
							<div className="h-px w-full bg-surface-container-high"></div>
							<div className="bg-surface-container-low p-6 rounded-lg space-y-3">
								<div className="flex justify-between items-center">
									<span className="font-medium text-on-surface">
										القسط القادم
									</span>
									<span className="text-lg font-black text-primary">
										{formatCurrency(200)}
									</span>
								</div>
								<div className="flex items-center gap-2 text-tertiary text-sm font-bold">
									<span className="material-symbols-outlined text-sm">
										schedule
									</span>
									<span>يجب السداد خلال 3 أيام</span>
								</div>
							</div>
							<button className="w-full py-4 text-primary font-bold border-2 border-primary/20 rounded-md hover:bg-primary/5 transition-colors">
								عرض السجل المالي
							</button>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
