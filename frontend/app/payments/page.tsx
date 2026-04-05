import type { Metadata } from "next";
import TopAppBar from "@/components/layout/TopAppBar";
import BottomNav from "@/components/layout/BottomNav";
import PaymentsHeader from "@/components/payments/PaymentsHeader";
import PaymentsStats from "@/components/payments/PaymentsStats";
import PaymentsList from "@/components/payments/PaymentsList";

export const metadata: Metadata = {
  title: "المدفوعات",
  description: "إدارة المدفوعات والرسوم الدراسية — عرض السجل المالي وتسجيل الدفعات",
};

export default function PaymentsPage() {
  return (
    <>
      <TopAppBar />
      <main className="max-w-5xl mx-auto px-6 md:px-8 pt-8 w-full">
        <PaymentsHeader />
        <PaymentsStats />
        <PaymentsList />
      </main>
      <BottomNav />
    </>
  );
}
