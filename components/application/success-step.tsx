'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, Search, FileText } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface SuccessStepProps {
  jobId: string;
}

export function SuccessStep({ jobId }: SuccessStepProps) {
  const applicationId = `APP-${Date.now()}`; // Generate a mock application ID

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mb-4"
            >
              <CheckCircle className="h-16 w-16 text-green-600" />
            </motion.div>
            <CardTitle className="text-2xl text-green-900">
              Application Submitted Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-green-700 mb-4">
                Thank you for your application. We have received your submission and 
                will review it carefully.
              </p>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Application Reference</p>
                <p className="text-lg font-mono font-semibold text-gray-900">
                  {applicationId}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-green-900">What happens next?</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-900">Review Process (1-3 days)</p>
                    <p className="text-sm text-green-700">
                      Our recruitment team will review your application and documents.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-900">Initial Response (3-5 days)</p>
                    <p className="text-sm text-green-700">
                      You'll receive an email update about your application status.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-900">Interview Process</p>
                    <p className="text-sm text-green-700">
                      If selected, we'll schedule an interview and guide you through the process.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Important Notes</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Keep your application reference number for future correspondence</li>
                <li>• Check your email regularly for updates</li>
                <li>• You can track your application status in your dashboard</li>
                <li>• Contact us if you don't hear back within 7 business days</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild className="flex-1">
                <Link href="/dashboard/applications">
                  <FileText className="mr-2 h-4 w-4" />
                  Track Application
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/jobs">
                  <Search className="mr-2 h-4 w-4" />
                  Browse More Jobs
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}