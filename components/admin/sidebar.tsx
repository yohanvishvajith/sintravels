"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Users, Menu } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname() || "";
  const [open, setOpen] = React.useState(true);

  const items = [
    { key: "dashboard", label: "Dashboard", href: "/admin", icon: Home },
    { key: "jobs", label: "Jobs", href: "/admin/jobs", icon: Briefcase },
    {
      key: "applicants",
      label: "Applicants",
      href: "/admin/applicants",
      icon: Users,
    },
  ];

  return (
    <aside
      className={`bg-white border-r transition-all ${open ? "w-64" : "w-16"}`}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center space-x-2">
            <Menu className="h-5 w-5 text-gray-600" />
            {open && <span className="font-bold">Admin</span>}
          </div>
          <button
            aria-label="Toggle sidebar"
            className="p-1 rounded hover:bg-gray-100"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "«" : "»"}
          </button>
        </div>

        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {items.map((it) => {
              const Icon = it.icon;

              // remove optional two-letter locale prefix (e.g. /en/admin/jobs -> /admin/jobs)
              const normalized = (() => {
                const m = pathname.match(/^\/([a-z]{2})(\/.*|$)/i);
                return m ? m[2] || "/" : pathname;
              })();

              let active = false;
              if (it.href === "/admin") {
                // dashboard should only be active on the exact /admin route
                active = normalized === "/admin" || normalized === "/admin/";
              } else {
                active =
                  normalized === it.href ||
                  normalized.startsWith(it.href + "/");
              }

              return (
                <li key={it.key}>
                  <Link
                    href={it.href}
                    className={`flex items-center gap-3 rounded-md p-2 hover:bg-gray-50 transition-colors ${
                      active
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2"
                        : "text-gray-700"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        active ? "text-blue-600" : "text-gray-600"
                      }`}
                    />
                    {open && (
                      <span className="text-sm font-medium">{it.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 border-t">
          {open && <small className="text-xs text-gray-500">SIN Admin</small>}
        </div>
      </div>
    </aside>
  );
}
