"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ProfileBadge() {
  const [user, setUser] = useState<any | null>(null);
  const [openSettings, setOpenSettings] = useState(false);
  // permanently show name first and avatar second

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem("user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch (e) {
        setUser(null);
      }
    };
    load();
    const h = () => load();
    window.addEventListener("authChanged", h);
    return () => window.removeEventListener("authChanged", h);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new CustomEvent("authChanged"));
    toast.success("Logged out");
  };

  if (!user) return null;

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center space-x-2">
            {/* permanently show name first, avatar second */}
            <span className="hidden md:inline text-sm font-medium">
              {user.username || user.email}
            </span>
            {user.profilePhoto ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <img
                src={user.profilePhoto}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                {(user.username || user.email || "U")[0].toUpperCase()}
              </div>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => {
              setOpenSettings(true);
            }}
          >
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              logout();
            }}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openSettings} onOpenChange={setOpenSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account settings</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget as HTMLFormElement);
              fd.append("id", user.id);
              try {
                const res = await fetch("/api/user", {
                  method: "PATCH",
                  body: fd,
                });
                const data = await res.json();
                if (data?.ok) {
                  localStorage.setItem("user", JSON.stringify(data.user));
                  window.dispatchEvent(new CustomEvent("authChanged"));
                  toast.success("Profile updated");
                  setOpenSettings(false);
                } else {
                  toast.error?.(data?.error || "Update failed");
                }
              } catch (err) {
                console.error(err);
                toast.error?.("Update error");
              }
            }}
          >
            <div>
              <input
                name="username"
                defaultValue={user.username}
                placeholder="Username"
                className="w-full border rounded px-2 py-1"
                required
              />
            </div>
            <div>
              <input
                name="phone"
                defaultValue={user.phone}
                placeholder="Phone"
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <input
                name="address"
                defaultValue={user.address}
                placeholder="Address"
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="text-sm">Profile photo</label>
              <input
                name="profilePhoto"
                type="file"
                accept="image/*"
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
              <Button variant="ghost" onClick={() => logout()}>
                Logout
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
