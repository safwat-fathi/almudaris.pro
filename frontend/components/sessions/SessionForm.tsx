"use client";

import { useState, useActionState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Group, LocationType } from "@/services/api/groups";
import { Student } from "@/services/api/teachers";
import {
	EDUCATION_STAGE_LABELS,
	EDUCATION_STAGE_YEARS,
	EDUCATION_YEAR_LABELS,
	type EducationStage,
} from "@/types/grade";
import { formatTimeUI } from "@/lib/format";
import {
	createGroupAction,
	updateGroupAction,
	CreateGroupActionState,
} from "@/app/actions/group.actions";

interface SessionFormProps {
	isEdit?: boolean;
	group?: Group;
	students: Student[];
	isBottomSheet?: boolean;
	onSuccess?: () => void;
}

export default function SessionForm({
	isEdit = false,
	group,
	students,
	isBottomSheet = false,
	onSuccess,
}: SessionFormProps) {
	const actionToUse = group
		? updateGroupAction.bind(null, group.id)
		: createGroupAction;
	const [state, formAction, isPending] = useActionState<
		CreateGroupActionState,
		FormData
	>(actionToUse, {});

	// Form State for UI controls that need immediate feedback
	const [location, setLocation] = useState<LocationType>(
		group?.location_type || "Physical",
	);
	const [isRecurring, setIsRecurring] = useState(false);
	const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>(
		group?.students.map(s => s.student_id) || [],
	);
	const [educationStage, setEducationStage] = useState<EducationStage>(
		group?.education_stage && group.education_stage !== "UNASSIGNED"
			? group.education_stage
			: "PRIMARY",
	);
	const [educationYear, setEducationYear] = useState<number>(
		group?.education_year && group.education_year > 0 ? group.education_year : 1,
	);

	const availableYears = EDUCATION_STAGE_YEARS[educationStage].filter(
		year => year > 0,
	);
	const compatibleStudents = students.filter(
		student =>
			student.education_stage === educationStage &&
			student.education_year === educationYear,
	);
	const compatibleStudentIds = new Set(compatibleStudents.map(student => student.id));
	const assignedStudentsById = new Map(
		(group?.students || []).map(student => [student.student_id, student]),
	);
	const studentsById = new Map(students.map(student => [student.id, student]));
	const incompatibleAssignedStudentIds = isEdit
		? selectedStudentIds.filter(studentId => !compatibleStudentIds.has(studentId))
		: [];
	const selectedCompatibleStudentIds = selectedStudentIds.filter(studentId =>
		compatibleStudentIds.has(studentId),
	);
	const hasIncompatibleAssigned = isEdit && incompatibleAssignedStudentIds.length > 0;
	const submitLockReason = hasIncompatibleAssigned
		? "لا يمكن حفظ التعديلات قبل إزالة الطلاب غير المتوافقين مع المرحلة والصف الحاليين."
		: null;

	const handleEducationStageChange = (
		event: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const nextStage = event.target.value as EducationStage;
		const nextYears = EDUCATION_STAGE_YEARS[nextStage].filter(year => year > 0);
		setEducationStage(nextStage);
		if (!nextYears.includes(educationYear)) {
			setEducationYear(nextYears[0] ?? 1);
		}
	};

	useEffect(() => {
		if (state.success && onSuccess) {
			const timer = setTimeout(() => {
				onSuccess();
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [state.success, onSuccess]);

	return (
		<form action={formAction} className={isBottomSheet ? "pb-24" : "pb-32"}>
			<section className="mt-8 space-y-6">
				{state.error && (
					<div className="bg-red-50 text-red-800 p-4 rounded-lg text-sm text-center">
						{state.error}
					</div>
				)}

				{state.success && (
					<div className="bg-green-50 text-green-800 p-4 rounded-lg text-sm text-center">
						تم الحفظ بنجاح
					</div>
				)}

				{/* Session Name / Title */}
				<div className="space-y-2">
					<label className="text-on-surface font-semibold px-1">
						اسم الحصة (اختياري)
					</label>
					<Input
						name="title"
						type="text"
						defaultValue={group?.title || ""}
						placeholder="مثال: مراجعة الباب الأول"
						icon="edit"
					/>
					{state.fieldErrors?.title && (
						<p className="text-red-500 text-xs px-1">
							{state.fieldErrors.title[0]}
						</p>
					)}
				</div>

				{/* Date Row */}
				<div className="space-y-2">
					<label className="text-on-surface font-semibold px-1">التاريخ</label>
					<Input
						name="date"
						type="date"
						required
						defaultValue={group?.date || new Date().toISOString().split("T")[0]}
						icon="calendar_today"
					/>
					{state.fieldErrors?.date && (
						<p className="text-red-500 text-xs px-1">
							{state.fieldErrors.date[0]}
						</p>
					)}
				</div>

				{/* Time & Duration Row */}
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<label className="text-on-surface font-semibold px-1">
							وقت البدء (UTC)
						</label>
						<Input
							name="start_time"
							type="time"
							required
							defaultValue={group?.start_time ? formatTimeUI(group.start_time) : "17:00"}
							icon="schedule"
						/>
						{state.fieldErrors?.start_time && (
							<p className="text-red-500 text-xs px-1">
								{state.fieldErrors.start_time[0]}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<label className="text-on-surface font-semibold px-1">
							المدة (بالدقائق)
						</label>
						<Input
							name="duration_minutes"
							type="number"
							required
							defaultValue={group?.duration_minutes || 60}
							min={15}
							icon="timer"
						/>
						{state.fieldErrors?.duration_minutes && (
							<p className="text-red-500 text-xs px-1">
								{state.fieldErrors.duration_minutes[0]}
							</p>
						)}
					</div>
				</div>

				{/* Student Selection */}
				<div className="space-y-2">
					<label className="text-on-surface font-semibold px-1">الطلاب</label>
					<select
						name="student_ids"
						multiple
						required
						value={selectedCompatibleStudentIds.map(String)}
						onChange={e => {
							const values = Array.from(e.target.selectedOptions, option =>
								Number(option.value),
							);
							const preservedIncompatible =
								incompatibleAssignedStudentIds.filter(
									studentId => !values.includes(studentId),
								);
							setSelectedStudentIds([
								...values,
								...preservedIncompatible,
							]);
						}}
						className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 h-32 focus:outline-none focus:ring-2 focus:ring-primary/20 custom-scrollbar"
					>
						{compatibleStudents.map(s => (
							<option key={s.id} value={s.id}>
								{s.name}
							</option>
						))}
					</select>
					<p className="text-[10px] text-outline px-1 font-medium">
						يمكنك اختيار أكثر من طالب بالضغط المطول أو السحب
					</p>
					{state.fieldErrors?.student_ids && (
						<p className="text-red-500 text-xs px-1">
							{state.fieldErrors.student_ids[0]}
						</p>
					)}
				</div>

				{hasIncompatibleAssigned ? (
					<div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4">
						<div className="space-y-1">
							<p className="text-sm font-bold text-red-700">
								طلاب غير متوافقين مع المرحلة/الصف الحالي
							</p>
							<p className="text-xs text-red-700/90">
								يجب إزالة الطلاب التاليين قبل حفظ التعديلات.
							</p>
						</div>
						<div className="space-y-2">
							{incompatibleAssignedStudentIds.map(studentId => {
								const studentProfile = studentsById.get(studentId);
								const assignedSnapshot = assignedStudentsById.get(studentId);
								const studentName =
									studentProfile?.name ||
									assignedSnapshot?.student_name ||
									`#${studentId}`;
								const studentGrade = studentProfile?.grade_label;

								return (
									<div
										key={studentId}
										className="flex items-center justify-between rounded-lg border border-red-200 bg-white px-3 py-2"
									>
										<div className="min-w-0">
											<p className="truncate text-sm font-semibold text-red-800">
												{studentName}
											</p>
											{studentGrade ? (
												<p className="text-xs text-red-700/90">{studentGrade}</p>
											) : null}
										</div>
										<button
											type="button"
											onClick={() =>
												setSelectedStudentIds(prev =>
													prev.filter(id => id !== studentId),
												)
											}
											className="rounded-md bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-200"
										>
											إزالة
										</button>
									</div>
								);
							})}
						</div>
					</div>
				) : null}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<label className="text-on-surface font-semibold px-1">
							المرحلة الدراسية
						</label>
						<Select
							name="education_stage"
							value={educationStage}
							onChange={handleEducationStageChange}
						>
							<option value="PRIMARY">
								المرحلة {EDUCATION_STAGE_LABELS.PRIMARY}
							</option>
							<option value="PREPARATORY">
								المرحلة {EDUCATION_STAGE_LABELS.PREPARATORY}
							</option>
							<option value="SECONDARY">
								المرحلة {EDUCATION_STAGE_LABELS.SECONDARY}
							</option>
						</Select>
						{state.fieldErrors?.education_stage && (
							<p className="text-red-500 text-xs px-1">
								{state.fieldErrors.education_stage[0]}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<label className="text-on-surface font-semibold px-1">
							الصف الدراسي
						</label>
						<Select
							name="education_year"
							value={String(educationYear)}
							onChange={event => setEducationYear(Number(event.target.value))}
						>
							{availableYears.map(year => (
								<option key={year} value={year}>
									الصف {EDUCATION_YEAR_LABELS[year]}
								</option>
							))}
						</Select>
						{state.fieldErrors?.education_year && (
							<p className="text-red-500 text-xs px-1">
								{state.fieldErrors.education_year[0]}
							</p>
						)}
					</div>
				</div>

				{/* Location Picker */}
				<div className="space-y-2">
					<label className="text-on-surface font-semibold px-1">المكان</label>
					<input type="hidden" name="location_type" value={location} />
					<div className="grid grid-cols-2 gap-3">
						<button
							type="button"
							onClick={() => setLocation("Physical")}
							className={`h-16 flex items-center justify-center gap-2 rounded-lg font-bold transition-all ${
								location === "Physical"
									? "border-2 border-primary bg-primary/10 text-primary"
									: "bg-surface-container-lowest text-outline font-medium hover:border-2 hover:border-outline-variant"
							}`}
						>
							<span
								className="material-symbols-outlined"
								style={{
									fontVariationSettings:
										location === "Physical" ? "'FILL' 1" : "'FILL' 0",
								}}
							>
								location_on
							</span>
							سنتر
						</button>
						<button
							type="button"
							onClick={() => setLocation("Online")}
							className={`h-16 flex items-center justify-center gap-2 rounded-lg font-bold transition-all ${
								location === "Online"
									? "border-2 border-primary bg-primary/10 text-primary"
									: "bg-surface-container-lowest text-outline font-medium hover:border-2 hover:border-outline-variant"
							}`}
						>
							<span
								className="material-symbols-outlined"
								style={{
									fontVariationSettings:
										location === "Online" ? "'FILL' 1" : "'FILL' 0",
								}}
							>
								language
							</span>
							أونلاين
						</button>
					</div>
				</div>

				{/* Location Specific Input */}
				{location === "Online" ? (
					<div className="space-y-2">
						<label className="text-on-surface font-semibold px-1">
							رابط الحصة (Zoom/Meet)
						</label>
						<Input
							name="location_link"
							type="url"
							placeholder="https://..."
							required
							defaultValue={group?.location_link || ""}
							icon="link"
						/>
						{state.fieldErrors?.location_link && (
							<p className="text-red-500 text-xs px-1">
								{state.fieldErrors.location_link[0]}
							</p>
						)}
					</div>
				) : (
					<div className="space-y-2">
						<label className="text-on-surface font-semibold px-1">
							اسم السنتر / المكان
						</label>
						<Input
							name="location_place"
							type="text"
							placeholder="مثال: سنتر الأمل"
							required
							defaultValue={group?.location_place || ""}
							icon="place"
						/>
						{state.fieldErrors?.location_place && (
							<p className="text-red-500 text-xs px-1">
								{state.fieldErrors.location_place[0]}
							</p>
						)}
					</div>
				)}

				{/* Recurrence Toggles (Simplified) */}
				{!isEdit && (
					<div className="pt-4 space-y-4">
						<input
							type="hidden"
							name="is_recurring"
							value={String(isRecurring)}
						/>
						<input type="hidden" name="recurrence_pattern" value="WEEKLY" />

						<button
							type="button"
							className="w-full flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg hover:bg-surface-container-low transition-colors"
							onClick={() => setIsRecurring(!isRecurring)}
						>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center">
									<span className="material-symbols-outlined text-on-tertiary-container">
										repeat
									</span>
								</div>
								<span className="font-bold font-manrope text-on-surface">
									تكرار الحصة أسبوعيًا
								</span>
							</div>

							<div
								className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isRecurring ? "bg-primary" : "bg-outline-variant"}`}
							>
								<div
									className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${isRecurring ? "left-1" : "left-7"}`}
								/>
							</div>
						</button>

						{isRecurring && (
							<div className="space-y-2 px-1">
								<label className="text-xs font-bold text-outline">
									عدد مرات التكرار
								</label>
								<Input
									name="recurrence_count"
									type="number"
									defaultValue={4}
									min={2}
									max={24}
								/>
							</div>
						)}
					</div>
				)}

				{isEdit && group?.recurring_series_id && (
					<div className="space-y-2">
						<label className="text-on-surface font-semibold px-1">
							نطاق التعديل
						</label>
						<Select name="edit_scope" defaultValue="THIS">
							<option value="THIS">هذه الحصة فقط</option>
							<option value="THIS_AND_FUTURE">هذه والحصص القادمة</option>
							<option value="ALL">جميع حصص السلسلة</option>
						</Select>
					</div>
				)}
				{/* Bottom CTA Wrapper */}
				<div 
					className={isBottomSheet 
						? "sticky bottom-0 -mx-6 px-6 py-4 bg-surface/95 backdrop-blur-md border-t border-outline-variant/10 z-40 mt-8"
						: "fixed bottom-[88px] left-0 right-0 p-6 bg-surface/90 backdrop-blur-lg border-t border-outline-variant/10 z-40"
					}
				>
					<button
						type="submit"
						disabled={isPending || hasIncompatibleAssigned}
						className="w-full h-14 sm:h-16 bg-primary text-on-primary rounded-full font-manrope font-extrabold text-lg sm:text-xl shadow-lg hover:bg-primary-container hover:text-on-primary-container active:scale-95 transition-all duration-150 flex items-center justify-center gap-3 disabled:opacity-50"
					>
						{isPending
							? "جاري الحفظ..."
							: isEdit
								? "حفظ التعديلات"
								: "حفظ الحصة"}
						{!isPending && (
							<span
								className="material-symbols-outlined"
								style={{ fontVariationSettings: "'FILL' 1" }}
							>
								check_circle
							</span>
						)}
					</button>
					{submitLockReason ? (
						<p className="mt-2 text-center text-xs font-semibold text-red-700">
							{submitLockReason}
						</p>
					) : null}
				</div>
			</section>
		</form>
	);
}
