"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import CONSTANTS from "@/lib/constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function createChildAction(
  prevState: { error: string | null },
  formData: FormData
) {
	const name = formData.get("name") as string;
	const email = formData.get("email") as string;
	const teacherId = formData.get("teacherId") as string;

	if (!name) {
		return { error: "Name is required." };
	}

	const cookieStore = await cookies();
	const token = cookieStore.get(CONSTANTS.ACCESS_TOKEN)?.value;

	if (!token) {
		return { error: "Authentication token not found. Please log in again." };
	}

	try {
		const payload: { name: string; email?: string } = { name };
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
		const child = responseBody.data?.child || responseBody.child;

		if (teacherId && student?.id) {
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
