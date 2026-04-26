'use client';

import { useState } from 'react';

interface Attachment {
	file_url: string;
	file_type: string;
}

interface Submission {
	answer_text?: string;
	attachments?: Attachment[];
}

export function SubmissionDetails({ submission }: { submission: Submission }) {
	const [isOpen, setIsOpen] = useState(false);

	// In a full implementation, this component might trigger an actual Context/Portal based
	// Bottom Sheet. For now, we simulate the expanded details view inline but styled
	// as an actionable surface.
	return (
		<div className="w-full">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full bg-primary/10 text-primary px-4 py-2 rounded-md font-bold text-sm flex justify-center items-center gap-2 active:scale-95 transition-transform"
			>
				<span>{isOpen ? "إخفاء التفاصيل" : "مشاهدة الحل"}</span>
				<span className="material-symbols-outlined text-lg">
					{isOpen ? "expand_less" : "visibility"}
				</span>
			</button>

			{isOpen && (
				<div className="mt-4 p-5 bg-surface-container-low rounded-xl border border-outline-variant/20 shadow-sm relative overflow-hidden">
					<div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>

					<h4 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
						<span className="material-symbols-outlined text-[18px] text-primary">
							description
						</span>
						إجابة الطالب
					</h4>

					<p className="text-on-surface-variant font-body whitespace-pre-wrap text-sm bg-surface-container-lowest p-4 rounded-lg">
						{submission.answer_text || "لا توجد إجابة نصية."}
					</p>

					{submission.attachments && submission.attachments.length > 0 && (
						<div className="mt-5 pt-4 border-t border-outline-variant/30">
							<h4 className="text-xs font-bold text-on-surface-variant mb-3 flex items-center gap-1">
								<span className="material-symbols-outlined text-[16px]">
									attach_file
								</span>
								المرفقات
							</h4>
							<ul className="flex flex-wrap gap-2">
								{submission.attachments.map((att: Attachment, idx: number) => (
									<li key={idx}>
										<a
											href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${att.file_url}`}
											target="_blank"
											rel="noopener noreferrer"
											className="bg-surface-container-highest hover:bg-surface-dim text-on-surface px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"
										>
											<span className="material-symbols-outlined text-[14px]">
												open_in_new
											</span>
											مرفق {idx + 1}
										</a>
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Quick Grading Action Simulation */}
					<div className="mt-6 flex gap-2">
						<button className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg font-bold text-sm shadow-sm hover:shadow active:scale-95 transition-all">
							تقييم الآن
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
