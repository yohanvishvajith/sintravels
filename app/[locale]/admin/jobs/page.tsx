"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash, Edit, Eye } from "lucide-react";
import { JobCard } from "@/components/jobs/job-card";

type Job = {
  id: string | number;
  title: string;
  company?: string;
  location?: string;
  type?: string;
  workTime?: string;
  salaryMin?: string;
  salaryMax?: string;
  basicSalary?: string | number;
  contractTime?: string | null;
  currency?: string;
  closingDate?: string;
  description?: string;
  applicants?: any[];
  country?: string;
  flag?: string | null;
  ageMin?: number;
  ageMax?: number;
  gender?: string | null;
  vacancies?: number;
  industry?: string | null;
  experience?: string | null;
  requirements?: string[] | any;
  benefits?: string[] | any;
  holidays?: string;
};

const STORAGE_KEY = "admin_jobs";

export default function LocaleAdminJobs() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | number | null>(
    null
  );
  const [form, setForm] = useState<Partial<Job>>({
    title: "",
    company: "",
    currency: "QAR",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Benefits state
  const [availableBenefits, setAvailableBenefits] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedBenefits, setSelectedBenefits] = useState<number[]>([]);
  // Countries and industries for dropdowns
  const [countries, setCountries] = useState<{ id: number; name: string }[]>(
    []
  );
  const [industriesList, setIndustriesList] = useState<
    { id: number; name: string }[]
  >([]);
  // Requirements (array of strings) for the job form
  const [requirements, setRequirements] = useState<string[]>([]);
  const [step, setStep] = useState<number>(1);

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

  // Fetch available benefits
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/benefits", {
          credentials: "same-origin",
        });
        const data = await res.json().catch(() => null);
        if (mounted && data?.ok) {
          setAvailableBenefits(data.benefits || []);
        }
      } catch (e) {
        console.error("Failed to fetch benefits", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch countries for dropdown
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/countries", {
          credentials: "same-origin",
        });
        const data = await res.json().catch(() => null);
        if (mounted && data?.ok) setCountries(data.countries || []);
      } catch (e) {
        console.error("Failed to fetch countries", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch industries for dropdown
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/industries", {
          credentials: "same-origin",
        });
        const data = await res.json().catch(() => null);
        if (mounted && data?.ok) setIndustriesList(data.industries || []);
      } catch (e) {
        console.error("Failed to fetch industries", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function resetForm() {
    setForm({
      title: "",
      company: "",
      currency: "Qatar riyal",
    });
    setSelectedBenefits([]);
    setRequirements([]);
    setEditingId(null);
  }

  async function handleAdd(e?: React.FormEvent) {
    e?.preventDefault();

    // Only submit when on step 2
    if (step !== 2) {
      return;
    }

    // Validate required fields
    if (!form.title || form.title.trim() === "") {
      setError("Job title is required");
      return;
    }
    if (!form.type || form.type.trim() === "") {
      setError("Job type is required");
      return;
    }
    if (!form.description || form.description.trim() === "") {
      setError("Job description is required");
      return;
    }
    if (!form.salaryMin) {
      setError("Minimum salary is required");
      return;
    }

    if (editingId) {
      // update existing via API to persist changes
      try {
        setLoading(true);
        setError(null);

        // parse salary min and max separately. If max is empty or 0, send null.
        const parseNumber = (v: any) => {
          if (v === undefined || v === null || String(v).trim() === "")
            return null;
          const n = parseInt(String(v), 10);
          if (Number.isNaN(n)) return null;
          return n;
        };

        const salaryMinParsed = form.basicSalary
          ? parseNumber(form.basicSalary)
          : parseNumber(form.salaryMin);
        // salaryMax should be null when not provided or 0
        const salaryMaxParsed = (() => {
          const parsed = parseNumber(form.salaryMax);
          if (parsed === 0) return null;
          return parsed;
        })();

        const payload: any = {
          id: String(editingId),
          title: String(form.title),
          company: form.company ?? "",
          location: form.location ?? "",
          country: form.country ?? "",
          gender: form.gender ?? null,
          salaryMin: salaryMinParsed,
          salaryMax: salaryMaxParsed,
          holidays: form.holidays ? String(form.holidays) : "sunday",
          ageMin: form.ageMin ? parseInt(String(form.ageMin), 10) : 0,
          ageMax: form.ageMax ? parseInt(String(form.ageMax), 10) : 0,
          vacancies: form.vacancies ? parseInt(String(form.vacancies), 10) : 1,
          currency: form.currency || "Qatar riyal",
          type: form.type ?? "",
          workTime: (form as any).workTime ?? null,
          industry: form.industry ?? null,
          experience: form.experience ?? null,
          // visa and contract info
          visaCategory: (form as any).visaCategory ?? null,
          contractPeriod: (form as any).contractPeriod ?? null,
          description: form.description ?? "",
          // use the dedicated requirements state (array of strings)
          requirements: requirements ?? [],
          selectedBenefits: selectedBenefits,
          closingDate: form.closingDate
            ? String(form.closingDate)
            : new Date().toISOString(),
        };

        // debug log payload so we can inspect what is being sent when troubleshooting
        console.debug("[admin/jobs] update payload:", payload);
        const res = await fetch("/api/admin/jobs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          // ensure cookies (auth token) are sent for auth middleware
          credentials: "same-origin",
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => null);
        if (res.ok && data?.ok) {
          toast({
            title: "Success",
            description: "Job updated successfully",
            variant: "default",
          });
          // update local list from returned job when available
          if (data.job) {
            setJobs((s) =>
              s.map((j) =>
                String(j.id) === String(data.job.id) ? data.job : j
              )
            );
          } else {
            // otherwise try refresh
            try {
              const res2 = await fetch("/api/jobs");
              const d2 = await res2.json();
              if (d2?.ok) setJobs(d2.jobs || []);
            } catch (e) {
              // no-op
            }
          }
          setOpen(false);
          resetForm();
        } else {
          setError(data?.error || `Server returned ${res.status}`);
        }
      } catch (e) {
        console.error("Failed to update job", e);
        setError("Failed to update job");
      } finally {
        setLoading(false);
      }
    } else {
      // create new job via API (previously missing)
      try {
        setLoading(true);
        setError(null);

        // parse salary min and max separately for creation as well
        const parseNumber = (v: any) => {
          if (v === undefined || v === null || String(v).trim() === "")
            return null;
          const n = parseInt(String(v), 10);
          if (Number.isNaN(n)) return null;
          return n;
        };

        const salaryMinParsed = form.basicSalary
          ? parseNumber(form.basicSalary)
          : parseNumber(form.salaryMin);
        const salaryMaxParsed = (() => {
          const parsed = parseNumber(form.salaryMax);
          if (parsed === 0) return null;
          return parsed;
        })();

        const payload: any = {
          title: String(form.title),
          company: form.company ?? "",
          location: form.location ?? "",
          country: form.country ?? "",
          gender: form.gender ?? null,
          salaryMin: salaryMinParsed,
          salaryMax: salaryMaxParsed,
          holidays: form.holidays ? String(form.holidays) : "sunday",
          ageMin: form.ageMin ? parseInt(String(form.ageMin), 10) : 0,
          ageMax: form.ageMax ? parseInt(String(form.ageMax), 10) : 0,
          vacancies: form.vacancies ? parseInt(String(form.vacancies), 10) : 1,
          currency: form.currency || "Qatar riyal",
          type: form.type ?? "",
          workTime: (form as any).workTime ?? null,
          industry: form.industry ?? null,
          experience: form.experience ?? null,
          description: form.description ?? "",
          // persist the dynamic requirements array
          requirements: requirements ?? [],
          visaCategory: (form as any).visaCategory ?? null,
          contractPeriod: (form as any).contractPeriod ?? null,
          selectedBenefits: selectedBenefits,
          closingDate: form.closingDate
            ? String(form.closingDate)
            : new Date().toISOString(),
        };

        // debug payload before creating a job
        console.debug("[admin/jobs] create payload:", payload);
        const res = await fetch("/api/admin/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // include same-origin credentials so middleware can validate the cookie
          credentials: "same-origin",
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => null);
        if (res.ok && data?.ok) {
          toast({
            title: "Success",
            description: "Job created successfully",
            variant: "default",
          });
          if (data.job) {
            setJobs((s) => [data.job, ...s]);
          } else {
            // refresh jobs list as fallback
            try {
              const res2 = await fetch("/api/jobs");
              const d2 = await res2.json();
              if (d2?.ok) setJobs(d2.jobs || []);
            } catch (e) {
              // no-op
            }
          }
          setOpen(false);
          resetForm();
        } else {
          setError(data?.error || `Server returned ${res.status}`);
        }
      } catch (e) {
        console.error("Failed to create job", e);
        setError("Failed to create job");
      } finally {
        setLoading(false);
      }
    }
  }

  // open delete confirmation modal (do not perform deletion here)
  function handleDelete(id: string | number) {
    setDeleteTarget(id);
    setDeleteOpen(true);
  }

  // perform the actual deletion (called when user confirms in modal)
  async function performDelete() {
    const id = deleteTarget;
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      console.debug("[admin/jobs] delete payload:", { id });
      const res = await fetch(`/api/admin/jobs`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ id }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        setJobs((s) => s.filter((j) => j.id !== id));
        toast({
          title: "Success",
          description: "Job deleted successfully",
          variant: "default",
        });
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

  // Compute visible (non-expired) jobs for display
  const visibleJobs = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return jobs.filter((job) => {
      if (!job.closingDate) return true;
      const cd = new Date(String(job.closingDate));
      cd.setHours(0, 0, 0, 0);
      return cd >= today;
    });
  }, [jobs]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Jobs</h2>

        <Dialog
          open={open}
          onOpenChange={(isOpen: boolean) => {
            setOpen(isOpen);
            if (!isOpen) {
              resetForm();
              setStep(1);
              setError(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Post a job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Job" : "Post a Job"} {""}
                <span className="text-sm text-gray-500">
                  (Step {step} of 2)
                </span>
              </DialogTitle>
            </DialogHeader>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleAdd} className="space-y-4">
              {step === 1 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

                    <div>
                      <Label htmlFor="type">Job Type</Label>
                      <select
                        id="type"
                        name="type"
                        value={form.type || ""}
                        onChange={handleChange}
                        className="w-full rounded border px-2 py-1"
                        required
                      >
                        <option value="">Select type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Temporary">Temporary</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <select
                        id="country"
                        name="country"
                        value={form.country || ""}
                        onChange={handleChange}
                        className="w-full rounded border px-2 py-1"
                      >
                        <option value="">Select country</option>
                        {countries.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="industry">Industry</Label>
                        <select
                          id="industry"
                          name="industry"
                          value={(form as any).industry ?? ""}
                          onChange={handleChange}
                          className="w-full rounded border px-2 py-1"
                        >
                          <option value="">Select industry</option>
                          {industriesList.map((i) => (
                            <option key={i.id} value={String(i.id)}>
                              {i.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="closingDate">Closing Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full text-left"
                            >
                              {form.closingDate
                                ? new Date(
                                    String(form.closingDate)
                                  ).toLocaleDateString()
                                : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={
                                form.closingDate
                                  ? new Date(String(form.closingDate))
                                  : undefined
                              }
                              onSelect={(date: Date | undefined) => {
                                if (date)
                                  setForm((s) => ({
                                    ...s,
                                    closingDate: date.toISOString(),
                                  }));
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    <div>
                      <Label htmlFor="vacancies">Vacancies</Label>
                      <Input
                        id="vacancies"
                        name="vacancies"
                        value={form.vacancies ?? ""}
                        onChange={handleChange}
                        type="number"
                        placeholder="e.g. 1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="holidays">Holidays</Label>
                      <select
                        id="holidays"
                        name="holidays"
                        value={(form as any).holidays ?? "sunday"}
                        onChange={handleChange}
                        className="w-full rounded border px-2 py-1"
                      >
                        <option value="saturday">Saturday</option>
                        <option value="sunday">Sunday</option>
                        <option value="weekends">Weekends</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="workTime">Working Hours</Label>
                      <Input
                        id="workTime"
                        name="workTime"
                        placeholder="e.g. 8 hours / shift"
                        value={(form as any).workTime || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="visaCategory">Visa Category</Label>
                      <select
                        id="visaCategory"
                        name="visaCategory"
                        value={(form as any).visaCategory || ""}
                        onChange={handleChange}
                        className="w-full rounded border px-2 py-1"
                      >
                        <option value="Job">Job Visa</option>
                        <option value="Visit">Visit Visa</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="contractPeriod">Contract Period</Label>
                      <select
                        id="contractPeriod"
                        name="contractPeriod"
                        value={(form as any).contractPeriod || ""}
                        onChange={handleChange}
                        className="w-full rounded border px-2 py-1"
                      >
                        <option value="2 years">2 years</option>
                        <option value="3 years">3 years</option>
                        <option value="4 years">4 years</option>
                        <option value="5 years">5 years</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <select
                        id="gender"
                        name="gender"
                        value={form.gender || "both"}
                        onChange={handleChange}
                        className="w-full rounded border px-2 py-1"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="both">Both</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="experience">Experience</Label>
                      <select
                        id="experience"
                        name="experience"
                        value={form.experience || "No experience"}
                        onChange={handleChange}
                        className="w-full rounded border px-2 py-1"
                      >
                        <option>No experience</option>
                        <option>1 year</option>
                        <option>2 year</option>
                        <option>3 year</option>
                        <option>4 year</option>
                        <option>5 year</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    <div>
                      <Label htmlFor="ageMin">Min Age</Label>
                      <Input
                        id="ageMin"
                        name="ageMin"
                        type="number"
                        value={form.ageMin ?? ""}
                        onChange={handleChange}
                        placeholder="e.g. 21"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ageMax">Max Age</Label>
                      <Input
                        id="ageMax"
                        name="ageMax"
                        type="number"
                        value={form.ageMax ?? ""}
                        onChange={handleChange}
                        placeholder="e.g. 45"
                      />
                    </div>

                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <select
                        id="currency"
                        name="currency"
                        value={form.currency || "Qatar riyal"}
                        onChange={handleChange}
                        className="w-full rounded border px-2 py-1"
                      >
                        <option value="LKR">LKR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="QAR">QAR</option>
                        <option value="KWD">KWD</option>
                        <option value="SAR">SAR</option>
                        <option value="OMR">OMR</option>
                        <option value="JPY">JPY</option>
                        <option value="AED">AED</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="salaryMin">Salary Min</Label>
                      <Input
                        id="salaryMin"
                        name="salaryMin"
                        type="number"
                        value={form.salaryMin ?? ""}
                        onChange={handleChange}
                        placeholder="e.g. 30000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="salaryMax">Salary Max</Label>
                      <Input
                        id="salaryMax"
                        name="salaryMax"
                        type="number"
                        value={form.salaryMax ?? ""}
                        onChange={handleChange}
                        placeholder="e.g. 60000"
                      />
                    </div>
                  </div>

                  {/* Benefits Section */}
                  <div className="space-y-3">
                    <Label>Available Benefits</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-auto border rounded p-3">
                      {availableBenefits.length === 0 ? (
                        <div className="col-span-2 text-sm text-gray-500 text-center py-2">
                          No benefits available
                        </div>
                      ) : (
                        availableBenefits.map((benefit) => (
                          <div
                            key={benefit.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`benefit-${benefit.id}`}
                              checked={selectedBenefits.includes(benefit.id)}
                              onCheckedChange={(checked: boolean) => {
                                if (checked) {
                                  setSelectedBenefits((prev) => [
                                    ...prev,
                                    benefit.id,
                                  ]);
                                } else {
                                  setSelectedBenefits((prev) =>
                                    prev.filter((id) => id !== benefit.id)
                                  );
                                }
                              }}
                            />
                            <Label
                              htmlFor={`benefit-${benefit.id}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {benefit.name}
                            </Label>
                          </div>
                        ))
                      )}
                    </div>
                    {/* Additional benefits field removed */}
                  </div>
                </>
              )}

              {/* Step 2: Requirements + Description */}
              {step === 2 && (
                <div>
                  <Label>Requirements</Label>
                  <div className="space-y-2 mb-3">
                    {requirements.map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input
                          value={req}
                          onChange={(e) => {
                            const v = e.target.value;
                            setRequirements((prev) => {
                              const copy = [...prev];
                              copy[idx] = v;
                              return copy;
                            });
                          }}
                          placeholder={`Requirement ${idx + 1}`}
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            setRequirements((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <div>
                      <Button
                        type="button"
                        onClick={() => setRequirements((prev) => [...prev, ""])}
                      >
                        Add requirement
                      </Button>
                    </div>
                  </div>

                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description || ""}
                    onChange={handleChange}
                    className="min-h-[120px]"
                    required
                    placeholder="Enter job description..."
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                {step === 1 ? (
                  <>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        resetForm();
                        setStep(1);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={(e) => {
                        // Basic validation before moving to step 2
                        e.preventDefault();
                        if (!form.title || String(form.title).trim() === "") {
                          setError("Job title is required");
                          return;
                        }
                        setError(null);
                        setStep(2);
                      }}
                    >
                      Next
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={loading}
                    >
                      {loading
                        ? "Saving..."
                        : editingId
                        ? "Update Job"
                        : "Post Job"}
                    </Button>
                  </>
                )}
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
              <TableHead>Country</TableHead>
              <TableHead>Closing Date</TableHead>
              {/*<TableHead>Working Hours</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Contract</TableHead>
              <TableHead>Applicants</TableHead> */}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleJobs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  No active jobs found
                </TableCell>
              </TableRow>
            ) : (
              visibleJobs.map((job) => (
                <TableRow key={job.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>{job.country || job.location}</TableCell>
                  <TableCell>
                    {job.closingDate
                      ? new Date(String(job.closingDate)).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  {/* <TableCell>{job.type}</TableCell> */}
                  {/* <TableCell>
                    {(() => {
                      const minRaw = job.salaryMin ?? null;
                      const maxRaw = job.salaryMax ?? null;
                      const min =
                        minRaw !== null ? parseInt(String(minRaw), 10) : null;
                      const max =
                        maxRaw !== null ? parseInt(String(maxRaw), 10) : null;
                      const curr = job.currency || "";
                      if (min == null && max == null) return "-";
                      if (max == null || max === 0) {
                        return `${curr ? curr + " " : ""}${min}`;
                      }
                      return `${curr ? curr + " " : ""}${min} - ${
                        curr ? curr + " " : ""
                      }${max}`;
                    })()}
                  </TableCell> */}
                  {/* <TableCell>{job.contractTime || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {(job.applicants || []).length}
                    </Badge>
                  </TableCell> */}
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
                        onClick={async () => {
                          setForm({ ...job });
                          // load existing requirements into the dynamic inputs
                          try {
                            const reqs = (job as any).requirements;
                            if (Array.isArray(reqs)) setRequirements(reqs);
                            else if (reqs) setRequirements([String(reqs)]);
                            else setRequirements([]);
                          } catch (e) {
                            setRequirements([]);
                          }
                          setEditingId(job.id);

                          // Load existing benefits for this job
                          try {
                            try {
                              const res = await fetch(
                                `/api/admin/jobs/${job.id}/benefits`,
                                { credentials: "same-origin" }
                              );
                              const data = await res.json().catch(() => null);
                              if (data?.ok && data.benefits) {
                                setSelectedBenefits(
                                  data.benefits.map((b: any) => b.id)
                                );
                              }
                            } catch (e) {
                              console.error("Failed to load job benefits", e);
                            }
                          } catch (e) {
                            console.error("Failed to load job benefits", e);
                          }

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

      {/* View job dialog - shows full job details (user detail view only) */}
      {viewOpen && viewJob && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2"
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewOpen(false);
          }}
        >
          <div className="bg-white rounded-lg p-4 max-w-md w-full max-h-[90vh] overflow-y-auto relative animate-fadeIn text-sm">
            <button
              onClick={() => setViewOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">
              {viewJob.title} - {viewJob.country}
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">Job Description:</h4>
              </div>
              <div>
                <div className="text-sm text-gray-700">
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center">
                      <span className="mr-2">🌎</span>
                      <div>
                        <strong>Country:</strong>{" "}
                        {viewJob.country || viewJob.location || "-"}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🛂</span>
                      <div>
                        <strong>Visa:</strong>{" "}
                        {((viewJob as any).visaCategory || "-") + " visa"}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📃</span>
                      <div>
                        <strong>Contract Period:</strong>{" "}
                        {(viewJob as any).contractPeriod || "-"}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🏷️</span>
                      <div>
                        <strong>Type:</strong> {viewJob.type || "-"}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🏢</span>
                      <div>
                        <strong>Company:</strong> {viewJob.company || "Unknown"}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🎂</span>
                      <div>
                        <strong>Age:</strong> {viewJob.ageMin ?? 25}–
                        {viewJob.ageMax ?? 45}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">♂️</span>
                      <div>
                        <strong>Gender:</strong> {viewJob.gender ?? "Male"}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">⏰</span>
                      <div>
                        <strong>Working Hours:</strong>{" "}
                        {viewJob.workTime ?? "8 hours per day"}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🗓️</span>
                      <div>
                        <strong>Holiday:</strong>{" "}
                        {viewJob.holidays ??
                          "Public holidays as per company policy"}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">💰</span>
                      <div>
                        <strong>Basic Salary:</strong>{" "}
                        {(() => {
                          const minRaw = viewJob.salaryMin ?? 250;
                          const maxRaw = viewJob.salaryMax ?? null;
                          const min =
                            typeof minRaw === "number"
                              ? minRaw
                              : parseInt(String(minRaw), 10);
                          const max =
                            maxRaw == null
                              ? null
                              : typeof maxRaw === "number"
                              ? maxRaw
                              : parseInt(String(maxRaw), 10);
                          const curr = viewJob.currency ?? "$";
                          const fmt = (n: number) => n.toLocaleString();
                          if (max == null || max === 0) {
                            return `${curr} ${fmt(min)} + OT`;
                          }
                          return `${curr} ${fmt(min)} – ${curr} ${fmt(max)}`;
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {Array.isArray((viewJob as any).benefits) &&
                (viewJob as any).benefits.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">🎁 Benefits:</h4>
                    <ul className="list-none pl-5 space-y-1">
                      {(viewJob as any).benefits.map((b: string, i: number) => (
                        <li key={i}> 😍 {b}</li>
                      ))}
                    </ul>
                  </div>
                )}
              <div>
                <h4 className="font-semibold mb-2">✅ Requirements:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {Array.isArray((viewJob as any).requirements) ? (
                    (viewJob as any).requirements.map(
                      (r: string, i: number) => <li key={i}>{r}</li>
                    )
                  ) : (
                    <li>No specific requirements listed</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
