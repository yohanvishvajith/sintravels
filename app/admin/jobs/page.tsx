"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash, Edit, Eye } from "lucide-react";

type Job = {
  id: number;
  title: string;
  company?: string;
  location?: string;
  type?: string;
  salaryMin?: string;
  salaryMax?: string;
  currency?: string;
  closingDate?: string;
  description?: string;
  applicants?: any[];
  country?: string;
  flag?: string | null;
  ageMin?: number;
  ageMax?: number;
  industry?: string | null;
  experience?: string | null;
  requirements?: string[] | any;
  benefits?: string[] | any;
};

export default function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const [form, setForm] = useState<Partial<Job>>({ title: "", company: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/jobs");
        const data = await res.json();
        if (mounted && data?.ok) setJobs(data.jobs || []);
      } catch (e) {
        console.error("Failed to fetch jobs", e);
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function handleAdd(e?: React.FormEvent) {
    e?.preventDefault();
    if (!form.title || form.title.trim() === "") return;

    if (editingId) {
      // update existing
      // call backend to update (not implemented yet) - optimistic update
      setJobs((s) =>
        s.map((j) =>
          j.id === editingId
            ? {
                ...j,
                title: form.title!.trim(),
                company: form.company || "",
                location: form.location || "",
                type: form.type || "",
                salaryMin: form.salaryMin || "",
                salaryMax: form.salaryMax || "",
                currency: form.currency || "",
                closingDate: form.closingDate || "",
                description: form.description || "",
              }
            : j
        )
      );
    } else {
      // create via API
      try {
        setLoading(true);
        setError(null);
        setSuccess(null);
        const payload = {
          title: form.title,
          company: form.company,
          location: form.location || "",
          country: form.country || "",
          flag: form.flag || null,
          salaryMin: form.salaryMin || 0,
          salaryMax: form.salaryMax || 0,
          ageMin: form.ageMin || 0,
          ageMax: form.ageMax || 0,
          currency: form.currency || "",
          type: form.type || "",
          industry: form.industry || null,
          experience: form.experience || null,
          description: form.description || "",
          requirements: form.requirements || [],
          benefits: form.benefits || [],
          closingDate: form.closingDate || new Date().toISOString(),
        };

        const res = await fetch("/api/admin/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        let data: any = null;
        try {
          data = await res.json();
        } catch (e) {
          console.error("Failed to parse response JSON", e);
        }
        console.log("POST /api/admin/jobs response", res.status, data);
        if (res.ok && data?.ok) {
          setSuccess("Job created successfully");
          // re-fetch jobs to ensure UI matches DB
          try {
            const res2 = await fetch("/api/jobs");
            const d2 = await res2.json();
            if (d2?.ok) setJobs(d2.jobs || []);
            else setJobs((s) => [data.job, ...s]);
          } catch (e) {
            setJobs((s) => [data.job, ...s]);
          }
        } else {
          const message = data?.error || `Server returned ${res.status}`;
          setError(message);
        }
      } catch (e) {
        console.error("Failed to create job", e);
        setError("Failed to create job");
      } finally {
        setLoading(false);
      }
    }

    setForm({ title: "", company: "" });
    setEditingId(null);
    setOpen(false);
  }

  function handleDelete(id: number) {
    setJobs((s) => s.filter((j) => j.id !== id));
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded">
          {success}
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Jobs (Admin)</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Post a job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Post a Job</DialogTitle>
              <DialogDescription>
                Create a new job posting. Fields marked optional can be left
                blank.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAdd} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={form.company || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={form.location || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Input
                    id="type"
                    name="type"
                    placeholder="Full-time / Part-time"
                    value={form.type || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="closingDate">Closing Date</Label>
                  <Input
                    id="closingDate"
                    name="closingDate"
                    type="date"
                    value={form.closingDate || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="salaryMin">Salary Min</Label>
                  <Input
                    id="salaryMin"
                    name="salaryMin"
                    value={form.salaryMin || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="salaryMax">Salary Max</Label>
                  <Input
                    id="salaryMax"
                    name="salaryMax"
                    value={form.salaryMax || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    name="currency"
                    value={form.currency || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description || ""}
                  onChange={handleChange}
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Post Job
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Closing</TableHead>
              <TableHead>Applicants</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  No jobs posted yet
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{job.type}</TableCell>
                  <TableCell>
                    {job.salaryMin || "-"}
                    {job.salaryMax ? ` - ${job.salaryMax}` : ""}{" "}
                    {job.currency || ""}
                  </TableCell>
                  <TableCell>{job.closingDate || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {(job.applicants || []).length}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setViewJob(job);
                          setViewOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setForm({ ...job });
                          setEditingId(job.id);
                          setOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(job.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View job dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Job details</DialogTitle>
            <DialogDescription>View job information</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {viewJob ? (
              <div>
                <h3 className="text-lg font-semibold">{viewJob.title}</h3>
                <p className="text-sm text-gray-600">{viewJob.company}</p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <strong>Location:</strong> {viewJob.location || "-"}
                  </div>
                  <div>
                    <strong>Type:</strong> {viewJob.type || "-"}
                  </div>
                  <div>
                    <strong>Salary:</strong> {viewJob.salaryMin || "-"}
                    {viewJob.salaryMax ? ` - ${viewJob.salaryMax}` : ""}{" "}
                    {viewJob.currency || ""}
                  </div>
                  <div>
                    <strong>Closing:</strong> {viewJob.closingDate || "-"}
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <strong>Description</strong>
                  <p className="mt-1 text-gray-700 whitespace-pre-wrap">
                    {viewJob.description || "-"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No job selected</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
