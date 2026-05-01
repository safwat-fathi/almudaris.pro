"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import CONSTANTS from "@/lib/constants";
import { z } from "zod";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const createChildSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  teacherId: z.string().optional(),
  education_stage: z.enum(["PRIMARY", "PREPARATORY", "SECONDARY", "UNASSIGNED"]),
  education_year: z.coerce.number().min(0).max(6),
});

export async function createChildAction(
  prevState: { error: string | null },
  formData: FormData
) {
	const parsed = createChildSchema.safeParse(Object.fromEntries(formData.entries()));

	if (!parsed.success) {
		return { error: parsed.error.issues[0]?.message || "Validation failed." };
	}

	const { name, email, teacherId, education_stage, education_year } = parsed.data;

	const cookieStore = await cookies();
	const token = cookieStore.get(CONSTANTS.ACCESS_TOKEN)?.value;

	if (!token) {
		return { error: "Authentication token not found. Please log in again." };
	}

	try {
		const payload: { name: string; email?: string; education_stage: string; education_year: number } = { 
			name,
			education_stage,
			education_year,
		};
		if (email) {
			payload.email = email;
		}

		const res = await fetch(`${API_URL}/parents/children`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(payload),
		});

		if (!res.ok) {
			const errorBody = await res.json();
			return { error: errorBody.message || "Failed to create child." };
		}
		const responseBody = await res.json();
		const child = responseBody.data?.child || responseBody.child || responseBody;

		if (teacherId && child?.id) {
			const enrollRes = await fetch(
				`${API_URL}/parents/children/${child.id}/enroll`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ teacherId: parseInt(teacherId, 10) }),
				},
			);

			if (!enrollRes.ok) {
				const enrollData = await enrollRes.json();
				// Log the enrollment error but don't block the redirect
				console.error("Failed to enroll child:", enrollData.message);
			}
		}

		revalidatePath("/(student)/dashboard");
	} catch (error) {
		console.error(error);
		return { error: "An unexpected error occurred." };
	}

  redirect("/dashboard");
}
