"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    const isActive = path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
    if (isActive) {
      return "flex flex-col items-center justify-center bg-blue-50 text-blue-700 rounded-[1.5rem] px-5 py-2 active:scale-90 transition-transform duration-200";
    }
    return "flex flex-col items-center justify-center text-slate-400 px-5 py-2 hover:text-blue-600 active:scale-90 transition-transform duration-200";
  };

  const getIconFill = (path: string) => {
    return (path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`)) ? 1 : 0;
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-6 pb-6 pt-3 dir-rtl bg-white/85 backdrop-blur-xl z-50 no-border shadow-[0_-8px_32px_rgba(0,0,0,0.06)]">
      <Link href="/" className={getLinkClasses("/")}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${getIconFill("/")}` }}>home</span>
        <span className="font-['Manrope'] text-[12px] font-medium leading-relaxed mt-1">الرئيسية</span>
      </Link>
      <Link href="/students" className={getLinkClasses("/students")}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${getIconFill("/students")}` }}>group</span>
        <span className="font-['Manrope'] text-[12px] font-medium leading-relaxed mt-1">الطلاب</span>
      </Link>
      <Link href="/sessions" className={getLinkClasses("/sessions")}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${getIconFill("/sessions")}` }}>event_note</span>
        <span className="font-['Manrope'] text-[12px] font-medium leading-relaxed mt-1">الجلسات</span>
      </Link>
      <Link href="/payments" className={getLinkClasses("/payments")}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${getIconFill("/payments")}` }}>payments</span>
        <span className="font-['Manrope'] text-[12px] font-medium leading-relaxed mt-1">المدفوعات</span>
      </Link>
      <Link href="/homework" className={getLinkClasses("/homework")}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${getIconFill("/homework")}` }}>assignment</span>
        <span className="font-['Manrope'] text-[12px] font-medium leading-relaxed mt-1">الواجبات</span>
      </Link>
    </nav>
  );
}
