"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardBottomNav() {
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    const isActive = path === "/student-dashboard" ? pathname === path : pathname.startsWith(path);
    if (isActive) {
      return "flex flex-col items-center justify-center bg-primary/10 text-primary rounded-2xl px-5 py-2 active:scale-95 transition-transform duration-150";
    }
    return "flex flex-col items-center justify-center text-outline-variant px-5 py-2 hover:text-primary active:scale-95 transition-transform duration-150";
  };

  const getIconFill = (path: string) => {
    const isActive = path === "/student-dashboard" ? pathname === path : pathname.startsWith(path);
    return isActive ? 1 : 0;
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-surface-container-lowest/85 backdrop-blur-md border-t border-surface-dim shadow-[0_-8px_32px_rgba(0,0,0,0.06)] rounded-t-3xl">
      <Link href="/student-dashboard" className={getLinkClasses("/student-dashboard")}>
        <span className="material-symbols-outlined transition-all" style={{ fontVariationSettings: `'FILL' ${getIconFill("/student-dashboard")}` }}>home</span>
        <span className="font-manrope text-xs font-medium mt-1">الرئيسية</span>
      </Link>
      <Link href="/student-dashboard/homework" className={getLinkClasses("/student-dashboard/homework")}>
        <span className="material-symbols-outlined transition-all" style={{ fontVariationSettings: `'FILL' ${getIconFill("/student-dashboard/homework")}` }}>menu_book</span>
        <span className="font-manrope text-xs font-medium mt-1">الواجبات</span>
      </Link>
      <Link href="/student-dashboard/chat" className={getLinkClasses("/student-dashboard/chat")}>
        <span className="material-symbols-outlined transition-all" style={{ fontVariationSettings: `'FILL' ${getIconFill("/student-dashboard/chat")}` }}>chat</span>
        <span className="font-manrope text-xs font-medium mt-1">المحادثة</span>
      </Link>
      <Link href="/student-dashboard/payments" className={getLinkClasses("/student-dashboard/payments")}>
        <span className="material-symbols-outlined transition-all" style={{ fontVariationSettings: `'FILL' ${getIconFill("/student-dashboard/payments")}` }}>payments</span>
        <span className="font-manrope text-xs font-medium mt-1">المدفوعات</span>
      </Link>
    </nav>
  );
}
