"use server";

import { createGroupSchema } from "@/schemas/create-group.schema";
import { groupsService, CreateGroupData, LocationType } from "@/services/api/groups";
import { revalidatePath } from "next/cache";

export type CreateGroupActionState = {
	success?: boolean;
	error?: string;
	fieldErrors?: Record<string, string[]>;
	warnings?: string[];
	data?: unknown;
};

export async function createGroupAction(
	prevState: CreateGroupActionState | undefined,
	formData: FormData,
): Promise<CreateGroupActionState> {
	const studentIds = formData.getAll("student_ids").map(id => Number(id));

	const rawData = {
		date: formData.get("date"),
		start_time: formData.get("start_time"),
		duration_minutes: formData.get("duration_minutes"),
		student_ids: studentIds,
		location_type: formData.get("location_type"),
		location_link: formData.get("location_link") || undefined,
		location_place: formData.get("location_place") || undefined,
		title: formData.get("title") || undefined,
		education_stage: formData.get("education_stage"),
		education_year: formData.get("education_year"),
		is_recurring: formData.get("is_recurring") === "true",
		recurrence_pattern: formData.get("recurrence_pattern") || undefined,
		recurrence_count: formData.get("recurrence_count") || undefined,
		csrf_token: formData.get("csrf_token") || undefined,
	};

	const parsed = createGroupSchema.safeParse(rawData);

	if (!parsed.success) {
		return {
			error: "تأكد من إدخال البيانات بشكل صحيح",
			fieldErrors: parsed.error.flatten().fieldErrors,
		};
	}

	try {
		// Exclude csrf_token when sending to the API
		const { csrf_token, ...apiData } = parsed.data;
		void csrf_token;

		// Convert location_type back to the exact type
		const requestData: CreateGroupData = {
			...apiData,
			location_type: apiData.location_type as LocationType,
		};

		const response = await groupsService.createGroup(requestData);

		revalidatePath("/sessions");
		revalidatePath("/sessions/[id]");

		return {
			success: true,
			data: response.data.groups,
			warnings: response.data.warnings,
		};
	} catch (error: unknown) {
		const err = error as Error;
		return {
			error: err.message || "حدث خطأ أثناء إنشاء المجموعة",
		};
	}
}

export async function updateGroupAction(
	groupId: number,
	prevState: CreateGroupActionState | undefined,
	formData: FormData,
): Promise<CreateGroupActionState> {
	const studentIds = formData.getAll("student_ids").map(id => Number(id));

	const rawData = {
		date: formData.get("date"),
		start_time: formData.get("start_time"),
		duration_minutes: formData.get("duration_minutes"),
		student_ids: studentIds,
		location_type: formData.get("location_type"),
		location_link: formData.get("location_link") || undefined,
		location_place: formData.get("location_place") || undefined,
		title: formData.get("title") || undefined,
		education_stage: formData.get("education_stage"),
		education_year: formData.get("education_year"),
		edit_scope: formData.get("edit_scope") || "THIS",
		csrf_token: formData.get("csrf_token") || undefined,
	};

	const parsed = createGroupSchema.safeParse(rawData);

	if (!parsed.success) {
		return {
			error: "تأكد من إدخال البيانات بشكل صحيح",
			fieldErrors: parsed.error.flatten().fieldErrors,
		};
	}

	try {
		const {
			csrf_token,
			is_recurring,
			recurrence_pattern,
			recurrence_count,
			...apiData
		} = parsed.data as Record<string, unknown>;
		void csrf_token;
		void is_recurring;
		void recurrence_pattern;
		void recurrence_count;

		const requestData = {
			...apiData,
			location_type: apiData.location_type as LocationType,
			edit_scope: rawData.edit_scope as "THIS" | "THIS_AND_FUTURE" | "ALL",
		};

		const response = await groupsService.updateGroup(groupId, requestData);

		revalidatePath("/sessions");
		revalidatePath(`/sessions/${groupId}`);

		return {
			success: true,
			data: response.data.group,
			warnings: response.data.warnings,
		};
	} catch (error: unknown) {
		const err = error as Error;
		return {
			error: err.message || "حدث خطأ أثناء تحديث المجموعة",
		};
	}
}

export type UpdateAttendanceActionState = {
	success?: boolean;
	error?: string;
	fieldErrors?: Record<string, string[]>;
};

export async function updateAttendanceAction(
	groupId: number,
	prevState: UpdateAttendanceActionState | undefined,
	formData: FormData,
): Promise<UpdateAttendanceActionState> {
	const studentsData: {
		id: number;
		attendance_status: "Present" | "Absent" | "Not set";
		note?: string;
	}[] = [];
	const notes = (formData.get("notes") as string) || undefined;

	// Parse student attendance data from formData
	// Example keys: student_1_status, student_1_note
	for (const [key, value] of Array.from(formData.entries())) {
		const match = key.match(/^student_(\d+)_status$/);
		if (match) {
			const studentId = parseInt(match[1], 10);
			const noteKey = `student_${studentId}_note`;
			studentsData.push({
				id: studentId,
				attendance_status: value as "Present" | "Absent" | "Not set",
				note: (formData.get(noteKey) as string) || undefined,
			});
		}
	}

	try {
		await groupsService.updateAttendance(groupId, {
			notes,
			students: studentsData,
		});
		revalidatePath("/sessions");
		revalidatePath(`/sessions/${groupId}`);
		return { success: true };
	} catch (error: unknown) {
		const err = error as Error;
		return { error: err.message || "حدث خطأ أثناء تحديث الحضور" };
	}
}

export async function markCompleteAction(
	groupId: number,
): Promise<UpdateAttendanceActionState> {
	try {
		await groupsService.updateStatus(groupId, { status: "Completed" });
		revalidatePath("/sessions");
		revalidatePath(`/sessions/${groupId}`);
		return { success: true };
	} catch (error: unknown) {
		const err = error as Error;
		return { error: err.message || "حدث خطأ أثناء حفظ الحالة" };
	}
}

export async function cancelGroupAction(
	groupId: number,
): Promise<UpdateAttendanceActionState> {
	try {
		await groupsService.cancelGroup(groupId);
		revalidatePath("/sessions");
		revalidatePath(`/sessions/${groupId}`);
		return { success: true };
	} catch (error: unknown) {
		const err = error as Error;
		return { error: err.message || "حدث خطأ أثناء الإلغاء" };
	}
}
