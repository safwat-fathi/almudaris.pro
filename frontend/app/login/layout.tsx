import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description:
    "تسجيل الدخول إلى المدرس برو",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
