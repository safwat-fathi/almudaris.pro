import { formatCurrency } from "@/lib/format";

export default function StudentTimeline() {
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-sm font-bold text-outline uppercase tracking-wider font-headline">
          السجل الأخير
        </h3>
        <button className="text-primary text-sm font-bold hover:underline">
          عرض الكل
        </button>
      </div>

      <div className="space-y-4 bg-surface-container-low p-6 rounded-xl shadow-sm border border-outline-variant/10">
        
        {/* Timeline Item 1 */}
        <div className="flex gap-4 relative">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-secondary ring-4 ring-secondary-container/30 z-10"></div>
            <div className="w-[2px] h-full bg-outline-variant/30 absolute top-3"></div>
          </div>
          <div className="flex-1 pb-6">
            <div className="flex justify-between items-start mb-1">
              <p className="font-bold text-on-surface font-headline">تم تسجيل الحضور</p>
              <span className="text-xs text-outline font-label">اليوم، 04:00 م</span>
            </div>
            <p className="text-sm text-on-surface-variant">حصة الرياضيات - الوحدة الرابعة</p>
          </div>
        </div>

        {/* Timeline Item 2 */}
        <div className="flex gap-4 relative">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary-container/20 z-10"></div>
            <div className="w-[2px] h-full bg-outline-variant/30 absolute top-3"></div>
          </div>
          <div className="flex-1 pb-6">
            <div className="flex justify-between items-start mb-1">
              <p className="font-bold text-on-surface font-headline">دفعة مالية مستلمة</p>
              <span className="text-xs text-outline font-label">أمس، 11:20 ص</span>
            </div>
            <p className="text-sm text-on-surface-variant">تم استلام مبلغ {formatCurrency(200)} - رسوم الشهر</p>
          </div>
        </div>

        {/* Timeline Item 3 */}
        <div className="flex gap-4 relative">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-tertiary ring-4 ring-tertiary-container/20 z-10"></div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <p className="font-bold text-on-surface font-headline">ملاحظة سلوكية</p>
              <span className="text-xs text-outline font-label">15 أكتوبر</span>
            </div>
            <p className="text-sm text-on-surface-variant italic">
              &quot;الطالب مجتهد جداً ويشارك بفاعلية في النقاش&quot;
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
