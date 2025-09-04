'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { MultiStepApplication } from '@/components/application/multi-step-application';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function ApplyPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/jobs">Jobs</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Apply</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">Job Application</h1>
            <p className="text-gray-600 mt-2">
              Complete your application in a few simple steps
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <MultiStepApplication jobId={jobId} />
      </div>
    </div>
  );
  
}