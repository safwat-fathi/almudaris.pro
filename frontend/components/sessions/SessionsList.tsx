"use client";

import { useState } from "react";
import Link from "next/link";
import { formatNumber } from "@/lib/format";
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
				{groups.map(group => {
					const isOnline = group.location_type === "Online";
					const icon = isOnline ? "language" : "location_on";
					const color = isOnline ? "primary" : "secondary";
					const statusText =
						group.status === "Scheduled"
							? "قادمة"
							: group.status === "Completed"
								? "مكتملة"
								: "ملغاة";
					const statusClass =
						group.status === "Scheduled"
							? "bg-blue-100 text-blue-800"
							: group.status === "Completed"
								? "bg-green-100 text-green-800"
								: "bg-red-100 text-red-800";

					return (
						<div
							key={group.id}
							className="group block bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 hover:border-primary/50 hover:shadow-md transition-all duration-300 relative overflow-hidden"
						>
							{/* Color accent bar */}
							<div
								className={`absolute top-0 right-0 bottom-0 w-1.5 bg-${color}`}
							></div>

							<div className="flex justify-between items-start mb-4">
								<div className="flex items-center gap-3">
									<div
										className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${color}-container text-on-${color}-container`}
									>
										<span className="material-symbols-outlined text-2xl">
											{icon}
										</span>
									</div>
									<div>
										<h3 className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors">
											<Link
												href={`/sessions/${group.id}`}
												className="before:absolute before:inset-0"
											>
												{group.title || "حصة تعليمية"}
											</Link>
										</h3>
										<div className="flex items-center gap-2 mt-1">
											<span
												className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusClass}`}
											>
												{statusText}
											</span>
										</div>
									</div>
								</div>

								{/* Edit Button */}
								<button
									type="button"
									onClick={e => {
										e.preventDefault();
										setEditingGroup(group);
									}}
									className="relative z-10 w-10 h-10 flex items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-highest hover:text-primary transition-colors cursor-pointer"
								>
									<span className="material-symbols-outlined text-[20px]">
										edit
									</span>
								</button>
							</div>

							<div className="grid grid-cols-2 gap-4 mt-6">
								<div className="flex items-center gap-2 text-on-surface-variant">
									<span className="material-symbols-outlined text-xl opacity-70">
										schedule
									</span>
									<span className="text-sm font-medium">
										{group.start_time}
									</span>
								</div>
								<div className="flex items-center gap-2 text-on-surface-variant">
									<span className="material-symbols-outlined text-xl opacity-70">
										group
									</span>
									<span className="text-sm font-medium">
										{formatNumber(group.students?.length || 0)} طلاب
									</span>
								</div>
							</div>

							<div className="absolute left-6 bottom-6 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
								<span
									className="material-symbols-outlined text-primary"
									style={{ direction: "ltr" }}
								>
									arrow_forward
								</span>
							</div>
						</div>
					);
				})}
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
