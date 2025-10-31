"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Briefcase,
  Users,
  Menu,
  Gift,
  ChevronDown,
  Hourglass,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
export default function AdminSidebar() {
  const pathname = usePathname() || "";
  const [open, setOpen] = React.useState(true);

  // listen for a global toggle event (header button will dispatch this)
  React.useEffect(() => {
    const handler = () => setOpen((v) => !v);
    window.addEventListener("toggleSidebar", handler);
    return () => window.removeEventListener("toggleSidebar", handler);
  }, []);

  // notify layout about current open state so header can react
  React.useEffect(() => {
    try {
      window.dispatchEvent(
        new CustomEvent("sidebarState", { detail: { open } })
      );
    } catch (e) {
      // ignore in non-browser environments
    }
  }, [open]);

  // normalized pathname without locale prefix (e.g. /en/admin/jobs -> /admin/jobs)
  const normalizedPath = (() => {
    const m = pathname.match(/^\/([a-z]{2})(\/.*|$)/i);
    return m ? m[2] || "/" : pathname;
  })();

  const [settingsOpen, setSettingsOpen] = React.useState(
    normalizedPath.startsWith("/admin/settings")
  );

  const items = [
    { key: "dashboard", label: "Dashboard", href: "/admin", icon: Home },
    { key: "jobs", label: "Jobs", href: "/admin/jobs", icon: Briefcase },
    {
      key: "expired-jobs",
      label: "Expired Jobs",
      href: "/admin/jobs/expired",
      icon: Hourglass,
    },
    {
      key: "settings",
      label: "Settings",
      href: "/admin/settings",
      icon: Users,
    },
    {
      key: "settings-manage-benefits",
      label: "Manage Benefits",
      href: "/admin/settings/manage-benefits",
      icon: Gift,
    },
    {
      key: "settings-manage-countries",
      label: "Manage Countries",
      href: "/admin/settings/manage-countries",
      icon: Menu,
    },
    {
      key: "settings-manage-industries",
      label: "Manage Industries",
      href: "/admin/settings/manage-industries",
      icon: Menu,
    },
    {
      key: "settings-manage-users",
      label: "Add Users",
      href: "/admin/settings/manage-users",
      icon: UserPlus,
    },
  ];

  // compute specificity score for each item so we can prefer the most specific
  // match (e.g. /admin/jobs/expired should activate expired-jobs, not jobs)
  const scores = items.map((it) => {
    try {
      if (normalizedPath === it.href) return 100000 + it.href.length;
      if (
        it.href === "/admin" &&
        (normalizedPath === "/admin" || normalizedPath === "/admin/")
      )
        return 100000 + it.href.length;
      if (normalizedPath.startsWith(it.href + "/")) return it.href.length;
    } catch (e) {
      // defensive
    }
    return 0;
  });
  const bestScore = Math.max(...scores, 0);

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r transition-all ${
        open ? "w-64" : "w-16"
      }`}
      aria-hidden={!open}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle sidebar"
              className="p-2 rounded hover:bg-gray-100"
              onClick={() => setOpen((v) => !v)}
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            <Link
              href="/admin"
              aria-label="SIN Travels home"
              className="flex items-center"
            >
              <Image
                src="/images/img_logo.jpeg"
                alt="SIN Travels logo"
                width={32}
                height={32}
                className="h-8 w-8 flex-shrink-0 rounded object-cover"
              />
            </Link>
            {open && <span className="font-medium">Admin Portal</span>}
          </div>
        </div>

        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {items
              // top-level items: those that are not settings subpages
              .filter(
                (it) =>
                  !it.href.startsWith("/admin/settings/") ||
                  it.href === "/admin/settings"
              )
              .map((it) => {
                const Icon = it.icon;

                // active calculation based on normalizedPath
                // prefer the most specific match using precomputed scores
                let active = false;
                const idx = items.findIndex((x) => x.key === it.key);
                const myScore = scores[idx] || 0;
                active = myScore > 0 && myScore === bestScore;

                // render Settings parent specially to allow collapsing
                if (it.href === "/admin/settings") {
                  const subItems = items.filter(
                    (s) =>
                      s.href.startsWith("/admin/settings/") &&
                      s.href !== "/admin/settings"
                  );

                  return (
                    <li key={it.key}>
                      <div
                        className={`flex items-center justify-between rounded-md p-2 hover:bg-gray-50 transition-colors text-gray-700`}
                      >
                        {/* clicking the header toggles the submenu; it is not a navigation link */}
                        <button
                          aria-expanded={settingsOpen}
                          aria-label="Toggle settings submenu"
                          onClick={() => setSettingsOpen((v) => !v)}
                          className="flex items-center gap-3 w-full text-left"
                        >
                          <Icon className={`h-5 w-5 text-gray-600`} />
                          {open && (
                            <span className="text-sm font-medium">
                              {it.label}
                            </span>
                          )}
                        </button>

                        {open && (
                          <button
                            aria-label="Toggle settings submenu"
                            onClick={() => setSettingsOpen((v) => !v)}
                            className="p-1 rounded hover:bg-gray-100"
                          >
                            <ChevronDown
                              className={`h-4 w-4 text-gray-600 transition-transform ${
                                settingsOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* subitems: include parent as first clickable link so only subitems get active styling when clicked */}
                      {settingsOpen && (
                        <ul className="mt-1 space-y-1">
                          {subItems.map((sit) => {
                            const SIcon = sit.icon;
                            const isActive =
                              normalizedPath === sit.href ||
                              normalizedPath.startsWith(sit.href + "/");

                            return (
                              <li key={sit.key}>
                                <Link
                                  href={sit.href}
                                  className={`flex items-center gap-3 rounded-md p-2 hover:bg-gray-50 transition-colors ${
                                    isActive
                                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2"
                                      : "text-gray-700"
                                  } pl-8 text-sm`}
                                >
                                  <SIcon
                                    className={`h-4 w-4 ${
                                      isActive
                                        ? "text-blue-600"
                                        : "text-gray-600"
                                    }`}
                                  />
                                  {open && (
                                    <span className="text-sm font-medium">
                                      {sit.label}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                }

                // default rendering for non-settings items
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
