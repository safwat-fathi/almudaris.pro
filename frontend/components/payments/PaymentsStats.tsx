import { mockStats } from "@/data/mockData";
import { formatCurrency, formatPercentage } from "@/lib/format";

export default function PaymentsStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-right">
      {/* Total Collected */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col items-start relative overflow-hidden group hover:border-primary/30 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 transition-transform group-hover:scale-110">
          <span className="material-symbols-outlined">account_balance_wallet</span>
        </div>
        <div className="space-y-1">
          <p className="font-medium text-sm text-on-surface-variant">إجمالي المحصل</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-headline text-on-surface">{formatCurrency(5420)}</span>
          </div>
        </div>
      </div>

      {/* Collection Rate */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col items-start relative overflow-hidden group hover:border-secondary/30 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-4 transition-transform group-hover:scale-110">
          <span className="material-symbols-outlined">trending_up</span>
        </div>
        <div className="space-y-1">
          <p className="font-medium text-sm text-on-surface-variant">نسبة التحصيل</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-headline text-on-surface">{formatPercentage(mockStats.collectionRate)}</span>
          </div>
        </div>
      </div>

      {/* Pending Amount */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col items-start relative overflow-hidden group hover:border-error/30 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center text-error mb-4 transition-transform group-hover:scale-110">
          <span className="material-symbols-outlined">warning</span>
        </div>
        <div className="space-y-1">
          <p className="font-medium text-sm text-on-surface-variant">متأخرات (قيد الانتظار)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-headline text-on-surface">{formatCurrency(1250)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
