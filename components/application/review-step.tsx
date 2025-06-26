'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Send, User, Briefcase, FileText } from 'lucide-react';

interface ReviewStepProps {
  data: {
    personalInfo: any;
    experience: any;
    documents: any;
  };
  onPrev: () => void;
  onSubmit: () => void;
}

export function ReviewStep({ data, onPrev, onSubmit }: ReviewStepProps) {
  const { personalInfo, experience, documents } = data;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Review Your Application</h3>
        <p className="text-gray-600">
          Please review all information before submitting your application.
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="text-gray-900">{personalInfo.firstName} {personalInfo.lastName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-900">{personalInfo.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-gray-900">{personalInfo.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Nationality</p>
              <p className="text-gray-900">{personalInfo.nationality}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Current Location</p>
              <p className="text-gray-900">{personalInfo.currentLocation}</p>
            </div>
            {personalInfo.linkedinUrl && (
              <div>
                <p className="text-sm font-medium text-gray-500">LinkedIn</p>
                <a 
                  href={personalInfo.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Profile
                </a>
              </div>
            )}
          </div>
          
          {personalInfo.summary && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Professional Summary</p>
                <p className="text-gray-900 leading-relaxed">{personalInfo.summary}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5" />
            <span>Work Experience</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {experience.experiences?.map((exp: any, index: number) => (
            <div key={index}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{exp.jobTitle}</h4>
                  <p className="text-gray-700">{exp.company} • {exp.location}</p>
                  <p className="text-sm text-gray-500">
                    {exp.startDate} - {exp.isCurrentJob ? 'Present' : exp.endDate}
                    {exp.isCurrentJob && <Badge variant="secondary" className="ml-2">Current</Badge>}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
              {index < experience.experiences.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}

          {experience.skills && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-gray-500 mb-3">Key Skills</p>
                <div className="flex flex-wrap gap-2">
                  {experience.skills.split(',').map((skill: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.resume && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Resume/CV</p>
                    <p className="text-sm text-green-700">{documents.resume.name}</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-green-300 text-green-700">
                  {(documents.resume.size / 1024 / 1024).toFixed(2)} MB
                </Badge>
              </div>
            )}

            {documents.coverLetter && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Cover Letter</p>
                    <p className="text-sm text-blue-700">{documents.coverLetter.name}</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-blue-300 text-blue-700">
                  {(documents.coverLetter.size / 1024 / 1024).toFixed(2)} MB
                </Badge>
              </div>
            )}

            {documents.additionalDocuments?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Additional Documents</p>
                {documents.additionalDocuments.map((doc: File, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 mb-2">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {(doc.size / 1024 / 1024).toFixed(2)} MB
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Section */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="text-center">
            <h4 className="font-semibold text-green-900 mb-2">Ready to Submit?</h4>
            <p className="text-green-700 mb-4">
              By submitting this application, you confirm that all information provided is accurate and complete.
            </p>
            <div className="text-sm text-green-600">
              ✓ All required fields completed<br />
              ✓ Documents uploaded successfully<br />
              ✓ Information reviewed and verified
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={onSubmit} className="bg-green-600 hover:bg-green-700">
          <Send className="mr-2 h-4 w-4" />
          Submit Application
        </Button>
      </div>
    </div>
  );
}