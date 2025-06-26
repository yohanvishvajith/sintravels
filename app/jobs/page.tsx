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
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock job data
const mockJobs = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "TechCorp Solutions",
    location: "Singapore",
    country: "Singapore",
    flag: "🇸🇬",
    salary: { min: 80000, max: 120000, currency: "SGD" },
    type: "Full-time",
    industry: "Technology",
    experience: "Senior",
    postedDate: "2024-01-15",
    description:
      "Join our innovative team to build cutting-edge software solutions...",
    requirements: [
      "5+ years React/Node.js",
      "AWS experience",
      "Team leadership",
    ],
    remote: false,
  },
  {
    id: "2",
    title: "Marketing Manager",
    company: "Global Marketing Inc",
    location: "Toronto",
    country: "Canada",
    flag: "🇨🇦",
    salary: { min: 70000, max: 90000, currency: "CAD" },
    type: "Full-time",
    industry: "Marketing",
    experience: "Mid-level",
    postedDate: "2024-01-14",
    description: "Lead marketing campaigns for international markets...",
    requirements: [
      "Digital marketing experience",
      "Campaign management",
      "Analytics",
    ],
    remote: true,
  },
  // Add more mock jobs to demonstrate pagination
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `${i + 3}`,
    title: `Job Title ${i + 3}`,
    company: `Company ${i + 3}`,
    location: "Remote",
    country: "Global",
    flag: "🌍",
    salary: { min: 60000 + i * 5000, max: 90000 + i * 5000, currency: "USD" },
    type: "Full-time",
    industry: "Technology",
    experience: "Mid-level",
    postedDate: "2024-01-10",
    description: `Exciting opportunity for job ${i + 3}...`,
    requirements: ["React", "JavaScript", "CSS"],
    remote: true,
  })),
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(9); // 3x3 grid
  const [filters, setFilters] = useState({
    search: "",
    country: "",
    industry: "",
    experience: "",
    salary: [0, 200000],
    type: "",
    remote: false,
  });

  // Simulate loading jobs
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setJobs(mockJobs);
      setLoading(false);
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
      const matchesCountry =
        !filters.country || job.country === filters.country;
      const matchesIndustry =
        !filters.industry || job.industry === filters.industry;
      const matchesExperience =
        !filters.experience || job.experience === filters.experience;
      const matchesType = !filters.type || job.type === filters.type;
      const matchesRemote = !filters.remote || job.remote === filters.remote;
      const matchesSalary =
        job.salary.min >= filters.salary[0] &&
        job.salary.max <= filters.salary[1];

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
              Find Your Dream Job
            </h1>
            <p className="text-gray-600 mt-2">
              Discover opportunities from top employers worldwide
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <JobFilters filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Job Listings */}
          <div className="lg:w-3/4" id="jobs-section">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                {loading ? "Loading..." : `${filteredJobs.length} jobs found`}
              </p>
              {!loading && filteredJobs.length > 0 && (
                <p className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </p>
              )}
            </div>

            {loading ? (
              // Loading skeletons in grid
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(9)].map((_, index) => (
                  <JobSkeleton key={index} />
                ))}
              </div>
            ) : currentJobs.length > 0 ? (
              <>
                {/* Job cards in flex grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                  <div className="mt-8 flex justify-center">
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
                        Previous
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
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              // No jobs found
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters to see more results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
