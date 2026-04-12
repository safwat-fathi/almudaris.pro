"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createStudentAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const teacherId = formData.get("teacherId") as string;
  
  if (!name) {
    return { error: "Name is required." };
  }

  // Real implementation: Fetch from cookies/session
  const token = "dummy-parent-token";

  try {
    /* 
    const res = await fetch(`http://localhost:3000/api/parents/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, email }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { error: data.message || "Failed to create student." };
    }
    const { student } = await res.json();

    if (teacherId) {
       await fetch(`http://localhost:3000/api/parents/students/${student.id}/enroll`, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`
         },
         body: JSON.stringify({ teacherId: parseInt(teacherId, 10) })
       });
    }
    */

    revalidatePath("/(student)/dashboard");
  } catch (error) {
    return { error: "An unexpected error occurred." };
  }
  
  redirect("/dashboard");
}
