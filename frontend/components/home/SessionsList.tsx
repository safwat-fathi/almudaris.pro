import { mockSessions } from "@/data/mockData";
import SessionCard from "@/components/ui/SessionCard";

export default function SessionsList() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-headline font-bold text-on-surface">حصص اليوم</h2>
        <button className="text-primary font-semibold text-sm flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">arrow_back_ios</span>
          عرض الكل
        </button>
      </div>
      
      <div className="space-y-4">
        {mockSessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </section>
  );
}
