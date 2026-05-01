import Link from "next/link";
import { formatNumber, normalizeTimeString, formatTimeUI, formatDate } from "@/lib/format";
import { Group } from "@/services/api/groups";

interface SessionCardProps {
	group: Group;
	onEdit?: () => void;
}

export default function SessionCard({ group, onEdit }: SessionCardProps) {
	const isOnline = group.location_type === "Online";
	const locationLabel = isOnline ? "أونلاين" : "حضورياً";

	const color = isOnline ? "primary" : "secondary";
	const isPrimary = color === "primary";

	const now = new Date();
	const startDateTime = new Date(`${group.date}T${normalizeTimeString(group.start_time)}`);
	const endDateTime = new Date(`${group.date}T${normalizeTimeString(group.end_time)}`);

	let derivedState:
		| "Upcoming"
		| "Ongoing"
		| "Finished"
		| "Completed"
		| "Cancelled";

	if (group.status === "Cancelled") {
		derivedState = "Cancelled";
	} else if (group.status === "Completed") {
		derivedState = "Completed";
	} else if (now < startDateTime) {
		derivedState = "Upcoming";
	} else if (now >= startDateTime && now < endDateTime) {
		derivedState = "Ongoing";
	} else {
		derivedState = "Finished";
	}

	const stateConfig = {
		Upcoming: {
			label: "قريباً",
			colorClass: "bg-surface-container-highest text-on-surface-variant",
		},
		Ongoing: { label: "الآن", colorClass: "bg-green-100 text-green-800" },
		Finished: { label: "انتهت", colorClass: "bg-orange-100 text-orange-800" },
		Completed: { label: "مكتملة", colorClass: "bg-blue-100 text-blue-800" },
		Cancelled: { label: "ملغية", colorClass: "bg-red-100 text-red-800" },
	};

	const { label: stateLabel, colorClass: stateColorClass } =
		stateConfig[derivedState];

	return (
		<div
			className={`bg-white p-5 rounded-2xl ${isPrimary ? "shadow-md border-r-4 border-primary" : "shadow-sm border-r-4 border-outline-variant"} flex flex-col gap-4 relative`}
		>
			{onEdit ? (
				<button
					onClick={e => {
						e.preventDefault();
						onEdit();
					}}
					className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container-highest hover:text-primary transition-colors cursor-pointer"
				>
					<span className="material-symbols-outlined text-[18px]">edit</span>
				</button>
			) : (
				<Link
					href={`/sessions/${group.id}/edit`}
					className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container-highest hover:text-primary transition-colors"
				>
					<span className="material-symbols-outlined text-[18px]">edit</span>
				</Link>
			)}

			<div className="flex items-start justify-between">
				<div
					className={`space-y-2 pr-2 min-w-0 flex-1 ${!isPrimary ? "text-on-surface/60" : ""}`}
				>
					<div className="flex flex-col gap-1 overflow-hidden">
						<h3
							className="font-headline font-bold text-lg line-clamp-2"
							title={group.title || "حصة تعليمية"}
						>
							{group.title || "حصة تعليمية"}
						</h3>
						{group.grade_label && (
							<span className="text-sm text-primary font-medium">
								{group.grade_label}
							</span>
						)}
					</div>
					<div
						className={`flex items-center gap-4 text-sm font-medium ${isPrimary ? "text-on-surface-variant" : ""}`}
					>
						<span className="flex items-center gap-1">
							<span className="material-symbols-outlined text-[18px]">
								event
							</span>{" "}
							{formatDate(group.date, { day: "numeric", month: "long" })}
						</span>
						<span className="flex items-center gap-1">
							<span className="material-symbols-outlined text-[18px]">
								schedule
							</span>{" "}
							{formatTimeUI(group.start_time)}
						</span>
						<span className="flex items-center gap-1">
							<span className="material-symbols-outlined text-[18px]">
								group
							</span>{" "}
							{formatNumber(group.students?.length || 0)} طالب
						</span>
					</div>
					<div className="flex items-center gap-2">
						<span
							className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${stateColorClass}`}
						>
							{stateLabel}
						</span>
						<span
							className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${isPrimary ? "bg-primary-fixed text-primary" : "bg-surface-container-high text-on-surface-variant"}`}
						>
							{locationLabel}
						</span>
					</div>
				</div>
			</div>

			{derivedState === "Upcoming" && (
				<button
					disabled
					className="bg-surface-container-high text-on-surface-variant w-full py-3.5 rounded-xl font-bold text-lg cursor-not-allowed"
				>
					قريباً
				</button>
			)}

			{(derivedState === "Ongoing" || derivedState === "Finished") && (
				<Link
					href={`/sessions/${group.id}`}
					className="block text-center bg-primary text-on-primary w-full py-3.5 rounded-xl font-bold text-lg hover:opacity-95 active:scale-95 transition-all"
				>
					تسجيل الحضور
				</Link>
			)}

			{derivedState === "Completed" && (
				<Link
					href={`/sessions/${group.id}`}
					className="block text-center border-2 border-primary text-primary bg-transparent w-full py-3.5 rounded-xl font-bold text-lg hover:bg-primary/5 active:scale-95 transition-all"
				>
					عرض التفاصيل
				</Link>
			)}

			{derivedState === "Cancelled" && (
				<button
					disabled
					className="bg-surface-container-high text-on-surface-variant/50 w-full py-3.5 rounded-xl font-bold text-lg cursor-not-allowed"
				>
					ملغية
				</button>
			)}
		</div>
	);
}
