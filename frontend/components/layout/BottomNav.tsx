"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  href: string;
  icon: string;
  label: string;
}

export default function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    // Exact match for root paths, startWith for sub-paths (but avoid matching '/' for everything)
    const isActive = path === "/" || path === "/student-dashboard" 
      ? pathname === path 
      : pathname === path || pathname.startsWith(`${path}/`);
      
    if (isActive) {
      return "flex flex-col items-center justify-center bg-primary/10 text-primary rounded-[1.5rem] px-5 py-2 active:scale-95 transition-transform duration-150";
    }
    return "flex flex-col items-center justify-center text-outline-variant px-5 py-2 hover:text-primary active:scale-95 transition-transform duration-150";
  };

  const getIconFill = (path: string) => {
    const isActive = path === "/" || path === "/student-dashboard" 
      ? pathname === path 
      : pathname === path || pathname.startsWith(`${path}/`);
    return isActive ? 1 : 0;
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-surface-container-lowest/85 backdrop-blur-md shadow-[0_-8px_32px_rgba(0,0,0,0.06)] rounded-t-3xl border-t border-surface-dim">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className={getLinkClasses(item.href)}>
          <span className="material-symbols-outlined transition-all" style={{ fontVariationSettings: `'FILL' ${getIconFill(item.href)}` }}>{item.icon}</span>
          <span className="font-manrope text-xs font-medium mt-1">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
