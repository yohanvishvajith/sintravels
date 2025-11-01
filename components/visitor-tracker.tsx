"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page visit
    const trackVisit = async () => {
      try {
        await fetch("/api/visitors/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: pathname,
            referrer: document.referrer || null,
          }),
        });
      } catch (error) {
        // Silently fail - don't impact user experience
        console.error("Failed to track visit:", error);
      }
    };

    trackVisit();
  }, [pathname]);

  return null; // This component doesn't render anything
}
