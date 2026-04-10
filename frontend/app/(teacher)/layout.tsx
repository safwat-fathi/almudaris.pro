import TopAppBar from "@/components/layout/TopAppBar";
import BottomNav, { NavItem } from "@/components/layout/BottomNav";
import { mockUser } from "@/data/mockData";
import { ReactNode } from "react";

const teacherNavItems: NavItem[] = [
  { href: "/", icon: "home", label: "الرئيسية" },
  { href: "/students", icon: "group", label: "الطلاب" },
  { href: "/sessions", icon: "event_note", label: "الجلسات" },
  { href: "/payments", icon: "payments", label: "المدفوعات" },
  // { href: "/homework", icon: "assignment", label: "الواجبات" },
  { href: "/chat", icon: "chat", label: "المحادثة" },
];

export default function TeacherLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <TopAppBar 
        title="Al Mudaris Pro"
        avatarUrl={mockUser.avatarUrl}
      />
      {children}
      <BottomNav items={teacherNavItems} />
    </>
  );
}
