"use client";

import React from "react";
import AdminLogin from "@/components/admin/admin-login";

export default function AdminLoginPage() {
  return (
    <AdminLogin
      onSuccess={() => {
        /* handled in layout via authChanged */
      }}
    />
  );
}
