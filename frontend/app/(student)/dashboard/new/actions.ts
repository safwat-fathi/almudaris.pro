"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import CONSTANTS from "@/lib/constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function createStudentAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const teacherId = formData.get("teacherId") as string;

  if (!name) {
    return { error: "Name is required." };
  }

  const cookieStore = cookies();
  const token = cookieStore.get(CONSTANTS.ACCESS_TOKEN)?.value;

  if (!token) {
    return { error: "Authentication token not found. Please log in again." };
  }

  try {
    const payload: { name: string; email?: string } = { name };
    if (email) {
      payload.email = email;
    }

    const res = await fetch(`${API_URL}/parents/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      return { error: data.message || "Failed to create student." };
    }
    const { student } = await res.json();

    if (teacherId) {
      const enrollRes = await fetch(`${API_URL}/parents/students/${student.id}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ teacherId: parseInt(teacherId, 10) }),
      });

      if (!enrollRes.ok) {
        const enrollData = await enrollRes.json();
        // Log the enrollment error but don't block the redirect
        console.error("Failed to enroll student:", enrollData.message);
      }
    }

    revalidatePath("/(student)/dashboard");
  } catch (error) {
    console.error(error);
    return { error: "An unexpected error occurred." };
  }

  redirect("/dashboard");
}
