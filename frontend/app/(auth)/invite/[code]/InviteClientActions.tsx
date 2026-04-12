"use client";

import { useTransition, useState } from "react";
import { acceptInvitation } from "./actions";
import { useRouter } from "next/navigation";

export default function InviteClientActions({ code }: { code: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAccept = () => {
    startTransition(async () => {
      setError(null);
      const res = await acceptInvitation(code);
      if (res?.error) {
        if (res.error === "You are already linked to this teacher.") {
          setError("أنت مرتبط بالفعل بهذا المعلم.");
        } else {
          setError(res.error);
        }
      } else {
        router.push("/dashboard");
      }
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <div className="bg-error/10 text-error p-3 rounded-lg text-sm font-semibold text-center">
          {error}
        </div>
      )}
      <button 
        onClick={handleAccept}
        disabled={isPending || error === "أنت مرتبط بالفعل بهذا المعلم."}
        className="w-full h-14 bg-primary text-on-primary rounded-xl font-extrabold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPending && <span className="material-symbols-outlined animate-spin">progress_activity</span>}
        {isPending ? "جاري ربط الحساب..." : error === "أنت مرتبط بالفعل بهذا المعلم." ? "مرتبط بالفعل" : "تأكيد الانضمام"}
      </button>
      {error === "أنت مرتبط بالفعل بهذا المعلم." && (
         <button onClick={() => router.push("/dashboard")} className="w-full h-14 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary/5 transition-all mt-2">
            متابعة للوحة التحكم
         </button>
      )}
    </div>
  );
}
