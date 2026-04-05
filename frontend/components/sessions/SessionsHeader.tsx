import Link from "next/link";

export default function SessionsHeader() {
  return (
    <div className="flex justify-between items-center mb-8 px-2 md:px-0">
      <div>
        <h1 className="text-3xl font-bold text-on-surface font-manrope">الجلسات</h1>
        <p className="text-on-surface-variant mt-2 text-sm md:text-base">
          إدارة جلساتك التعليمية وتسجيل الحضور بسهولة.
        </p>
      </div>
      <Link href="/sessions/new" className="flex items-center gap-2 bg-primary text-on-primary px-5 py-3 rounded-full hover:bg-primary/90 transition-colors shadow-sm cursor-pointer whitespace-nowrap">
        <span className="material-symbols-outlined text-lg">add</span>
        <span className="font-bold text-sm hidden md:inline">جلسة جديدة</span>
      </Link>
    </div>
  );
}
