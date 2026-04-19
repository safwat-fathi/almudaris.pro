import TopAppBar from "@/components/layout/TopAppBar";
import BottomNav, { NavItem } from "@/components/layout/BottomNav";
import { ReactNode } from "react";
import { cookies } from "next/headers";
import CONSTANTS from "@/lib/constants";

const studentNavItems: NavItem[] = [
  { href: "/dashboard", icon: "home", label: "الرئيسية" },
  { href: "/dashboard/children", icon: "people", label: "الأبناء" },
  { href: "/dashboard/payments", icon: "payments", label: "المدفوعات" },
];

export default async function StudentLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const cookieStore = await cookies();
  const userDataStr = cookieStore.get(CONSTANTS.USER_DATA)?.value;
  let userName = "Al Mudaris Pro";
  
  if (userDataStr) {
    try {
      const userData = JSON.parse(userDataStr);
      userName = userData.name || userName;
    } catch {
      // Ignore parse error
    }
  }

  const subtitle = (
    <>
      <span className="w-2 h-2 rounded-full bg-secondary"></span>
      <span className="text-xs font-medium text-secondary">🟢 تقدم ممتاز</span>
    </>
  );

  return (
    <>
      <TopAppBar 
        title={userName}
        subtitle={subtitle}
        largeTitle={true}
      />
      {children}
      <BottomNav items={studentNavItems} />
    </>
  );
}
