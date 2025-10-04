"use client";

import { useState, useEffect, useMemo } from "react";
import { JobFilters } from "@/components/jobs/job-filters";
import { JobCard } from "@/components/jobs/job-card";
import { JobSkeleton } from "@/components/jobs/job-skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// The page now strictly relies on the API for job data. No mock data.

export default function JobsPage() {
  const t = useTranslations("JobsPage");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(12); // 3x4 grid (3 rows of 4)
  const [filters, setFilters] = useState({
    search: "",
    country: "",
    industry: "",
    experience: "",
    salary: [0, 200000],
    type: "",
    remote: false,
  });
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Load jobs from the API and map DB structure to UI structure
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/jobs");
        // try to parse JSON body even when res.ok is false so we can show server errors
        let data: any = null;
        try {
          data = await res.json();
        } catch (e) {
          console.error("/api/jobs returned non-JSON response", e);
        }
        if (!res.ok) {
          const msg =
            data && data.error ? data.error : `API error (${res.status})`;
          console.error("/api/jobs error:", res.status, data);
          throw new Error(msg);
        }
        if (data?.ok && Array.isArray(data.jobs)) {
          const mapped = data.jobs.map((j: any) => ({
            id: j.id,
            title: j.title,
            company: j.company,
            location: j.location,
            country: j.country,
            flag: j.flag ?? "🌍",
            salary: {
              min: j.salaryMin,
              max: j.salaryMax,
              currency: j.currency,
            },
            type: j.type,
            vacancies: j.vacancies ?? 0,
            industry: j.industry,
            experience: j.experience,
            postedDate:
              j.postedAt || j.createdAt
                ? new Date(j.postedAt || j.createdAt)
                    .toISOString()
                    .split("T")[0]
                : new Date().toISOString().split("T")[0],
            description: j.description,
            requirements: Array.isArray(j.requirements) ? j.requirements : [],
            // benefits are provided by the API (derived from jobBenefits relation)
            benefits: Array.isArray(j.benefits) ? j.benefits : [],
            remote: j.remote ?? false,
            ageMin: j.ageMin ?? null,
            ageMax: j.ageMax ?? null,
            gender: j.gender ?? null,
            dayOff: j.dayOff ?? null,
            holidays: j.holidays ?? null,
            visaCategory: j.visaCategory ?? null,
            contractPeriod: j.contractPeriod ?? null,
          }));
          setJobs(mapped);
        } else {
          // no jobs returned
          setJobs([]);
        }
      } catch (err) {
        console.error("Failed to load jobs from API", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Filter jobs based on current filters
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.search.toLowerCase());
      const norm = (s: any) =>
        s === null || s === undefined ? "" : String(s).toLowerCase().trim();
      const matchesCountry =
        !filters.country || norm(job.country) === norm(filters.country);
      const matchesIndustry =
        !filters.industry || norm(job.industry) === norm(filters.industry);
      const matchesExperience =
        !filters.experience ||
        norm(job.experience) === norm(filters.experience);
      const matchesType = !filters.type || job.type === filters.type;
      const matchesRemote = !filters.remote || job.remote === filters.remote;
      // salary filter: treat missing min as 0 and missing max as Infinity,
      // and check for overlap between job salary range and filter range
      const jobMin = job.salary?.min ?? 0;
      const jobMax = job.salary?.max ?? Number.POSITIVE_INFINITY;
      const filterMin = filters.salary[0] ?? 0;
      const filterMax = filters.salary[1] ?? Number.POSITIVE_INFINITY;
      const matchesSalary = jobMin <= filterMax && jobMax >= filterMin;

      return (
        matchesSearch &&
        matchesCountry &&
        matchesIndustry &&
        matchesExperience &&
        matchesType &&
        matchesRemote &&
        matchesSalary
      );
    });
  }, [jobs, filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of jobs section
    document
      .getElementById("jobs-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const goToPrevious = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  const goToNext = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Jobs</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {t("headerTitle")}
            </h1>
            <p className="text-gray-600 mt-2">{t("headerSubtitle")}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Job Listings (filters moved to modal) */}
          <div className="w-full" id="jobs-section">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                {loading
                  ? t("loading")
                  : t.rich("jobsFound", { count: String(filteredJobs.length) })}
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex items-center px-3 py-1.5 bg-white border rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                  aria-label="Open filters"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 5a1 1 0 011-1h12a1 1 0 01.707 1.707L12 11.414V16a1 1 0 01-1.447.894L7 15.118V11.414L3.293 5.707A1 1 0 013 5z" />
                  </svg>
                  Filters
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(jobsPerPage)].map((_, index) => (
                  <JobSkeleton key={index} />
                ))}
              </div>
            ) : currentJobs.length > 0 ? (
              <>
                {/* Job cards in flex grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {currentJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="h-full"
                    >
                      <JobCard job={job} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex flex-col items-center">
                    <nav className="flex items-center space-x-2">
                      {/* Previous Button */}
                      <button
                        onClick={goToPrevious}
                        disabled={currentPage === 1}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        {t("previous")}
                      </button>

                      {/* Page Numbers */}
                      <div className="flex space-x-1">
                        {getPageNumbers().map((page, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              typeof page === "number" && goToPage(page)
                            }
                            disabled={page === "..."}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              page === currentPage
                                ? "bg-blue-600 text-white"
                                : page === "..."
                                ? "text-gray-400 cursor-default"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={goToNext}
                        disabled={currentPage === totalPages}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === totalPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {t("next")}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </nav>
                    <p className="text-sm text-gray-500 mt-2">
                      Page {currentPage} of {totalPages}
                    </p>
                  </div>
                )}
              </>
            ) : (
              // No jobs found
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t("noJobsTitle")}
                </h3>
                <p className="text-gray-600">{t("noJobsHint")}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters modal for small screens / when user clicks Filters button */}
      {filtersOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setFiltersOpen(false);
          }}
        >
          <div className="bg-white rounded-lg w-full max-w-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setFiltersOpen(false)}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[60vh] overflow-auto">
              <JobFilters
                filters={filters}
                onFiltersChange={(f) => setFilters(f)}
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() =>
                  setFilters({
                    search: "",
                    country: "",
                    industry: "",
                    experience: "",
                    salary: [0, 200000],
                    type: "",
                    remote: false,
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm"
              >
                Reset
              </button>
              <button
                onClick={() => setFiltersOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
