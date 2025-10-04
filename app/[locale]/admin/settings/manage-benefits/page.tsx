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

type Benefit = { id: number; name: string };

export default function LocaleAdminManageBenefits() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Benefit | null>(null);
  const [value, setValue] = useState("");

  const openAdd = () => {
    setEditing(null);
    setValue("");
    setIsOpen(true);
  };

  const openEdit = (b: Benefit) => {
    setEditing(b);
    setValue(b.name);
    setIsOpen(true);
  };

  const save = async () => {
    if (!value.trim()) return;
    try {
      if (editing) {
        const res = await fetch("/api/admin/benefits", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing.id, name: value }),
        });
        const data = await res.json();
        if (data.ok) {
          setBenefits((prev) =>
            prev.map((p) => (p.id === data.benefit.id ? data.benefit : p))
          );
        }
      } else {
        const res = await fetch("/api/admin/benefits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: value }),
        });
        const data = await res.json();
        if (data.ok) {
          setBenefits((prev) => [data.benefit, ...prev]);
        }
      }
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const remove = (id: number) => {
    fetch("/api/admin/benefits", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setBenefits((prev) => prev.filter((p) => p.id !== id));
      })
      .catch(console.error);
  };

  React.useEffect(() => {
    let mounted = true;
    fetch("/api/admin/benefits")
      .then((r) => r.json())
      .then((data) => {
        if (mounted && data.ok) setBenefits(data.benefits);
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
          <h2 className="text-xl font-semibold">Manage Benefits</h2>
          <p className="text-sm text-gray-600">
            Manage company benefits and perks here.
          </p>
        </div>

        <div>
          <Button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700">
            Add Benefits
          </Button>
        </div>
      </div>

      <div className="bg-white rounded border w-1/2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Benefit</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {benefits.map((b) => (
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
            <DialogTitle>Enter Benefits</DialogTitle>
            <DialogDescription>
              Add or update a benefit below.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Benefit name"
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
