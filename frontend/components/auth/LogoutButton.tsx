"use client";

import { useTransition } from "react";
import { logoutAction } from "@/app/actions/auth.actions";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      logoutAction();
    });
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={isPending}
      className={`material-symbols-outlined text-slate-500 hover:bg-slate-100 hover:text-error p-2 rounded-full transition-colors ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label="Logout"
      title="Logout"
    >
      logout
    </button>
  );
}
