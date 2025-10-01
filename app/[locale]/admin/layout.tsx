"use client";

import React from "react";
import AdminSidebar from "@/components/admin/sidebar";
import { Building2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProfileBadge from "@/components/auth/profile-badge";

export default function LocaleAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1">
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Admin Dashboard
                    </h1>
                    <p className="text-sm text-gray-600">
                      SIN Travels & Manpower
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
               
                  <ProfileBadge />
                </div>
              </div>
            </div>
          </div>

          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
