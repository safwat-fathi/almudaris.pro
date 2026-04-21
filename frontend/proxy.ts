import { NextRequest, NextResponse } from "next/server";
import CONSTANTS from "./lib/constants";

/**
 * Routes only accessible by teachers (role = "teacher")
 * Parents/students visiting these will be redirected to /dashboard
 */
const teacherOnlyPrefixes = [
  "/students",   // teacher student management
  "/sessions",
  "/homework",
  "/chat",
  "/profile",
  "/welcome",
];

/**
 * Routes only accessible by parents/students (role = "parent" | "student")
 * Teachers visiting these will be redirected to /
 */
const studentParentOnlyPrefixes = [
  "/dashboard",  // parent/student home
];

const publicRoutes = [
  "/login",
  "/register",
  "/verify-otp",
  "/landing",
  "/invite",              // parent invitation landing pages
];

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  let token = request.cookies.get(CONSTANTS.ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(CONSTANTS.REFRESH_TOKEN)?.value;
  const path = request.nextUrl.pathname;

  const isPublicRoute = publicRoutes.some(r => path.startsWith(r));

  let payload = token ? parseJwt(token) : null;
  let tokensRefreshed = false;
  let newAccessToken = "";
  let newRefreshToken = "";

  // Check if token is expired or about to expire (within 1 minute)
  if (payload && payload.exp) {
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp <= currentTime + 60) {
      payload = null;
      token = undefined;
    }
  }

  // Attempt refresh if we have a refresh token but no valid access token
  if (!payload && refreshToken) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    try {
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${refreshToken}`
        }
      });

      if (refreshRes.ok) {
        const resBody = await refreshRes.json();
        const data = resBody.data || resBody;
        if (data.access_token) {
          token = data.access_token as string;
          payload = parseJwt(token);
          tokensRefreshed = true;
          newAccessToken = data.access_token;
          if (data.refresh_token) {
            newRefreshToken = data.refresh_token;
          }
        }
      }
    } catch {
      // Silently fail
    }
  }

  // Unauthenticated users
  if (!token || !payload) {
    if (isPublicRoute) {
      return NextResponse.next();
    }
    if (path === "/") {
      return NextResponse.redirect(new URL("/landing", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userRole: string = payload.role; // "teacher" | "parent" | "student"
  let response: NextResponse = NextResponse.next();

  // Redirect authenticated users away from public routes to their home
  if (isPublicRoute && !path.startsWith("/invite")) {
    if (userRole === "teacher") {
      response = NextResponse.redirect(new URL("/", request.url));
    } else {
      // parent or student → their dashboard
      response = NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else if (path === "/") {
    // Root path is teacher home. Non-teachers go to their dashboard.
    if (userRole !== "teacher") {
      response = NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    // Role-based protection
    if (userRole === "teacher") {
      const isStudentParentOnly = studentParentOnlyPrefixes.some(r => path.startsWith(r));
      if (isStudentParentOnly) {
        response = NextResponse.redirect(new URL("/", request.url));
      }
    } else {
      // parent or student role
      const isTeacherOnly = teacherOnlyPrefixes.some(r => path.startsWith(r));
      if (isTeacherOnly) {
        response = NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  // Propagate refreshed tokens
  if (tokensRefreshed && newAccessToken) {
    response.cookies.set(CONSTANTS.ACCESS_TOKEN, newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: CONSTANTS.AUTH_MAX_AGE,
    });

    if (newRefreshToken) {
      response.cookies.set(CONSTANTS.REFRESH_TOKEN, newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: CONSTANTS.AUTH_MAX_AGE,
      });
    }
  }

  return response;
}
