"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import CONSTANTS from "@/lib/constants";
import { z } from "zod";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const editChildSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Name is required.").optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  education_stage: z.enum(["PRIMARY", "PREPARATORY", "SECONDARY", "UNASSIGNED"]).optional(),
  education_year: z.coerce.number().min(0).max(6).optional(),
});

export async function editChildAction(
  prevState: { error: string | null },
  formData: FormData
) {
	const parsed = editChildSchema.safeParse(Object.fromEntries(formData.entries()));

	if (!parsed.success) {
		return { error: parsed.error.issues[0]?.message || "Validation failed." };
	}

	const { id, name, email, education_stage, education_year } = parsed.data;

	const cookieStore = await cookies();
	const token = cookieStore.get(CONSTANTS.ACCESS_TOKEN)?.value;

	if (!token) {
		return { error: "Authentication token not found. Please log in again." };
	}

	try {
		const payload: Record<string, string | number | null> = {};
		if (name) payload.name = name;
		if (email !== undefined) payload.email = email === "" ? null : email;
		if (education_stage) payload.education_stage = education_stage;
		if (education_year !== undefined) payload.education_year = education_year;

		const res = await fetch(`${API_URL}/parents/children/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(payload),
		});

		if (!res.ok) {
			const errorBody = await res.json();
			return { error: errorBody.message || "Failed to update child." };
		}
		
		revalidatePath("/(student)/dashboard");
	} catch (error) {
		console.error(error);
		return { error: "An unexpected error occurred." };
	}

  redirect("/dashboard");
}
