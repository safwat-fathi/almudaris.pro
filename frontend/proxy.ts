import { NextRequest, NextResponse } from "next/server";
import CONSTANTS from "./lib/constants";

const protectedRoutes = {
  teacher: [
    "/students",
    "/sessions",
    "/homework",
    "/payments",
  ],
  parent: [
    "/student-dashboard",
  ]
};

const publicRoutes = [
  "/login",
  "/register",
  "/verify-otp",
  "/landing",
  "/welcome",
];

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
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

  // Check if token is expired or about to expire (within 1 minute)
  if (payload && payload.exp) {
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp <= currentTime + 60) {
      payload = null; // force refresh
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
        const data = await refreshRes.json();
        if (data.access_token) {
          token = data.access_token as string;
          payload = parseJwt(token);
          tokensRefreshed = true;
          newAccessToken = data.access_token;
        }
      }
    } catch {
      // Silently fail
    }
  }

  if (!token || !payload) {
    if (isPublicRoute) {
      return NextResponse.next();
    }
    
    if (path === "/") {
      return NextResponse.redirect(new URL("/landing", request.url));
    }
    
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userRole = payload.role; // "teacher" or "parent"
  let response: NextResponse = NextResponse.next();

  // Redirect authenticated users away from public routes
  if (isPublicRoute) {
    if (userRole === "teacher") {
      response = NextResponse.redirect(new URL("/", request.url));
    } else if (userRole === "parent") {
      response = NextResponse.redirect(new URL("/student-dashboard", request.url));
    }
  } else if (path === "/") {
    // For root path, parent redirects to their dashboard, teacher stays
    if (userRole === "parent") {
      response = NextResponse.redirect(new URL("/student-dashboard", request.url));
    }
  } else {
    // Role-based route protection
    if (userRole === "teacher") {
      const isParentRoute = protectedRoutes.parent.some(r => path.startsWith(r));
      if (isParentRoute) {
        response = NextResponse.redirect(new URL("/students", request.url));
      }
    } else if (userRole === "parent") {
      const isTeacherRoute = protectedRoutes.teacher.some(r => path.startsWith(r));
      if (isTeacherRoute) {
        response = NextResponse.redirect(new URL("/student-dashboard", request.url));
      }
    }
  }

  // If we refreshed tokens, set the new access token in the response cookies
  if (tokensRefreshed && newAccessToken) {
    response.cookies.set(CONSTANTS.ACCESS_TOKEN, newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: CONSTANTS.AUTH_MAX_AGE,
    });
  }

  return response;
}
