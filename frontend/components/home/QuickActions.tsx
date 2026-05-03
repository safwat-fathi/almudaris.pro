"use client";

import Link from "next/link";
import { useState } from "react";
import { NewSessionBottomSheet } from "../sessions/NewSessionBottomSheet";
import { Student } from "@/services/api/teachers";

type Props = {
	students: Student[];
};

export default function QuickActions({ students }: Props) {
	const [isNewSheetOpen, setIsNewSheetOpen] = useState(false);

	return (
		<>
			<section className="space-y-4">
				<h2 className="text-xl font-headline font-bold text-on-surface">
					إجراءات سريعة
				</h2>
				<div className="grid grid-cols-2 gap-4">
					<button
						onClick={() => setIsNewSheetOpen(true)}
						className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow active:scale-95"
					>
						<div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
							<span className="material-symbols-outlined text-primary text-3xl">
								calendar_add_on
							</span>
						</div>
						<span className="font-headline font-bold text-sm">إضافة حصة</span>
					</button>
					<Link
						href="/profile/invite"
						className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow active:scale-95"
					>
						<div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
							<span className="material-symbols-outlined text-primary text-3xl">
								qr_code
							</span>
						</div>
						<span className="font-headline font-bold text-sm">رابط الدعوة</span>
					</Link>
				</div>
			</section>
			<NewSessionBottomSheet
				isOpen={isNewSheetOpen}
				onClose={() => setIsNewSheetOpen(false)}
				students={students}
			/>
		</>
	);
}
