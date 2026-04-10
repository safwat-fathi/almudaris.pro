import Link from "next/link";
import { formatNumber } from "@/lib/format";

interface SessionCardProps {
  session: {
    id: string;
    title: string;
    time: string;
    studentsCount: number;
    icon: string;
    color: string;
    status: string;
  };
}

export default function SessionCard({ session }: SessionCardProps) {
  const isPrimary = session.color === "primary";
  const isActive = session.status === "active";

  return (
    <div className={`bg-white p-5 rounded-2xl ${isPrimary ? 'shadow-md border-r-4 border-primary' : 'shadow-sm border-r-4 border-outline-variant'} flex flex-col gap-4 relative`}>
      <Link 
        href={`/sessions/${session.id}/edit`}
        className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container-highest hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">edit</span>
      </Link>
      
      <div className="flex items-start justify-between">
        <div className={`space-y-2 pr-2 ${!isPrimary ? 'text-on-surface/60' : ''}`}>
          <h3 className="font-headline font-bold text-lg">{session.title}</h3>
          <div className={`flex items-center gap-4 text-sm font-medium ${isPrimary ? 'text-on-surface-variant' : ''}`}>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">schedule</span> {session.time}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">group</span> {formatNumber(session.studentsCount)} طالب
            </span>
          </div>
        </div>
        <div className={`w-12 h-12 flex items-center justify-center rounded-xl text-xl font-bold ml-8 ${isPrimary ? 'bg-primary-fixed text-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
          <span className="material-symbols-outlined">{session.icon}</span>
        </div>
      </div>
      
      {isActive ? (
        <button className="bg-primary text-on-primary w-full py-3.5 rounded-xl font-bold text-lg hover:opacity-95 active:scale-95 transition-all">
          ابدأ الحصة
        </button>
      ) : (
        <button className="bg-surface-container-high text-on-surface-variant w-full py-3.5 rounded-xl font-bold text-lg cursor-not-allowed">
          قريبًا
        </button>
      )}
    </div>
  );
}
