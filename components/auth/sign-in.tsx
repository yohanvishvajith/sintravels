"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SignIn() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    const h = () => setOpen(true);
    window.addEventListener("openSignIn", h as EventListener);
    return () => window.removeEventListener("openSignIn", h as EventListener);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Sign In</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            try {
              const form = e.currentTarget as HTMLFormElement;
              const fd = new FormData(form);

              const res = await fetch("/api/login", {
                method: "POST",
                body: fd,
              });
              const data = await res.json();
              if (data?.ok) {
                toast.success("Signed in");
                // persist user locally for dev (replace with real session in production)
                try {
                  localStorage.setItem("user", JSON.stringify(data.user));
                  window.dispatchEvent(new CustomEvent("authChanged"));
                  // if admin, redirect to admin portal
                  try {
                    if (data.user?.role === "ADMIN") {
                      window.location.href = "/admin";
                    }
                  } catch (e) {}
                } catch (e) {}
                form.reset();
                setOpen(false);
              } else {
                toast.error?.(data?.error || "Login failed");
              }
            } catch (err) {
              console.error(err);
              toast.error?.("Login error");
            } finally {
              setSubmitting(false);
            }
          }}
          className="space-y-3"
        >
          <div>
            <input
              name="username"
              placeholder="Username or email"
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
