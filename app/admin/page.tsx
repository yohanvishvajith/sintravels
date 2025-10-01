import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import ProfileBadge from "@/components/auth/profile-badge";
import { Briefcase, Users, FileText } from "lucide-react";

export default async function AdminPage() {
  // fetch KPI counts from the database
  const [jobsCount, applicantsCount, usersCount] = await Promise.all([
    prisma.job.count(),
    prisma.applicant.count(),
    prisma.user.count(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mb-4">
                Overview and key metrics
              </p>
            </div>
            <div>
              <ProfileBadge />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/admin/jobs" className="no-underline">
              <div className="p-4 bg-gray-50 rounded-lg border hover:shadow transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm text-gray-500">Jobs</h3>
                    <p className="text-2xl font-semibold mt-1">{jobsCount}</p>
                  </div>
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </Link>

            <Link href="/admin/applicants" className="no-underline">
              <div className="p-4 bg-gray-50 rounded-lg border hover:shadow transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm text-gray-500">Applicants</h3>
                    <p className="text-2xl font-semibold mt-1">
                      {applicantsCount}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </Link>

            <Link href="/admin/users" className="no-underline">
              <div className="p-4 bg-gray-50 rounded-lg border hover:shadow transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm text-gray-500">Users</h3>
                    <p className="text-2xl font-semibold mt-1">{usersCount}</p>
                  </div>
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent activity</h2>
            <p className="text-sm text-gray-600">
              Placeholder for recent jobs/applications (implement later).
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quick links</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/admin/jobs" className="text-blue-600 underline">
                  Manage Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/applicants"
                  className="text-blue-600 underline"
                >
                  View Applicants
                </Link>
              </li>
              <li>
                <Link href="/admin/users" className="text-blue-600 underline">
                  Manage Users
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
