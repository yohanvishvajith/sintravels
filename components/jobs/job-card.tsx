"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const skills = ["JavaScript", "React", "TypeScript", "CSS3", "HTML5"];

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    country: string;
    flag: string;
    salary: {
      min: number;
      max: number;
      currency: string;
    };
    type: string;
    industry: string;
    experience: string;
    postedDate: string;
    description: string;
    requirements: string[];
    benefits?: string[];
    remote: boolean;
  };
}

export function JobCard({ job }: JobCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);

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

  const handleApplyClick = async () => {
    try {
      const raw = localStorage.getItem("user");
      const user = raw ? JSON.parse(raw) : null;
      if (!user) {
        window.dispatchEvent(new CustomEvent("openSignIn"));
        return;
      }

      setSubmitting(true);

      const fd = new FormData();
      fd.append("jobId", job.id);
      fd.append("userId", String(user.id));

      const res = await fetch("/api/apply", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data?.ok) {
        toast.success("Application submitted — thank you!", {
          position: "top-right",
        });
      } else {
        toast.error?.(data?.error || "Failed to submit application");
      }
    } catch (err) {
      console.error(err);
      toast.error?.("Application failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full">
      <div className="bg-white rounded-xl w-full h-full overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
        <div className="bg-blue-600 p-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <i className="fas fa-briefcase text-2xl text-blue-600"></i>
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
              {job.remote ? "Remote" : job.location}
            </span>
            <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full hover:scale-105 transition-transform">
              <i className="fas fa-clock mr-1"></i> {job.type}
            </span>
            <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full hover:scale-105 transition-transform">
              <i className="fas fa-dollar-sign mr-1"></i> $
              {job.salary.min.toLocaleString()} - $
              {job.salary.max.toLocaleString()}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-3">{job.description}</p>

          <div className="mb-3">
            <h3 className="text-xs font-semibold text-gray-500 mb-1">
              REQUIRED SKILLS
            </h3>
            <div className="flex flex-wrap gap-1">
              {job.requirements.slice(0, 5).map((skill, index) => (
                <span
                  key={index}
                  className={`bg-gray-200 text-gray-800 ${
                    index === 0
                      ? "text-[0.65rem] px-2 py-0.5"
                      : "text-xs px-3 py-1"
                  } rounded-full`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={openDetails}
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium py-1.5 px-4 rounded-lg flex-1 text-center hover:-translate-y-0.5 hover:shadow-lg transition-all text-sm"
              >
                View Job
              </button>
              {!applied && (
                <button
                  onClick={() => handleApplyClick()}
                  className="border border-blue-600 text-blue-600 font-medium py-1.5 px-4 rounded-lg flex-1 text-center hover:bg-blue-50 transition-colors text-sm"
                >
                  {submitting ? "Applying…" : "Apply Now"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-4 py-2 text-[0.65rem] text-gray-500 border-t border-gray-200 mt-auto">
          <div className="flex justify-between items-center">
            <span>
              Posted{" "}
              {new Date(job.postedDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span>12 applicants</span>
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
              {job.title} - {job.company}
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">Job Description:</h4>
                <p>{job.description}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Requirements:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {job.requirements.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
              {job.benefits && job.benefits.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Benefits:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {job.benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="pt-4">
                <button
                  onClick={() => {
                    closeDetails();
                    handleApplyClick();
                  }}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium py-2 px-6 rounded-lg w-full text-center"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apply flow is now handled inline (click Apply -> send jobId + userId or open SignIn) */}
    </div>
  );
}

export default JobCard;
