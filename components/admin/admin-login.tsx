"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminLogin({
  onSuccess,
}: {
  onSuccess: (user: any) => void;
}) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("username", username);
      fd.append("password", password);

      const res = await fetch("/api/login", { method: "POST", body: fd });
      const data = await res.json();
      if (data?.ok && data.user) {
        // Only allow ADMINs for admin dashboard
        if (data.user.role !== "ADMIN") {
          toast.error("You are not authorized to access admin dashboard");
          setLoading(false);
          return;
        }
        // Token is set in httpOnly cookie by the server
        // Just dispatch auth change event
        window.dispatchEvent(new CustomEvent("authChanged"));
        onSuccess(data.user);
        toast.success("Signed in as admin");

        // Navigate to admin root (preserve locale prefix if present)
        try {
          const parts = (window.location.pathname || "")
            .split("/")
            .filter(Boolean);
          let prefix = "";
          if (parts.length > 0 && ["en", "si"].includes(parts[0])) {
            prefix = `/${parts[0]}`;
          }
          router.replace(`${prefix}/admin`);
        } catch (e) {
          // fallback: reload
          window.location.href = "/admin";
        }
      } else {
        toast.error(data?.error || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Admin Sign In</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm block mb-1">Username or email</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
