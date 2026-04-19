"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export function InviteSuccessToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("inviteAccepted") === "true") {
      setIsVisible(true);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Clear query parameter
        const newUrl = window.location.pathname;
        router.replace(newUrl, { scroll: false });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
      dir="rtl"
    >
      <div className="bg-primary text-on-primary px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-on-primary/10">
        <span className="material-symbols-outlined text-2xl">check_circle</span>
        <span className="font-bold text-lg">تم الانضمام للمعلم بنجاح</span>
        <button 
          onClick={() => setIsVisible(false)}
          className="mr-2 hover:bg-on-primary/10 p-1 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>
    </div>
  );
}
