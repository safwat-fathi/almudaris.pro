export default function StudentQuickActions() {
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-bold text-outline uppercase tracking-wider px-2 font-headline">
        إجراءات سريعة
      </h3>
      <div className="grid grid-cols-1 gap-3">
        <button className="flex items-center justify-between w-full p-5 bg-primary text-on-primary rounded-lg transition-transform active:scale-95 shadow-[0_4px_16px_rgba(0,91,191,0.15)] group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                how_to_reg
              </span>
            </div>
            <span className="text-lg font-bold font-headline">تسجيل حضور</span>
          </div>
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        
        <button className="flex items-center justify-between w-full p-5 bg-secondary-container text-on-secondary-container rounded-lg transition-transform active:scale-95 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-on-secondary-container/10 rounded-full flex items-center justify-center group-hover:bg-on-secondary-container/20 transition-colors">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                payments
              </span>
            </div>
            <span className="text-lg font-bold font-headline">تسجيل دفع</span>
          </div>
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        
        <button className="flex items-center justify-between w-full p-5 bg-surface-container-high text-primary rounded-lg transition-transform active:scale-95 group hover:bg-surface-container-highest">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                edit_note
              </span>
            </div>
            <span className="text-lg font-bold font-headline">إضافة ملاحظة</span>
          </div>
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
      </div>
    </section>
  );
}
