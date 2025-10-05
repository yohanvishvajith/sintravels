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
  const [stats, setStats] = useState({
    countries: 0,
    jobsThisMonth: 0,
    industries: 0,
  });
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

  // fetch small dashboard stats (countries, industries, jobs this month)
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [cRes, iRes, jRes] = await Promise.all([
          fetch("/api/admin/countries"),
          fetch("/api/admin/industries"),
          fetch("/api/admin/jobs?stats=true"),
        ]);

        const cData = cRes.ok ? await cRes.json().catch(() => null) : null;
        const iData = iRes.ok ? await iRes.json().catch(() => null) : null;
        const jData = jRes.ok ? await jRes.json().catch(() => null) : null;

        if (!mounted) return;

        setStats({
          countries: cData?.countries?.length ?? 0,
          industries: iData?.industries?.length ?? 0,
          // jobsThisMonth: try to read from jobs API fallback: jData.jobsThisMonth or jData.count
          jobsThisMonth: jData?.jobsThisMonth ?? jData?.count ?? 0,
        });
      } catch (e) {
        // ignore - keep zeros
      }
    })();
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
        {/* Dashboard stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Countries</CardTitle>
              <CardDescription className="text-2xl font-bold">
                {stats.countries}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Jobs This Month</CardTitle>
              <CardDescription className="text-2xl font-bold">
                {stats.jobsThisMonth}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Industries</CardTitle>
              <CardDescription className="text-2xl font-bold">
                {stats.industries}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        {/* Jobs List Section */}
        <Card>
            <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
              <h3 className="text-sm font-medium">Total Visitors</h3>
              <p className="text-xs text-muted-foreground">
                Visits over the last 7 days
              </p>
              </div>
              <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                Live
              </Badge>
              </div>
            </div>
            </CardHeader>
            <CardContent>
            {/* Inline visitors graph component */}
            {(() => {
              const VisitorsGraph: React.FC = () => {
              const [visitors, setVisitors] = React.useState<number[] | null>(
                null
              );
              const [loading, setLoading] = React.useState(true);
              const [error, setError] = React.useState<string | null>(null);

              React.useEffect(() => {
                let mounted = true;
                setLoading(true);
                setError(null);

                // try to fetch real data; fallback to sample data on error
                fetch("/api/admin/visitors")
                .then(async (r) => {
                  const text = await r.text();
                  try {
                  const json = JSON.parse(text);
                  return json;
                  } catch {
                  // may be direct array
                  try {
                    return JSON.parse(JSON.stringify(text));
                  } catch {
                    return text;
                  }
                  }
                })
                .then((data) => {
                  if (!mounted) return;
                  // expect shape: { data: number[] } or number[]
                  if (Array.isArray(data)) {
                  setVisitors(data as number[]);
                  } else if (Array.isArray((data as any).data)) {
                  setVisitors((data as any).data);
                  } else if (Array.isArray((data as any).visitors)) {
                  setVisitors((data as any).visitors);
                  } else {
                  // fallback sample
                  setVisitors([12, 18, 24, 20, 30, 28, 35]);
                  }
                })
                .catch(() => {
                  if (!mounted) return;
                  setVisitors([12, 18, 24, 20, 30, 28, 35]);
                  setError("Failed to load visitors");
                })
                .finally(() => {
                  if (!mounted) return;
                  setLoading(false);
                });

                return () => {
                mounted = false;
                };
              }, []);

              if (loading || !visitors) {
                return (
                <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">
                  Loading visitors...
                </div>
                );
              }

              const width = 600;
              const height = 160;
              const padding = 16;
              const max = Math.max(...visitors, 1);
              const stepX =
                visitors.length > 1
                ? (width - padding * 2) / (visitors.length - 1)
                : 0;

              const points = visitors.map((v, i) => {
                const x = padding + i * stepX;
                const y =
                padding + (1 - v / max) * (height - padding * 2); // invert
                return { x, y, v };
              });

              const pathD = points
                .map((p, i) =>
                i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
                )
                .join(" ");

              const areaD =
                points.length > 0
                ? `${pathD} L ${padding + (points.length - 1) * stepX} ${
                  height - padding
                  } L ${padding} ${height - padding} Z`
                : "";

              const total = visitors.reduce((a, b) => a + b, 0);

              return (
                <div className="w-full">
                <div className="flex items-center justify-between mb-3">
                  <div>
                  <div className="text-2xl font-semibold">{total}</div>
                  <div className="text-xs text-muted-foreground">
                    total visits
                  </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString()}
                  </div>
                </div>

                <div className="w-full overflow-hidden">
                  <svg
                  viewBox={`0 0 ${width} ${height}`}
                  width="100%"
                  height={height}
                  preserveAspectRatio="xMidYMid meet"
                  className="block"
                  >
                  {/* area */}
                  <path
                    d={areaD}
                    fill="rgba(99,102,241,0.12)"
                    stroke="none"
                  />
                  {/* line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="rgb(99,102,241)"
                    strokeWidth={2}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  {/* points */}
                  {points.map((p, idx) => (
                    <circle
                    key={idx}
                    cx={p.x}
                    cy={p.y}
                    r={3.5}
                    fill="white"
                    stroke="rgb(99,102,241)"
                    strokeWidth={1.5}
                    />
                  ))}
                  {/* subtle grid lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                    const y = padding + t * (height - padding * 2);
                    return (
                    <line
                      key={i}
                      x1={padding}
                      x2={width - padding}
                      y1={y}
                      y2={y}
                      stroke="rgba(15,23,42,0.04)"
                      strokeWidth={1}
                    />
                    );
                  })}
                  </svg>
                </div>

                <div className="mt-2 text-xs text-muted-foreground flex gap-4">
                  {visitors.map((v, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-400/60" />
                    <div>{v}</div>
                  </div>
                  ))}
                </div>

                {error && (
                  <div className="mt-2 text-xs text-destructive">{error}</div>
                )}
                </div>
              );
              };

              return <VisitorsGraph />;
            })()}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
