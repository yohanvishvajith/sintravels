"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Plus,
  Users,
  Briefcase,
  Eye,
  EyeOff,
  Mail,
  Download,
  Building2,
  ExternalLink,
} from "lucide-react";
import ProfileBadge from "@/components/auth/profile-badge";

type Job = {
  id: number;
  title: string;
  description: string;
  applicants: Applicant[];
};

type Applicant = {
  id: number;
  name: string;
  email: string;
  resume: string;
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showApplicantsFor, setShowApplicantsFor] = useState<number | null>(
    null
  );
  const [newJob, setNewJob] = useState({ title: "", description: "" });
  const [availableBenefits, setAvailableBenefits] = useState<
    { id: number; name: string }[]
  >([]);
  const [benefitsLoading, setBenefitsLoading] = useState(false);
  const [benefitsError, setBenefitsError] = useState<string | null>(null);
  const [selectedBenefits, setSelectedBenefits] = useState<number[]>([]);
  const [benefitsAddc, setBenefitsAddc] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5; // Number of jobs per page

  // Dummy applicant data for demonstration
  const dummyApplicants: Applicant[] = [
    {
      id: 1,
      name: "Alice Smith",
      email: "alice@example.com",
      resume: "Resume Link 1",
    },
    {
      id: 2,
      name: "Bob Johnson",
      email: "bob@example.com",
      resume: "Resume Link 2",
    },
  ];

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title.trim() || !newJob.description.trim()) return;
    // submit to API
    (async () => {
      try {
        const body = {
          title: newJob.title,
          company: "",
          salaryMin: 0,
          salaryMax: 0,
          currency: "",
          type: "",
          description: newJob.description,
          closingDate: new Date().toISOString(),
          benefits: selectedBenefits,
          benefitsAddc,
        };
        const res = await fetch("/api/admin/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.ok) {
          // append created job (simple shape) to local list
          setJobs([
            ...jobs,
            {
              id: Date.now(),
              title: newJob.title,
              description: newJob.description,
              applicants: dummyApplicants,
            },
          ]);
          setNewJob({ title: "", description: "" });
          setSelectedBenefits([]);
          setBenefitsAddc("");
          setIsDialogOpen(false);
        } else {
          console.error("Failed to create job", data.error);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  };

  // fetch available benefits for checkboxes
  React.useEffect(() => {
    let mounted = true;
    setBenefitsLoading(true);
    setBenefitsError(null);
    fetch("/api/admin/benefits")
      .then(async (r) => {
        const text = await r.text();
        let data: any;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("Failed to parse /api/admin/benefits response", text);
          throw new Error("Invalid JSON from benefits API");
        }
        if (!r.ok || !data.ok) {
          console.error("Benefits API error", r.status, data);
          throw new Error(data?.error || `HTTP ${r.status}`);
        }
        if (mounted) setAvailableBenefits(data.benefits || []);
      })
      .catch((err) => {
        console.error("Failed to fetch benefits", err);
        if (mounted) setBenefitsError(String(err));
      })
      .finally(() => {
        if (mounted) setBenefitsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = jobs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setShowApplicantsFor(null); // Close any open applicant sections when changing pages
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Jobs List Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <span>Job Listings</span>
                  <Badge variant="outline">
                    {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Manage your job postings and view applicants
                  {jobs.length > jobsPerPage && (
                    <span className="block mt-1 text-xs text-gray-500">
                      Showing {startIndex + 1}-{Math.min(endIndex, jobs.length)}{" "}
                      of {jobs.length} jobs
                    </span>
                  )}
                </CardDescription>
              </div>

              {/* Add New Job Dialog */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <Plus className="h-5 w-5 text-blue-600" />
                      <span>Add New Job</span>
                    </DialogTitle>
                    <DialogDescription>
                      Create a new job posting for applicants to apply to.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddJob} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="dialog-title">Job Title</Label>
                      <Input
                        id="dialog-title"
                        type="text"
                        placeholder="e.g. Construction Worker"
                        value={newJob.title}
                        onChange={(e) =>
                          setNewJob({ ...newJob, title: e.target.value })
                        }
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dialog-benefits-addc">
                        Benefits (additional)
                      </Label>
                      <Input
                        id="dialog-benefits-addc"
                        placeholder="e.g. Free snacks, Gym"
                        value={benefitsAddc}
                        onChange={(e) => setBenefitsAddc(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Available Benefits</Label>
                      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-auto border rounded p-2">
                        {benefitsLoading && (
                          <div className="text-sm text-gray-500">
                            Loading benefits...
                          </div>
                        )}

                        {benefitsError && (
                          <div className="text-sm text-red-600">
                            Failed to load benefits: {benefitsError}
                            <div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // retry fetch
                                  setAvailableBenefits([]);
                                  setBenefitsError(null);
                                  setBenefitsLoading(true);
                                  fetch("/api/admin/benefits")
                                    .then(async (r) => {
                                      const text = await r.text();
                                      const data = JSON.parse(text);
                                      if (!r.ok || !data.ok)
                                        throw new Error(
                                          data?.error || `HTTP ${r.status}`
                                        );
                                      setAvailableBenefits(data.benefits || []);
                                    })
                                    .catch((e) => setBenefitsError(String(e)))
                                    .finally(() => setBenefitsLoading(false));
                                }}
                              >
                                Retry
                              </Button>
                            </div>
                          </div>
                        )}

                        {!benefitsLoading && !benefitsError && (
                          <>
                            {availableBenefits.map((b) => (
                              <label
                                key={b.id}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedBenefits.includes(b.id)}
                                  onChange={(e) => {
                                    if (e.target.checked)
                                      setSelectedBenefits((s) => [...s, b.id]);
                                    else
                                      setSelectedBenefits((s) =>
                                        s.filter((id) => id !== b.id)
                                      );
                                  }}
                                  className="h-4 w-4"
                                />
                                <span className="text-sm">{b.name}</span>
                              </label>
                            ))}
                            {availableBenefits.length === 0 && (
                              <div className="text-sm text-gray-500">
                                No benefits available
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dialog-description">
                        Job Description
                      </Label>
                      <Textarea
                        id="dialog-description"
                        placeholder="Describe the job requirements, responsibilities, and qualifications..."
                        value={newJob.description}
                        onChange={(e) =>
                          setNewJob({ ...newJob, description: e.target.value })
                        }
                        required
                        className="min-h-[120px] resize-none"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Job
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No jobs posted yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Create your first job posting to get started.
                </p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Job
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {currentJobs.map((job, index) => (
                  <div key={job.id}>
                    <Card className="border-l-4 border-l-blue-600">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg text-gray-900 mb-1">
                              {job.title}
                            </CardTitle>
                            <CardDescription className="text-sm leading-relaxed">
                              {job.description}
                            </CardDescription>
                          </div>
                          <Badge
                            variant={
                              job.applicants.length > 0
                                ? "default"
                                : "secondary"
                            }
                            className="ml-4"
                          >
                            <Users className="h-3 w-3 mr-1" />
                            {job.applicants.length} Applicants
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button
                          variant={
                            showApplicantsFor === job.id
                              ? "secondary"
                              : "outline"
                          }
                          onClick={() =>
                            setShowApplicantsFor(
                              showApplicantsFor === job.id ? null : job.id
                            )
                          }
                          className="w-full sm:w-auto"
                        >
                          {showApplicantsFor === job.id ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Hide Applicants
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              View Applicants ({job.applicants.length})
                            </>
                          )}
                        </Button>

                        {showApplicantsFor === job.id && (
                          <div className="mt-6 pt-4 border-t">
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                              <Users className="h-4 w-4 mr-2 text-blue-600" />
                              Applicants for this position
                            </h4>
                            {job.applicants.length === 0 ? (
                              <p className="text-gray-600 italic">
                                No applicants yet.
                              </p>
                            ) : (
                              <div className="border rounded-lg overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-gray-50">
                                      <TableHead className="font-semibold">
                                        Name
                                      </TableHead>
                                      <TableHead className="font-semibold">
                                        Email
                                      </TableHead>
                                      <TableHead className="font-semibold">
                                        Resume
                                      </TableHead>
                                      <TableHead className="font-semibold">
                                        Actions
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {job.applicants.map((applicant) => (
                                      <TableRow
                                        key={applicant.id}
                                        className="hover:bg-gray-50"
                                      >
                                        <TableCell className="font-medium">
                                          <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Users className="h-4 w-4 text-blue-600" />
                                              </div>
                                            </div>
                                            <span>{applicant.name}</span>
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center text-gray-600">
                                            <Mail className="h-3 w-3 mr-2" />
                                            <a
                                              href={`mailto:${applicant.email}`}
                                              className="hover:text-blue-600 transition-colors"
                                            >
                                              {applicant.email}
                                            </a>
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            PDF Document
                                          </Badge>
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex space-x-2">
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              asChild
                                            >
                                              <a
                                                href={applicant.resume}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center"
                                              >
                                                <Download className="h-3 w-3 mr-1" />
                                                Download
                                              </a>
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              asChild
                                            >
                                              <a
                                                href={`mailto:${applicant.email}`}
                                                className="flex items-center"
                                              >
                                                <Mail className="h-3 w-3 mr-1" />
                                                Contact
                                              </a>
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    {index < currentJobs.length - 1 && (
                      <Separator className="my-6" />
                    )}
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              handlePageChange(Math.max(1, currentPage - 1))
                            }
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>

                        {/* First page */}
                        {currentPage > 2 && (
                          <>
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => handlePageChange(1)}
                                className="cursor-pointer"
                              >
                                1
                              </PaginationLink>
                            </PaginationItem>
                            {currentPage > 3 && (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )}
                          </>
                        )}

                        {/* Current page and neighbors */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(
                            (page) =>
                              page === currentPage ||
                              page === currentPage - 1 ||
                              page === currentPage + 1
                          )
                          .map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={page === currentPage}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}

                        {/* Last page */}
                        {currentPage < totalPages - 1 && (
                          <>
                            {currentPage < totalPages - 2 && (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )}
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => handlePageChange(totalPages)}
                                className="cursor-pointer"
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              handlePageChange(
                                Math.min(totalPages, currentPage + 1)
                              )
                            }
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
