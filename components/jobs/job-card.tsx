"use client";
import React, { useState, useEffect } from "react";
interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    country: string;
    flag?: string | null;
    salary?: {
      min: number;
      max: number;
      currency?: string;
    };
    salaryMin?: number;
    salaryMax?: number;
    basicSalary?: number;
    currency?: string;
    vacancies?: number;
    type: string;
    workTime?: string;
    industry: string;
    experience: string;
    postedDate: string;
    description: string;
    requirements: string[];
    benefits?: string[];
    remote: boolean;
    ageMin?: number;
    ageMax?: number;
    gender?: string;
    dayOff?: string;
    holidays?: string;
    visaCategory?: string | null;
    contractPeriod?: string | null;
  };
  hideActions?: boolean; // Hide apply/contact buttons (for admin preview)
  showDetailsModal?: boolean; // Auto-open the details modal (for admin full view)
}

export function JobCard({
  job,
  hideActions = false,
  showDetailsModal = false,
}: JobCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(showDetailsModal);
  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    setDetailsOpen(showDetailsModal);
  }, [showDetailsModal]);

  useEffect(() => {
    if (detailsOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [detailsOpen]);

  // check if current user has applied
  useEffect(() => {
    const checkApplied = async () => {
      try {
        const raw = localStorage.getItem("user");
        const user = raw ? JSON.parse(raw) : null;
        if (!user) {
          setApplied(false);
          return;
        }
        const res = await fetch(
          `/api/apply/check?jobId=${encodeURIComponent(job.id)}&userId=${
            user.id
          }`
        );
        const data = await res.json();
        setApplied(!!data?.applied);
      } catch (err) {
        console.error(err);
      }
    };
    checkApplied();
  }, [job.id]);

  const openDetails = () => setDetailsOpen(true);
  const closeDetails = () => setDetailsOpen(false);

  // Debug: log job when vacancies is missing to help troubleshoot missing value on the UI
  useEffect(() => {
    if (job.vacancies === undefined || job.vacancies === null) {
      // Use console.debug so it can be filtered in browser devtools
      console.debug("[JobCard] vacancies missing for job:", {
        id: job.id,
        job,
      });
    }
  }, [job]);

  return (
    <div className="h-full">
      <div className="bg-white rounded-xl w-full h-full overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
        <div className="bg-blue-600 p-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex items-center justify-center">
              {/* Always render an <img> so DOM contains an image element for layout/testing.
                  Use job.flag when it looks like a URL; otherwise use a local SVG placeholder. */}
              {(() => {
                const isUrl =
                  typeof job.flag === "string" &&
                  (job.flag.startsWith("http") ||
                    job.flag.startsWith("//") ||
                    job.flag.startsWith("/"));
                const src = isUrl
                  ? (job.flag as string)
                  : "/images/flag-placeholder.svg";
                return (
                  // plain img avoids next/image domain/domain-config issues and always shows an element
                  <img
                    src={src}
                    alt={
                      job.flag && !isUrl
                        ? String(job.flag)
                        : `${job.country || job.location} flag`
                    }
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                );
              })()}
            </div>
            <div>
              <h2 className="text-lg font-bold">{job.title}</h2>
              <p className="text-blue-100 text-sm">{job.company}</p>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-blue-100 text-blue-800 text-[0.65rem] px-2 py-0.5 rounded-full hover:scale-105 transition-transform">
              <i className="fas fa-map-marker-alt mr-1"></i>{" "}
              {job.remote ? "Remote" : job.country || job.location}
            </span>

            <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full hover:scale-105 transition-transform">
              <i className="fas fa-dollar-sign mr-1"></i>{" "}
              {(() => {
                const min = job.salary?.min ?? job.salaryMin ?? 0;
                const max = job.salary?.max ?? job.salaryMax ?? null;
                const curr = job.salary?.currency ?? job.currency ?? "";
                const fmt = (n: number) => n.toLocaleString();
                if (max == null || max === 0) {
                  // only min available — append + OT
                  if (curr) return `${curr} ${fmt(min)} + OT`;
                  return `$${fmt(min)} + OT`;
                }
                if (curr) {
                  return `${curr} ${fmt(min)} - ${curr} ${fmt(max)}`;
                }
                return `$${fmt(min)} - $${fmt(max)}`;
              })()}
            </span>
            <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full hover:scale-105 transition-transform">
              <i className="fas fa-clock mr-1"></i>{" "}
              {job.workTime || job.type || "-"}
            </span>
          </div>

          {/* Additional details summary (brief) */}
          <div className="text-sm text-gray-700 mb-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <span className="mr-2">🌎</span>
                <div>
                  <strong>Country:</strong>{" "}
                  <span>{job.country || job.location || "Dubai"}</span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-2">🛂</span>
                <div>
                  <strong>Visa :</strong>{" "}
                  <span>{job.visaCategory || "Not specified"}</span>
                </div>
              </div>

              <div className="flex items-center">
                <span className="mr-2">🎂</span>
                <div>
                  <strong>Age:</strong> {job.ageMin ?? 25}-{job.ageMax ?? 45}{" "}
                  years
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-2">🚻</span>
                <div>
                  <strong>Gender:</strong> {job.gender ?? "Male"}
                </div>
              </div>
              <div className="flex items-center col-span-2">
                <span className="mr-2">💰</span>
                <div>
                  <strong>Salary:</strong>{" "}
                  {(() => {
                    const min = job.salary?.min ?? job.salaryMin ?? 250;
                    const max = job.salary?.max ?? job.salaryMax ?? null;
                    const curr = job.salary?.currency ?? job.currency ?? "$";
                    const fmt = (n: number) => n.toLocaleString();
                    if (max == null || max === 0) {
                      if (curr) return `${curr} ${fmt(min)} + OT`;
                      return `$${fmt(min)} + OT`;
                    }
                    return `${curr} ${fmt(min)} – ${curr} ${fmt(max)}`;
                  })()}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3"></div>

          {!hideActions && (
            <div className="mt-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={openDetails}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium py-1.5 px-4 rounded-lg flex-1 text-center hover:-translate-y-0.5 hover:shadow-lg transition-all text-sm"
                >
                  View Job
                </button>
                {!applied &&
                  (showContact ? (
                    <div className="flex gap-2 w-full">
                      <a
                        href="tel:0117365476"
                        className="border border-green-600 text-green-600 font-medium py-1.5 px-4 rounded-lg flex-1 text-center hover:bg-green-50 transition-colors text-sm"
                      >
                        Call 0117365476
                      </a>
                      <a
                        href="https://wa.me/0703145633"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-green-600 bg-green-600 text-white font-medium py-1.5 px-4 rounded-lg flex-1 text-center hover:opacity-95 transition-colors text-sm"
                      >
                        WhatsApp 0703145633
                      </a>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowContact(true)}
                      className="border border-blue-600 text-blue-600 font-medium py-1.5 px-4 rounded-lg flex-1 text-center hover:bg-blue-50 transition-colors text-sm"
                    >
                      Contact Us to apply
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-4 py-2 text-[0.65rem] text-gray-500 border-t border-gray-200 mt-auto">
          <div className="flex justify-between items-center">
            <span>
              Deadline{" "}
              {new Date(job.postedDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span>{(job.vacancies ?? 0).toString()} Vacancies</span>
          </div>
        </div>
      </div>

      {/* Job details modal */}
      {detailsOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDetails();
          }}
        >
          <div className="bg-white rounded-lg p-4 max-w-md w-full max-h-[90vh] overflow-y-auto relative animate-fadeIn text-sm">
            <button
              onClick={closeDetails}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">
              {job.title} - {job.country}
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
                        {job.country || job.location || "-"}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🛂</span>
                      <div>
                        <strong>Visa:</strong>{" "}
                        {job.visaCategory + " visa" || "-"}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📃</span>
                      <div>
                        <strong>Contract Period:</strong> {job.contractPeriod}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🏷️</span>
                      <div>
                        <strong>Type:</strong> {job.type || "-"}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🏢</span>
                      <div>
                        <strong>Company:</strong> {job.company || "Unknown"}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🎂</span>
                      <div>
                        <strong>Age:</strong> {job.ageMin ?? 25}–
                        {job.ageMax ?? 45}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">♂️</span>
                      <div>
                        <strong>Gender:</strong> {job.gender ?? "Male"}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">⏰</span>
                      <div>
                        <strong>Working Hours:</strong>{" "}
                        {job.workTime ?? "8 hours per day"}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <span className="mr-2">🗓️</span>
                      <div>
                        <strong>Holiday:</strong>{" "}
                        {job.holidays ??
                          "Public holidays as per company policy"}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">💰</span>
                      <div>
                        <strong>Basic Salary:</strong>{" "}
                        {(() => {
                          const min = job.salary?.min ?? job.salaryMin ?? 250;
                          const max = job.salary?.max ?? job.salaryMax ?? null;
                          const curr =
                            job.salary?.currency ?? job.currency ?? "$";
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
              {job.benefits && job.benefits.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">🎁 Benefits:</h4>
                  <ul className="list-none pl-5 space-y-1">
                    {job.benefits.map((b, i) => (
                      <li key={i}> 😍 {b}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <h4 className="font-semibold mb-2">✅ Requirements:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {job.requirements.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              {!hideActions && (
                <div className="pt-4">
                  <button
                    onClick={() => {
                      closeDetails();
                      setShowContact(true);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium py-2 px-6 rounded-lg w-full text-center"
                  >
                    Apply Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact modal for phone / WhatsApp */}
      {showContact && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowContact(false);
          }}
        >
          <div className="bg-white rounded-lg p-4 max-w-sm w-full animate-fadeIn relative">
            <h3 className="text-lg font-semibold mb-2">Contact to apply</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please contact via phone or WhatsApp to apply for this job.
            </p>
            <div className="flex gap-2 mb-4">
              <a
                href="tel:0117365476"
                className="flex-1 text-center border border-green-600 text-green-600 py-2 rounded-lg"
              >
                Call 0117365476
              </a>
              <a
                href="https://wa.me/0703145633"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-green-600 text-white py-2 rounded-lg"
              >
                WhatsApp 0703145633
              </a>
            </div>
            <button
              onClick={() => setShowContact(false)}
              aria-label="Close contact modal"
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl leading-none"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Apply flow is now handled inline (click Apply -> send jobId + userId or open SignIn) */}
    </div>
  );
}

export default JobCard;
