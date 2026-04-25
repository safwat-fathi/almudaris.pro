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

  

  return (
		<section className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-headline font-bold text-on-surface">
					حصص اليوم
				</h2>
				<Link
					href="/sessions"
					className="text-primary font-semibold text-sm flex items-center gap-1"
				>
					<span className="material-symbols-outlined text-sm">
						arrow_back_ios
					</span>
					عرض الكل
				</Link>
			</div>

			<div className="space-y-4">
				{groups.length > 0 ? (
					groups.map(group => (
						<SessionCard
							key={group.id}
							group={group}
							onEdit={() => setEditingGroup(group)}
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
