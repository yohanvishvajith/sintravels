"use client";

import React from "react";
import AdminSidebar from "@/components/admin/sidebar";
import { usePathname, useRouter } from "next/navigation";
import AdminLogin from "@/components/admin/admin-login";
import { Building2, Users, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProfileBadge from "@/components/auth/profile-badge";

export default function LocaleAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [user, setUser] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const pathname = usePathname();
  const isLoginRoute =
    pathname?.endsWith("/admin/login") || pathname === "/admin/login";

  React.useEffect(() => {
    const handler = (e: any) => setSidebarOpen(Boolean(e?.detail?.open));
    window.addEventListener("sidebarState", handler as EventListener);
    return () =>
      window.removeEventListener("sidebarState", handler as EventListener);
  }, []);

  // Fetch user from JWT token
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user/me");
        const data = await response.json();

        if (data.ok && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("Failed to fetch user:", e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Listen for auth changes
    const h = async () => {
      await fetchUser();
    };
    window.addEventListener("authChanged", h as EventListener);
    return () => window.removeEventListener("authChanged", h as EventListener);
  }, []);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar Skeleton */}
          <div className="w-64 bg-white border-r h-screen fixed">
            <div className="p-4 border-b">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="p-4 space-y-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="ml-64 flex-1">
            {/* Header Skeleton */}
            <div className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Page Content Skeleton */}
            <div className="p-6 space-y-4">
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
              <div className="bg-white rounded-lg shadow p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-100 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoginRoute && <AdminSidebar />}

      {/*
        Apply left margin to the content area equal to the sidebar width.
        When the sidebar is open use ml-64, otherwise ml-16.
      */}
      {/* If not authenticated admin, either render the login page (if on login route) or redirect */}
      {!user || user.role !== "ADMIN" ? (
        isLoginRoute ? (
          // render the nested login page content (children)
          <div className="min-h-screen bg-gray-50">
            <main className="p-6">{children}</main>
          </div>
        ) : (
          <UnauthenticatedRedirect
            pathname={pathname}
            isLoginRoute={isLoginRoute}
          />
        )
      ) : (
        <div className={`${sidebarOpen ? "ml-64" : "ml-16"} transition-margin`}>
          <div className="bg-white shadow-sm border-b z-20 relative">
            <div className="max-w-7xl mx-auto mr-5">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      SIN Travels & Manpower
                    </h1>
                  </div>
                </div>
                <div className="flex items-end space-x-4 ">
                  <ProfileBadge />
                </div>
              </div>
            </div>
          </div>

          <main className="p-6">{children}</main>
        </div>
      )}
    </div>
  );
}

function UnauthenticatedRedirect({
  pathname,
  isLoginRoute,
}: {
  pathname: string | null;
  isLoginRoute: boolean;
}) {
  const router = useRouter();

  React.useEffect(() => {
    if (isLoginRoute) return; // already on login page

    // compute locale prefix (if any) from pathname like /en/admin/...
    const parts = (pathname || "").split("/").filter(Boolean);
    let localePrefix = "";
    if (parts.length > 0 && ["en", "si"].includes(parts[0])) {
      localePrefix = `/${parts[0]}`;
    }

    router.replace(`${localePrefix}/admin/login`);
  }, [pathname, isLoginRoute, router]);

  return null;
}
