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
  const pathname = usePathname();
  const isLoginRoute =
    pathname?.endsWith("/admin/login") || pathname === "/admin/login";

  React.useEffect(() => {
    const handler = (e: any) => setSidebarOpen(Boolean(e?.detail?.open));
    window.addEventListener("sidebarState", handler as EventListener);
    return () =>
      window.removeEventListener("sidebarState", handler as EventListener);
  }, []);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      setUser(raw ? JSON.parse(raw) : null);
    } catch (e) {
      setUser(null);
    }

    const h = () => {
      try {
        const raw = localStorage.getItem("user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch (e) {
        setUser(null);
      }
    };
    window.addEventListener("authChanged", h as EventListener);
    return () => window.removeEventListener("authChanged", h as EventListener);
  }, []);

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
                  <button
                    aria-label="Toggle sidebar"
                    className="p-2 ml-2 rounded hover:bg-gray-100"
                    onClick={() =>
                      window.dispatchEvent(new Event("toggleSidebar"))
                    }
                  >
                    <Menu className="h-5 w-5 text-gray-600" />
                  </button>{" "}
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Admin Dashboard
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
