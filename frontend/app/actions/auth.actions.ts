"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function requestOtpAction(prevState: unknown, formData: FormData) {
  const phone = formData.get("phone") as string;

  if (!phone) {
    return { error: "رقم الموبايل مطلوب" };
  }

  try {
    const res = await fetch(`${API_URL}/auth/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    if (!res.ok) {
      if (res.status === 429) {
        return { error: "لقد تجاوزت الحد المسموح. يرجى المحاولة لاحقاً." };
      }
      return { error: "فشل في إرسال رمز التحقق. يرجى التأكد من الرقم." };
    }

    return { success: true, phone };
  } catch {
    return { error: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى." };
  }
}

export async function verifyOtpAction(prevState: unknown, formData: FormData) {
  const phone = formData.get("phone") as string;
  const otp = formData.get("otp") as string;

  if (!phone || !otp) {
    return { error: "رقم الموبايل والرمز مطلوبان" };
  }

  try {
    const res = await fetch(`${API_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });

    if (!res.ok) {
      if (res.status === 401) {
         // Attempt limits error from backend
         const errorData = await res.json();
         if (errorData.message === "Too many failed attempts. Try requesting a new OTP.") {
            return { error: "لقد تجاوزت عدد المحاولات الخاطئة. يرجى طلب رمز جديد." };
         } else if (errorData.message === "OTP expired") {
            return { error: "انتهت صلاحية الرمز. يرجى طلب رمز جديد." };
         }
         return { error: "رمز التحقق غير صحيح." };
      }
      return { error: "فشل التحقق من الرمز." };
    }

    const data = await res.json();
    
    // Store JWT securely (cookies)
    if (data.access_token) {
       (await cookies()).set("access_token", data.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
       });
    }

    return { success: true };
  } catch {
    return { error: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى." };
  }
}
