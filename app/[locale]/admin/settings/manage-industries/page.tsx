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

type Industry = { id: number; name: string };

export default function LocaleAdminManageIndustries() {
  const [items, setItems] = useState<Industry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Industry | null>(null);
  const [value, setValue] = useState("");

  const openAdd = () => {
    setEditing(null);
    setValue("");
    setIsOpen(true);
  };

  const openEdit = (it: Industry) => {
    setEditing(it);
    setValue(it.name);
    setIsOpen(true);
  };

  const save = async () => {
    if (!value.trim()) return;
    try {
      if (editing) {
        const res = await fetch("/api/admin/industries", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing.id, name: value }),
        });
        const data = await res.json();
        if (data.ok) {
          setItems((prev) =>
            prev.map((p) => (p.id === data.industry.id ? data.industry : p))
          );
        }
      } else {
        const res = await fetch("/api/admin/industries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: value }),
        });
        const data = await res.json();
        if (data.ok) {
          setItems((prev) => [data.industry, ...prev]);
        }
      }
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const remove = (id: number) => {
    fetch("/api/admin/industries", {
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
    fetch("/api/admin/industries")
      .then((r) => r.json())
      .then((data) => {
        if (mounted && data.ok) setItems(data.industries || []);
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
          <h2 className="text-xl font-semibold">Manage Industries</h2>
          <p className="text-sm text-gray-600">
            Add, edit or remove industries.
          </p>
        </div>

        <div>
          <Button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700">
            Add Industry
          </Button>
        </div>
      </div>

      <div className="bg-white rounded border w-1/2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Industry</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.name}</TableCell>
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
            <DialogTitle>Enter Industry</DialogTitle>
            <DialogDescription>
              Add or update an industry below.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Industry name"
            />
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
