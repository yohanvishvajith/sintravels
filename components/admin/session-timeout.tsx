"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface SessionTimeoutProps {
  timeoutMinutes?: number; // Default: 30 minutes
  warningMinutes?: number; // Warning before timeout (default: 5 minutes)
}

export default function SessionTimeout({
  timeoutMinutes = 30,
  warningMinutes = 5,
}: SessionTimeoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const [warningShown, setWarningShown] = useState(false);

  const TIMEOUT_MS = timeoutMinutes * 60 * 1000; // Convert minutes to milliseconds
  const WARNING_MS = (timeoutMinutes - warningMinutes) * 60 * 1000;

  const logout = () => {
    // Clear user data
    localStorage.removeItem("user");

    // Dispatch auth changed event
    window.dispatchEvent(new Event("authChanged"));

    // Get locale prefix
    const parts = (pathname || "").split("/").filter(Boolean);
    let localePrefix = "";
    if (parts.length > 0 && ["en", "si"].includes(parts[0])) {
      localePrefix = `/${parts[0]}`;
    }

    // Redirect to login
    router.push(`${localePrefix}/admin/login`);
  };

  const showWarning = () => {
    if (!warningShown) {
      setWarningShown(true);
      toast({
        title: "Session Expiring Soon",
        description: `Your session will expire in ${warningMinutes} minutes due to inactivity. Move your mouse or press a key to stay logged in.`,
        variant: "destructive",
        duration: 10000, // Show for 10 seconds
      });
    }
  };

  const resetTimeout = () => {
    lastActivityRef.current = Date.now();
    setWarningShown(false);

    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }

    // Set warning timeout
    warningRef.current = setTimeout(() => {
      showWarning();
    }, WARNING_MS);

    // Set logout timeout
    timeoutRef.current = setTimeout(() => {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      if (timeSinceLastActivity >= TIMEOUT_MS) {
        logout();
      }
    }, TIMEOUT_MS);
  };

  useEffect(() => {
    // Initialize timeout on mount
    resetTimeout();

    // List of events to track user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    // Throttle the reset function to avoid excessive calls
    let throttleTimer: NodeJS.Timeout | null = null;
    const throttledReset = () => {
      if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
          resetTimeout();
          throttleTimer = null;
        }, 1000); // Throttle to once per second
      }
    };

    // Add event listeners for user activity
    events.forEach((event) => {
      window.addEventListener(event, throttledReset);
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current);
      }
      if (throttleTimer) {
        clearTimeout(throttleTimer);
      }
      events.forEach((event) => {
        window.removeEventListener(event, throttledReset);
      });
    };
  }, [pathname]);

  // Check session validity periodically
  useEffect(() => {
    const checkSession = () => {
      try {
        const raw = localStorage.getItem("user");
        if (!raw) {
          logout();
        }
      } catch (e) {
        logout();
      }
    };

    // Check every minute
    const interval = setInterval(checkSession, 60000);

    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render anything
}
