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

export default function SignUp() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Sign Up</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create an account</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            try {
              const form = e.currentTarget as HTMLFormElement;
              const fd = new FormData(form);

              const res = await fetch("/api/register", {
                method: "POST",
                body: fd,
              });
              const data = await res.json();
              if (data?.ok) {
                toast.success("Account created");
                try {
                  localStorage.setItem("user", JSON.stringify(data.user));
                  window.dispatchEvent(new CustomEvent("authChanged"));
                } catch (e) {}
                form.reset();
                setOpen(false);
              } else {
                toast.error?.(data?.error || "Registration failed");
              }
            } catch (err) {
              console.error(err);
              toast.error?.("Registration error");
            } finally {
              setSubmitting(false);
            }
          }}
          className="space-y-3"
        >
          <div>
            <input
              name="username"
              placeholder="Username"
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <input
              name="phone"
              placeholder="Phone number"
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
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
          <div>
            <input
              name="retypePassword"
              type="password"
              placeholder="Retype password"
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <input
              name="address"
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
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating…" : "Create account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
