import type { Metadata } from "next";
import DashboardBottomNav from "@/components/layout/DashboardBottomNav";
import { formatCurrency } from "@/lib/format";

export const metadata: Metadata = {
  title: "مدفوعاتي",
  description: "سجل المدفوعات والرسوم الدراسية — عرض الدفعات السابقة والقادمة وحالة الحساب",
};

export default function StudentPaymentsPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* TopAppBar */}
      <header className="bg-surface/85 backdrop-blur-xl w-full top-0 sticky z-50 flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">person</span>
          </div>
          <h1 className="text-xl font-bold text-primary">Al-Mudaris Pro</h1>
        </div>
        <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-primary">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      <main className="max-w-md mx-auto px-6 pt-8 space-y-8 pb-32">
        {/* Headline Section */}
        <section>
          <h2 className="text-3xl font-extrabold font-manrope tracking-tight text-on-surface mb-2">المدفوعات</h2>
          <p className="text-on-surface-variant text-base">إدارة الرسوم الدراسية ومتابعة حالة الدفع</p>
        </section>

        {/* Bento Grid: Status Cards */}
        <div className="grid grid-cols-1 gap-4">
          {/* Payment Status Card */}
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.04)] border-none">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-secondary-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <span className="text-on-surface-variant font-medium text-sm">حالة الدفع</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-on-surface">مدفوع حتى ٢٥ مارس</h3>
              <p className="text-on-surface-variant text-sm">حسابك منتظم حالياً. شكراً لك!</p>
            </div>
          </div>

          {/* Next Payment Card (Gradient Hero) */}
          <div className="relative overflow-hidden p-8 rounded-lg bg-linear-to-br from-primary to-primary-container text-on-primary shadow-lg">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <span className="text-primary-fixed font-medium text-sm">الدفعة القادمة</span>
                  <h3 className="text-4xl font-extrabold leading-tight">{formatCurrency(200)}</h3>
                </div>
                <div className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  مستحق خلال ٣ أيام
                </div>
              </div>
              <button className="w-full py-4 bg-surface-container-lowest text-primary font-bold rounded-md hover:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">payments</span>
                تأكيد الدفع
              </button>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Payment History Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-on-surface">سجل المدفوعات</h3>
            <button className="text-primary font-bold text-sm">عرض الكل</button>
          </div>

          <div className="space-y-4">
            {/* History Item 1 */}
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface">دفعة شهر فبراير</p>
                  <p className="text-xs text-on-surface-variant">٢٠ فبراير ٢٠٢٤ • بطاقة بنكية</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-on-surface">{formatCurrency(200)}</p>
                <span className="text-[10px] text-secondary font-bold uppercase">ناجحة</span>
              </div>
            </div>

            {/* History Item 2 */}
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface">دفعة شهر يناير</p>
                  <p className="text-xs text-on-surface-variant">١٨ يناير ٢٠٢٤ • نقدي</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-on-surface">{formatCurrency(200)}</p>
                <span className="text-[10px] text-secondary font-bold uppercase">ناجحة</span>
              </div>
            </div>

            {/* History Item 3 */}
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface">رسوم التسجيل</p>
                  <p className="text-xs text-on-surface-variant">٠٥ يناير ٢٠٢٤ • بطاقة بنكية</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-on-surface">{formatCurrency(500)}</p>
                <span className="text-[10px] text-secondary font-bold uppercase">ناجحة</span>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badge */}
        <div className="flex flex-col items-center justify-center pt-4 pb-8 space-y-2 opacity-60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span className="text-xs font-medium">مدفوعات آمنة ومشفرة بالكامل</span>
          </div>
          <div className="flex gap-4 text-on-surface">
            <span className="material-symbols-outlined text-2xl">credit_card</span>
            <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <DashboardBottomNav />
    </div>
  );
}
