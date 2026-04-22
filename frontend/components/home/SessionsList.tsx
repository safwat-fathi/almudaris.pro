"use client";

import { useState } from "react";
import Link from "next/link";
import SessionCard from "@/components/ui/SessionCard";
import { Group } from "@/services/api/groups";
import { Student } from "@/services/api/teachers";
import { EditSessionBottomSheet } from "@/components/sessions/EditSessionBottomSheet";

interface SessionsListProps {
  groups?: Group[];
  students?: Student[];
}

export default function SessionsList({ groups = [], students = [] }: SessionsListProps) {
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  const sessions = groups.slice(0, 3).map((group) => {
    const isOnline = group.location_type === "Online";
    return {
      id: group.id.toString(),
      title: group.title || "حصة تعليمية",
      time: group.start_time || "",
      studentsCount: group.students?.length || 0,
      icon: isOnline ? "language" : "location_on",
      color: isOnline ? "primary" : "secondary",
      status: group.status === "Scheduled" ? "active" : "inactive",
      originalGroup: group,
    };
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-headline font-bold text-on-surface">حصص اليوم</h2>
        <Link href="/sessions" className="text-primary font-semibold text-sm flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">arrow_back_ios</span>
          عرض الكل
        </Link>
      </div>
      
      <div className="space-y-4">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <SessionCard 
              key={session.id} 
              session={session} 
              onEdit={() => setEditingGroup(session.originalGroup)}
            />
          ))
        ) : (
          <div className="text-center py-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 border-dashed">
            <p className="text-on-surface-variant">لا توجد حصص اليوم</p>
          </div>
        )}
      </div>

      <EditSessionBottomSheet
        isOpen={!!editingGroup}
        onClose={() => setEditingGroup(null)}
        group={editingGroup}
        students={students}
      />
    </section>
  );
}
