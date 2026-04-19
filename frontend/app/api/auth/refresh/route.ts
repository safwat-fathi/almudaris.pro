import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import CONSTANTS from "@/lib/constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(CONSTANTS.REFRESH_TOKEN)?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${refreshToken}`
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
    }

    const responseBody = await response.json();
    const data = responseBody.data || responseBody;

    if (data.access_token) {
      cookieStore.set(CONSTANTS.ACCESS_TOKEN, data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: CONSTANTS.AUTH_MAX_AGE,
      });

      if (data.refresh_token) {
        cookieStore.set(CONSTANTS.REFRESH_TOKEN, data.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: CONSTANTS.AUTH_MAX_AGE,
        });
      }

      return NextResponse.json({ success: true, tokenRefreshed: true });
    }

    return NextResponse.json({ error: "Invalid token response" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
