"use client";

import Link from "next/link";
import { mockSessions } from "@/data/mockData";
import { formatNumber } from "@/lib/format";

export default function SessionsList() {
  return (
    <div className="space-y-4 px-2 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSessions.map((session) => (
          <div
            key={session.id}
            className="group block bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 hover:border-primary/50 hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            {/* Color accent bar */}
            <div className={`absolute top-0 right-0 bottom-0 w-1.5 bg-${session.color === 'primary' ? 'primary' : 'secondary'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${session.color === 'primary' ? 'primary-container' : 'surface-variant'} text-${session.color === 'primary' ? 'on-primary-container' : 'on-surface-variant'}`}>
                  <span className="material-symbols-outlined text-2xl">{session.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors">
                    <Link href={`/sessions/${session.id}`} className="before:absolute before:inset-0">
                      {session.title}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        session.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {session.status === "active" ? "نشطة الآن" : "قادمة"}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Edit Button */}
              <Link
                href={`/sessions/${session.id}/edit`}
                className="relative z-10 w-10 h-10 flex items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-highest hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-xl opacity-70">schedule</span>
                <span className="text-sm font-medium">{session.time}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-xl opacity-70">group</span>
                <span className="text-sm font-medium">{formatNumber(session.studentsCount)} طالب</span>
              </div>
            </div>
            
            <div className="absolute left-6 bottom-6 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
               <span className="material-symbols-outlined text-primary" style={{ direction: 'ltr' }}>arrow_forward</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
