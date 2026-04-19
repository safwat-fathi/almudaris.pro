"use server";

import CONSTANTS from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
		return {
			error: "رقم الموبايل والرمز مطلوبان",
			requiresOtp: false,
			phone: undefined,
		};
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
				if (
					errorData.message ===
					"Too many failed attempts. Try requesting a new OTP."
				) {
					return {
						error: "لقد تجاوزت عدد المحاولات الخاطئة. يرجى طلب رمز جديد.",
						requiresOtp: false,
						phone: undefined,
					};
				} else if (errorData.message === "OTP expired") {
					return {
						error: "انتهت صلاحية الرمز. يرجى طلب رمز جديد.",
						requiresOtp: false,
						phone: undefined,
					};
				}
				return {
					error: "رمز التحقق غير صحيح.",
					requiresOtp: false,
					phone: undefined,
				};
			}
			return {
				error: "فشل التحقق من الرمز.",
				requiresOtp: false,
				phone: undefined,
			};
		}

		const responseData = await res.json();
		const data = responseData.data;

		// Store JWT securely (cookies)
		if (data?.access_token) {
			(await cookies()).set(CONSTANTS.ACCESS_TOKEN, data.access_token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/",
				maxAge: CONSTANTS.AUTH_MAX_AGE,
			});
		}

		if (data?.refresh_token) {
			(await cookies()).set(CONSTANTS.REFRESH_TOKEN, data.refresh_token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/",
				maxAge: CONSTANTS.AUTH_MAX_AGE,
			});
		}

		if (data?.user) {
			(await cookies()).set(CONSTANTS.USER_DATA, JSON.stringify(data.user), {
				httpOnly: false,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/",
				maxAge: CONSTANTS.AUTH_MAX_AGE,
			});
		}

		return {
			success: true,
			role: data?.user?.role,
			requiresOtp: false,
			phone: undefined,
		};
	} catch {
		return {
			error: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
			requiresOtp: false,
			phone: undefined,
		};
	}
}

export async function signupAction(prevState: unknown, formData: FormData) {
	const name = formData.get("name") as string;
	const phone = formData.get("phone") as string;
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const confirmPassword = formData.get("confirmPassword") as string;
	const role = (formData.get("role") as string) || "teacher";

	if (!name || !phone || !password) {
		return {
			error: "الاسم ورقم الموبايل وكلمة المرور مطلوبة",
			requiresOtp: false,
			phone: undefined,
		};
	}

	if (password !== confirmPassword) {
		return {
			error: "كلمتا المرور غير متطابقتين",
			requiresOtp: false,
			phone: undefined,
		};
	}

	try {
		const res = await fetch(`${API_URL}/auth/signup`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, phone, email: email || undefined, password, role }),
		});

		if (!res.ok) {
			const errorData = await res.json().catch(() => ({}));
			if (res.status === 400 && errorData.message === "User already exists") {
				return {
					error: "هذا الرقم مسجل بالفعل. يرجى تسجيل الدخول.",
					requiresOtp: false,
					phone: undefined,
				};
			}
			return {
				error: errorData.message || "فشل إنشاء الحساب. تأكد من صحة البيانات.",
				requiresOtp: false,
				phone: undefined,
			};
		}

		return { requiresOtp: true, phone, error: undefined, success: undefined };
	} catch {
		return {
			error: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
			requiresOtp: false,
			phone: undefined,
		};
	}
}

export async function loginAction(prevState: unknown, formData: FormData) {
	const phone = formData.get("phone") as string;
	const password = formData.get("password") as string;
	const selectedRole = formData.get("role") as string; // "teacher" | "parent"

	if (!phone || !password) {
		return {
			error: "رقم الهاتف وكلمة المرور مطلوبان",
			requiresOtp: false,
			phone: undefined,
		};
	}

	try {
		const res = await fetch(`${API_URL}/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ phone, password }),
		});

		if (!res.ok) {
			if (res.status === 401) {
				return {
					error: "رقم الهاتف أو كلمة المرور غير صحيحة.",
					requiresOtp: false,
					phone: undefined,
				};
			}
			if (res.status === 403) {
				const errorData = await res.json().catch(() => ({}));
				if (errorData.code === "ACCOUNT_NOT_VERIFIED") {
					return { error: undefined, requiresOtp: true, phone };
				}
			}
			return {
				error: "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.",
				requiresOtp: false,
				phone: undefined,
			};
		}

		const responseData = await res.json();
		const data = responseData.data;
		const actualRole: string = data?.user?.role;

		// Validate that the account role matches the selected role on the login UI.
		// Teacher accounts cannot log in as parent/student and vice versa.
		const isParentSelection = selectedRole === "parent";
		const isActuallyParentOrStudent = actualRole === "parent" || actualRole === "student";
		const roleMismatch =
			(isParentSelection && actualRole === "teacher") ||
			(!isParentSelection && isActuallyParentOrStudent);

		if (roleMismatch) {
			return {
				error: isParentSelection
					? "هذا الحساب مسجل كمعلم. يرجى اختيار \"المعلم\" للدخول."
					: "هذا الحساب مسجل كولي أمر. يرجى اختيار \"الطالب / ولي الأمر\" للدخول.",
				requiresOtp: false,
				phone: undefined,
			};
		}

		if (data?.access_token) {
			(await cookies()).set(CONSTANTS.ACCESS_TOKEN, data.access_token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/",
				maxAge: CONSTANTS.AUTH_MAX_AGE,
			});

			if (data.refresh_token) {
				(await cookies()).set(CONSTANTS.REFRESH_TOKEN, data.refresh_token, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "lax",
					path: "/",
					maxAge: CONSTANTS.AUTH_MAX_AGE,
				});
			}

			if (data.user) {
				(await cookies()).set(CONSTANTS.USER_DATA, JSON.stringify(data.user), {
					httpOnly: false,
					secure: process.env.NODE_ENV === "production",
					sameSite: "lax",
					path: "/",
					maxAge: CONSTANTS.AUTH_MAX_AGE,
				});
			}
		}

		return {
			success: true,
			role: data?.user?.role,
			requiresOtp: false,
			phone: undefined,
		};
	} catch {
		return {
			error: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
			requiresOtp: false,
			phone: undefined,
		};
	}
}

export async function logoutAction() {
	try {
		const cookieStore = await cookies();
		const accessToken = cookieStore.get(CONSTANTS.ACCESS_TOKEN)?.value;

		if (accessToken) {
			// Optional: Call backend logout to invalidate token
			await fetch(`${API_URL}/auth/logout`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}).catch(() => {
				// Ignore errors from backend logout
			});
		}

		cookieStore.delete(CONSTANTS.ACCESS_TOKEN);
		cookieStore.delete(CONSTANTS.REFRESH_TOKEN);
		cookieStore.delete(CONSTANTS.USER_DATA);
	} catch {
		// Ignore any errors while clearing cookies
	}

	redirect("/login");
}
