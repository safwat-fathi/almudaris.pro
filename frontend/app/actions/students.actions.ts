"use server";

import { revalidatePath } from "next/cache";
import { teachersService } from "@/services/api/teachers";

export type DeleteStudentActionResult = {
	success?: boolean;
	error?: string;
	message?: string;
};

export async function deleteStudentAction(
	studentId: number,
): Promise<DeleteStudentActionResult> {
	try {
		const response = await teachersService.removeStudent(studentId);
		revalidatePath("/students");

		return {
			success: true,
			message: response.message || "تم حذف الطالب بنجاح.",
		};
	} catch (error: unknown) {
		const err = error as Error & { status?: number };
		if (err.status === 404) {
			return { error: "الطالب غير مسجل لديك أو تم حذفه بالفعل." };
		}
		if (err.status === 401) {
			return { error: "انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى." };
		}
		return { error: err.message || "حدث خطأ أثناء حذف الطالب." };
	}
}
