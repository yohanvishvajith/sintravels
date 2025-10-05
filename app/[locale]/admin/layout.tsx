"use client";

import React from "react";
import AdminSidebar from "@/components/admin/sidebar";
import { Building2, Users, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProfileBadge from "@/components/auth/profile-badge";

export default function LocaleAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  React.useEffect(() => {
    const handler = (e: any) => setSidebarOpen(Boolean(e?.detail?.open));
    window.addEventListener("sidebarState", handler as EventListener);
    return () =>
      window.removeEventListener("sidebarState", handler as EventListener);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      {/*
        Apply left margin to the content area equal to the sidebar width.
        When the sidebar is open use ml-64, otherwise ml-16.
      */}
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
    </div>
  );
}
