"use client";

import CONSTANTS from "@/lib/constants";
import { useEffect } from "react";

export default function TokenRefreshProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Check if user is authenticated by looking for the non-httpOnly USER_DATA cookie
    const hasUserData = document.cookie.includes("user_data");

    if (!hasUserData) {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
        });

        if (!response.ok) {
          console.warn("Failed to auto-refresh token", await response.text());
          if (response.status === 401) {
            clearInterval(intervalId);
            window.location.href = "/login";
          }
        }
      } catch (error) {
        console.error("Error during auto-refresh", error);
      }
    }, CONSTANTS.REFRESH_INTERVAL_MS || 10 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return <>{children}</>;
}
