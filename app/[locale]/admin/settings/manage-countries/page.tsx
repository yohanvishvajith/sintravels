"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";

type Country = { id: number; name: string; flagimg?: string };

export default function LocaleAdminManageCountries() {
  const [items, setItems] = useState<Country[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Country | null>(null);
  const [value, setValue] = useState("");
  const [flag, setFlag] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setValue("");
    setFlag("");
    setPreview(null);
    setIsOpen(true);
  };

  const openEdit = (it: Country) => {
    setEditing(it);
    setValue(it.name);
    setFlag(it.flagimg || "");
    setPreview(it.flagimg || null);
    setIsOpen(true);
  };

  const save = async () => {
    if (!value.trim()) return;
    try {
      if (editing) {
        const res = await fetch("/api/admin/countries", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing.id, name: value, flagimg: flag }),
        });
        const data = await res.json();
        if (data.ok) {
          setItems((prev) =>
            prev.map((p) => (p.id === data.country.id ? data.country : p))
          );
        }
      } else {
        const res = await fetch("/api/admin/countries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: value, flagimg: flag }),
        });
        const data = await res.json();
        if (data.ok) {
          setItems((prev) => [data.country, ...prev]);
        }
      }
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/uploads", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.ok && data.url) {
        setFlag(data.url);
        setPreview(data.url);
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const remove = (id: number) => {
    fetch("/api/admin/countries", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setItems((prev) => prev.filter((p) => p.id !== id));
      })
      .catch(console.error);
  };

  React.useEffect(() => {
    let mounted = true;
    fetch("/api/admin/countries")
      .then((r) => r.json())
      .then((data) => {
        if (mounted && data.ok) setItems(data.countries || []);
      })
      .catch(console.error);
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Manage Countries</h2>
          <p className="text-sm text-gray-600">
            Add, edit or remove countries.
          </p>
        </div>

        <div>
          <Button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700">
            Add Country
          </Button>
        </div>
      </div>

      <div className="bg-white rounded border w-1/2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>Flag</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.name}</TableCell>
                <TableCell>
                  {b.flagimg ? (
                    <img
                      src={b.flagimg}
                      alt={`${b.name} flag`}
                      width={24}
                      height={16}
                      className="h-6"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(b)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(b.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Country</DialogTitle>
            <DialogDescription>
              Add or update a country below.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Country name"
            />
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  id="flag-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
                {uploading && (
                  <span className="text-sm text-gray-500">Uploading...</span>
                )}
              </div>
              {preview ? (
                <div className="mt-2">
                  <img
                    src={preview}
                    alt="flag preview"
                    width={32}
                    height={24}
                    className="h-8"
                  />
                </div>
              ) : null}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={save} className="bg-blue-600 hover:bg-blue-700">
                Save
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
