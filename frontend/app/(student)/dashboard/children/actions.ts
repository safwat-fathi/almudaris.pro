"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import CONSTANTS from "@/lib/constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface EnrollResult {
  success: boolean;
  message: string;
}

export async function enrollChildAction(
  childId: number,
  teacherId: number
): Promise<EnrollResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CONSTANTS.ACCESS_TOKEN)?.value;

  if (!token) {
    return { success: false, message: "يجب تسجيل الدخول أولاً." };
  }

  try {
    const res = await fetch(
      `${API_URL}/parents/children/${childId}/enroll`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ teacherId }),
      }
    );

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      const message: string =
        errorBody.message ||
        (res.status === 409
          ? "الطالب مسجل بالفعل مع هذا المعلم."
          : res.status === 401
          ? "غير مصرح — تأكد من ارتباطك بهذا المعلم."
          : res.status === 404
          ? "الطالب أو المعلم غير موجود."
          : "حدث خطأ أثناء التسجيل.");
      return { success: false, message };
    }

    revalidatePath("/dashboard/children");
    return { success: true, message: "تم تسجيل الطالب مع المعلم بنجاح! 🎉" };
  } catch {
    return { success: false, message: "حدث خطأ غير متوقع. حاول مرة أخرى." };
  }
}
