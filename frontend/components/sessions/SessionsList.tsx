"use client";

import { useState } from "react";
import Link from "next/link";
import { formatNumber } from "@/lib/format";
import SessionCard from "@/components/ui/SessionCard";
import { Group } from "@/services/api/groups";
import { Student } from "@/services/api/teachers";
import { EditSessionBottomSheet } from "./EditSessionBottomSheet";

interface SessionsListProps {
	groups: Group[];
	students: Student[];
}

export default function SessionsList({ groups, students }: SessionsListProps) {
	const [editingGroup, setEditingGroup] = useState<Group | null>(null);

	if (groups.length === 0) {
		return (
			<div className="text-center py-20 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 border-dashed">
				<span className="material-symbols-outlined text-6xl text-outline-variant mb-4">
					event_busy
				</span>
				<h3 className="text-xl font-bold text-on-surface mb-2">
					لا توجد حصص مجدولة
				</h3>
				<p className="text-on-surface-variant">ابدأ بإضافة حصة جديدة لطلابك</p>
			</div>
		);
	}

	return (
		<div className="space-y-4 px-2 md:px-0">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{groups.map(group => (
					<SessionCard
						key={group.id}
						group={group}
						onEdit={() => setEditingGroup(group)}
					/>
				))}
			</div>

			<EditSessionBottomSheet
				isOpen={!!editingGroup}
				onClose={() => setEditingGroup(null)}
				group={editingGroup}
				students={students}
			/>
		</div>
	);
}
