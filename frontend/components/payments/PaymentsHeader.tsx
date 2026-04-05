export default function PaymentsHeader() {
  return (
    <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="text-4xl font-extrabold font-headline text-on-surface mb-2">سجل المدفوعات</h1>
        <p className="text-on-surface-variant text-lg">متابعة الاشتراكات وتحصيل الرسوم من الطلاب</p>
      </div>
      {/* Search Bar */}
      <div className="relative w-full md:w-96 group">
        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
          search
        </span>
        <input 
          className="w-full bg-surface-container-lowest border-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary rounded-lg py-4 pr-12 pl-4 text-on-surface placeholder:text-outline transition-all" 
          placeholder="ابحث عن اسم طالب أو إيصال..." 
          type="text" 
        />
      </div>
    </header>
  );
}
