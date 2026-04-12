"use server";

import CONSTANTS from "@/lib/constants";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function acceptInvitation(inviteCode: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(CONSTANTS.ACCESS_TOKEN)?.value;

  if (!token) {
    return { error: "Authentication required to accept invitation." };
  }

  try {
    const res = await fetch(`${API_URL}/parents/link-teacher`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ inviteCode }),
    });
    
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data.message || "فشل في قبول الدعوة. يرجى المحاولة مرة أخرى." };
    }

    revalidatePath("/dashboard"); 
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى." };
  }
}
