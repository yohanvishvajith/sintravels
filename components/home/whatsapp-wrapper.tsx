"use client";

import WhatsappButton from "@/components/home/whatsapp";
import { usePathname } from "next/navigation";

export default function WhatsappWrapper() {
  const pathname = usePathname();

  // Hide WhatsApp button on admin routes
  if (pathname?.includes("/admin")) {
    return null;
  }

  return <WhatsappButton />;
}
