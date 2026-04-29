"use client";

import Link from "next/link";
import { Student } from "@/services/api/teachers";

interface StudentsTableProps {
	students: Student[];
}

export default function StudentsTable({ students }: StudentsTableProps) {
	if (students.length === 0) {
		return (
			<div className="mt-20 flex flex-col items-center text-center max-w-sm mx-auto">
				<div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
					<span
						className="material-symbols-outlined text-4xl text-outline"
						data-icon="group_off"
					>
						group_off
					</span>
				</div>
				<h3 className="text-2xl font-bold text-on-surface mb-2 font-headline">
					لسه مفيش طلاب
				</h3>
				<p className="text-on-surface-variant mb-8 font-body">
					ابدأ في بناء مجتمعك التعليمي من خلال دعوة أول طالب لك الآن.
				</p>
				{/* <Link
					href="/students/invite"
					className="flex items-center justify-center bg-primary text-on-primary h-14 px-10 rounded-lg font-bold shadow-[0_8px_24px_rgba(26,115,232,0.25)] hover:-translate-y-0.5 active:scale-95 transition-all"
				>
					ابدأ بدعوة الطلاب
				</Link> */}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div className="md:col-span-3 overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-outline-variant/20 transition-all">
				<div className="p-6 overflow-x-auto custom-scrollbar">
					<table className="w-full text-right border-collapse min-w-[500px]">
						<thead>
							<tr className="border-b border-surface-container-high">
								<th className="pb-4 font-bold text-on-surface-variant px-4 font-headline">
									👤 الاسم
								</th>
								<th className="pb-4 font-bold text-on-surface-variant px-4 font-headline">
									🎓 المرحلة
								</th>
								<th className="pb-4 font-bold text-on-surface-variant px-4 text-center font-headline">
									📊 الحالة
								</th>
								<th className="pb-4 font-bold text-on-surface-variant px-4 w-32"></th>
							</tr>
						</thead>
						<tbody className="divide-y divide-surface-container-high">
							{students.map(student => {
								// Mocking data not yet in the Student interface
								// const phone = `+20 100 ${String((student.id * 12345) % 900000 + 100000)}`;
								const isActive = true;

								return (
									<tr
										key={student.id}
										className="group hover:bg-surface-container-low transition-colors"
									>
										<td className="py-5 px-4">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-extrabold text-sm shrink-0">
													{student.name.charAt(0)}
												</div>
												<span className="font-semibold text-on-surface font-headline">
													{student.name}
												</span>
											</div>
										</td>
										<td className="py-5 px-4 font-body tracking-wider text-on-surface-variant text-right">
											{student.grade_label || "غير محدد"}
										</td>
										<td className="py-5 px-4 text-center">
											<span
												className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide ${isActive ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-high text-on-surface-variant"}`}
											>
												{isActive ? "نشط" : "لم ينضم بعد"}
											</span>
										</td>
										<td className="py-5 px-4">
											<div className="flex items-center justify-end gap-2">
												<Link
													href={`/students/${student.id}`}
													title="تفاصيل الطالب"
													className="p-2 hover:bg-surface-container-highest rounded-full transition-colors text-outline active:scale-95 flex items-center justify-center"
												>
													<span
														className="material-symbols-outlined text-[20px]"
														data-icon="visibility"
													>
														visibility
													</span>
												</Link>
												<button
													title="إعادة إرسال دعوة"
													className="p-2 hover:bg-surface-container-highest rounded-full transition-colors text-outline active:scale-95 flex items-center justify-center"
												>
													<span
														className="material-symbols-outlined text-[20px]"
														data-icon="contact_mail"
													>
														contact_mail
													</span>
												</button>
												<button
													title="حذف الطالب"
													className="p-2 hover:bg-error-container/50 hover:text-error rounded-full transition-colors text-outline active:scale-95 flex items-center justify-center"
												>
													<span
														className="material-symbols-outlined text-[20px]"
														data-icon="delete"
													>
														delete
													</span>
												</button>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
