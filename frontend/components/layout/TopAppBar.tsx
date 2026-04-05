import Image from "next/image";
import { mockUser } from "@/data/mockData";

export default function TopAppBar() {
  return (
    <header className="bg-white/90 backdrop-blur-xl top-0 sticky z-50 flex justify-between items-center w-full px-6 h-16 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-container overflow-hidden border border-primary/10 relative">
          <Image 
            src={mockUser.avatarUrl}
            alt="Teacher Profile"
            fill
            sizes="40px"
            className="object-cover"
            suppressHydrationWarning
          />
        </div>
        <span className="font-headline font-bold text-lg tracking-tight text-primary">Al Mudaris Pro</span>
      </div>
      <button className="material-symbols-outlined text-slate-500 hover:bg-slate-100 p-2 rounded-full transition-colors">
        notifications
      </button>
    </header>
  );
}
