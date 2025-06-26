'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PersonalInfoStep } from './personal-info-step';
import { ExperienceStep } from './experience-step';
import { DocumentsStep } from './documents-step';
import { ReviewStep } from './review-step';
import { SuccessStep } from './success-step';

interface MultiStepApplicationProps {
  jobId: string;
}

const steps = [
  { id: 1, name: 'Personal Information', description: 'Basic details and contact info' },
  { id: 2, name: 'Experience', description: 'Work history and skills' },
  { id: 3, name: 'Documents', description: 'Resume and supporting documents' },
  { id: 4, name: 'Review', description: 'Review and submit application' },
];

export function MultiStepApplication({ jobId }: MultiStepApplicationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationData, setApplicationData] = useState({
    personalInfo: {},
    experience: {},
    documents: {},
  });

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  const updateApplicationData = (stepData: any, stepKey: string) => {
    setApplicationData(prev => ({
      ...prev,
      [stepKey]: stepData,
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitApplication = async () => {
    try {
      // Submit application logic here
      console.log('Submitting application:', { jobId, ...applicationData });
      setCurrentStep(5); // Success step
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  if (currentStep === 5) {
    return <SuccessStep jobId={jobId} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Application Progress</CardTitle>
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      currentStep >= step.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step.id}
                  </div>
                  <span className="mt-2 text-center max-w-24">{step.name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1]?.name}</CardTitle>
          <p className="text-gray-600">{steps[currentStep - 1]?.description}</p>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <PersonalInfoStep
              data={applicationData.personalInfo}
              onNext={nextStep}
              onUpdate={(data) => updateApplicationData(data, 'personalInfo')}
            />
          )}
          {currentStep === 2 && (
            <ExperienceStep
              data={applicationData.experience}
              onNext={nextStep}
              onPrev={prevStep}
              onUpdate={(data) => updateApplicationData(data, 'experience')}
            />
          )}
          {currentStep === 3 && (
            <DocumentsStep
              data={applicationData.documents}
              onNext={nextStep}
              onPrev={prevStep}
              onUpdate={(data) => updateApplicationData(data, 'documents')}
            />
          )}
          {currentStep === 4 && (
            <ReviewStep
              data={applicationData}
              onPrev={prevStep}
              onSubmit={submitApplication}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}