"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// ...existing code...
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";

type Job = {
  id: string | number;
  title: string;
  company?: string;
  location?: string;
  type?: string | null;
  closingDate?: string | null;
  country?: string | null;
};

export default function ExpiredJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | number | null>(
    null
  );
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

  const expiredJobs = React.useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return jobs.filter((j) => {
      if (!j.closingDate) return false;
      const cd = new Date(String(j.closingDate));
      cd.setHours(0, 0, 0, 0);
      return cd < now;
    });
  }, [jobs]);

  function handleDelete(id: string | number) {
    setDeleteTarget(id);
    setDeleteOpen(true);
  }

  async function performDelete() {
    const id = deleteTarget;
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const res = await fetch(`/api/admin/jobs`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        setJobs((s) => s.filter((j) => String(j.id) !== String(id)));
        setSuccess("Job deleted");
        setDeleteOpen(false);
        setDeleteTarget(null);
      } else {
        setError(data?.error || `Server returned ${res.status}`);
      }
    } catch (e) {
      console.error("Failed to delete job", e);
      setError("Failed to delete job");
    } finally {
      setLoading(false);
    }
  }

  if (error) return <div className="p-6">Failed to load jobs.</div>;
  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Expired Jobs</h2>
        </div>
        <div>
          <Button onClick={() => router.push("/admin/jobs")}>
            Back to Jobs
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expired job listings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Closing Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expiredJobs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    No expired jobs found
                  </TableCell>
                </TableRow>
              ) : (
                expiredJobs.map((job) => (
                  <TableRow key={job.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.country || job.location}</TableCell>
                    <TableCell>
                      {job.closingDate
                        ? new Date(String(job.closingDate)).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
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
        </CardContent>
      </Card>
      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete job</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this job? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => performDelete()}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
