"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Footer } from "./footer";

export default function MaybeFooter() {
  const pathname = usePathname() || "";
  const parts = pathname.split("/").filter(Boolean);
  const isAdmin = parts[0] === "admin" || parts[1] === "admin";
  if (isAdmin) return null;
  return <Footer />;
}
