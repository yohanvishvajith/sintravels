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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

  // When settings modal opens, initialize preview to current profile photo
  useEffect(() => {
    if (openSettings) {
      try {
        const raw = localStorage.getItem("user");
        const u = raw ? JSON.parse(raw) : null;
        setPreviewUrl(u?.profilePhoto || null);
      } catch (e) {
        setPreviewUrl(null);
      }
    } else {
      // revoke any object URL when closing (if we created one)
      if (previewUrl && previewUrl.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(previewUrl);
        } catch (e) {}
      }
      setPreviewUrl(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSettings]);

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
              <Image
                src={user.profilePhoto}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
                alt="profile photo"
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
          {/* Change password removed from dropdown menu - use settings dialog instead */}
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
              const formEl = e.currentTarget as HTMLFormElement;
              const fd = new FormData(formEl);

              // If password change fields are present, attempt password change first
              const currentPassword =
                (fd.get("currentPassword") as string) || "";
              const newPassword = (fd.get("newPassword") as string) || "";
              const retypeNewPassword =
                (fd.get("retypeNewPassword") as string) || "";

              try {
                if (currentPassword || newPassword || retypeNewPassword) {
                  // Basic validation
                  if (!currentPassword || !newPassword || !retypeNewPassword) {
                    toast.error?.(
                      "Please fill all password fields to change password"
                    );
                    return;
                  }
                  if (newPassword !== retypeNewPassword) {
                    toast.error?.("New passwords do not match");
                    return;
                  }

                  const pwdFd = new FormData();
                  pwdFd.append("id", user.id);
                  pwdFd.append("currentPassword", currentPassword);
                  pwdFd.append("newPassword", newPassword);
                  pwdFd.append("retypeNewPassword", retypeNewPassword);

                  const pwdRes = await fetch("/api/user/change-password", {
                    method: "PATCH",
                    body: pwdFd,
                  });
                  const pwdJson = await pwdRes.json().catch(() => null);
                  if (!pwdRes.ok || !(pwdJson && pwdJson.ok)) {
                    toast.error?.(
                      pwdJson?.error ||
                        `Change password failed: ${pwdRes.status}`
                    );
                    return;
                  }
                  toast.success("Password changed");
                }

                // Build profile update payload (exclude password fields)
                const profileFd = new FormData();
                profileFd.append("id", user.id);
                const username = fd.get("username") as string;
                const address = fd.get("address") as string;
                const profilePhoto = fd.get("profilePhoto") as File | null;
                if (username) profileFd.append("username", username);
                if (address) profileFd.append("address", address);
                if (profilePhoto && (profilePhoto as File).name)
                  profileFd.append("profilePhoto", profilePhoto as File);

                const res = await fetch("/api/user", {
                  method: "PATCH",
                  body: profileFd,
                });
                const data = await res.json();
                if (data?.ok) {
                  localStorage.setItem("user", JSON.stringify(data.user));
                  window.dispatchEvent(new CustomEvent("authChanged"));
                  toast.success("Profile updated");
                  // update preview to saved profile photo (if present)
                  setPreviewUrl(data.user?.profilePhoto || null);
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
            {/* phone field removed from user model */}
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
              {previewUrl ? (
                <div className="mb-2">
                  {/* preview — small square. Use next/image for external URLs and fallback to <img> for blob/object URLs (createObjectURL) */}
                  {previewUrl.startsWith("blob:") ? (
                    // object URLs are not supported by next/image; use a background-image div instead of <img>
                    <div
                      aria-hidden
                      className="h-20 w-20 rounded-full object-cover mb-2 bg-center bg-cover"
                      style={{ backgroundImage: `url(${previewUrl})` }}
                    />
                  ) : (
                    <Image
                      src={previewUrl}
                      alt="profile preview"
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-full object-cover mb-2"
                    />
                  )}
                </div>
              ) : null}
              <input
                name="profilePhoto"
                type="file"
                accept="image/*"
                className="w-full"
                onChange={(e) => {
                  const f = (e.target as HTMLInputElement).files?.[0] || null;
                  // revoke previous object URL if any
                  if (previewUrl && previewUrl.startsWith("blob:")) {
                    try {
                      URL.revokeObjectURL(previewUrl);
                    } catch (err) {}
                  }
                  if (f) {
                    const obj = URL.createObjectURL(f);
                    setPreviewUrl(obj);
                  } else {
                    // reset to current user photo if available
                    setPreviewUrl(user?.profilePhoto || null);
                  }
                }}
              />
            </div>
            {/* Change password inline in settings (optional) */}
            <div className="pt-3 border-t">
              <h4 className="text-sm font-medium mb-2">Change password</h4>
              <div className="space-y-2">
                <input
                  name="currentPassword"
                  type="password"
                  placeholder="Current password"
                  className="w-full border rounded px-2 py-1"
                />
                <input
                  name="newPassword"
                  type="password"
                  placeholder="New password"
                  className="w-full border rounded px-2 py-1"
                />
                <input
                  name="retypeNewPassword"
                  type="password"
                  placeholder="Retype new password"
                  className="w-full border rounded px-2 py-1"
                />
              </div>
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

      {/* Change password dialog removed - change password is available inline in settings */}
    </div>
  );
}
