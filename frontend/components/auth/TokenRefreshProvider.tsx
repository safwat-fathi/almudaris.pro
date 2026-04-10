"use client";

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

    // The access token expires in 15 minutes. Refresh it every 10 minutes to be safe.
    const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

    const intervalId = setInterval(async () => {
      try {
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
        });

        if (!response.ok) {
          console.warn("Failed to auto-refresh token", await response.text());
        }
      } catch (error) {
        console.error("Error during auto-refresh", error);
      }
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  return <>{children}</>;
}
