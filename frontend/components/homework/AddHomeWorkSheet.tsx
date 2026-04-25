"use client";

import { useState } from "react";
import { createHomework } from "../../app/actions/homework.actions";
import { BottomSheet } from "../ui/BottomSheet";
import { Input } from "../ui/Input";

export function AddHomeWorkSheet({ groupId }: { groupId: number }) {
	const [isOpen, setIsOpen] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(formData: FormData) {
		formData.append("group_id", groupId.toString());
		const res = await createHomework(formData);

		if (res?.error) {
			setError(res.error);
		} else if (res?.success) {
			setIsOpen(false);
			setError(null);
		}
	}

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="px-4 py-2 bg-primary text-white rounded-full font-headline font-bold"
			>
				إضافة واجب
			</button>

			<BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<div className="px-6 bg-surface w-full h-full flex flex-col gap-4">
					{/* TopAppBar */}
					<header className="bg-surface/85 backdrop-blur-md sticky top-0 z-10 flex items-center justify-center px-6 py-4 border-b border-outline-variant/10 relative">
						<h1 className="font-headline font-extrabold text-lg text-primary text-center">
							إضافة واجب
						</h1>
						<button
							onClick={() => setIsOpen(false)}
							className="absolute right-6 w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-highest hover:text-primary transition-colors active:scale-95 duration-150"
						>
							<span className="material-symbols-outlined text-2xl">close</span>
						</button>
					</header>

					{error && (
						<div className="mb-4 p-3 bg-error-container text-on-error-container rounded-2xl text-sm">
							{error}
						</div>
					)}

					<form
						action={handleSubmit}
						className="flex flex-col gap-4 font-body flex-1"
					>
						<div>
							<Input
								name="title"
								type="text"
								placeholder="أدخل اسم الواجب"
								// icon="assignment"
							/>
						</div>
						<div>
							<textarea
								name="description"
								placeholder="وصف الواجب"
								rows={3}
								className="w-full pt-2 px-6 bg-surface-container-lowest border-2 border-transparent focus:border-primary rounded-lg text-on-surface placeholder:text-outline/50 focus:ring-0 focus:outline-none transition-all"
							/>
						</div>
						<div>
							<Input
								type="date"
								name="due_date"
								className="w-full px-4 py-3 rounded-2xl bg-surface-container-highest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
							/>
						</div>

						<div className="mt-auto mb-4">
							<button
								type="submit"
								className="w-full py-4 bg-primary text-on-primary rounded-full font-headline font-bold text-lg hover:bg-primary-container transition-colors"
							>
								إضافة واجب
							</button>
						</div>
					</form>
				</div>
			</BottomSheet>
		</>
	);
}
