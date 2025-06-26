'use client';
import { Label } from "@/components/ui/label";
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  File, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  ArrowRight 
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

const schema = z.object({
  resume: z.any().refine((file) => file && file.size > 0, 'Resume is required'),
  coverLetter: z.any().optional(),
  additionalDocuments: z.array(z.any()).optional(),
});

type FormData = z.infer<typeof schema>;

interface DocumentsStepProps {
  data: any;
  onNext: () => void;
  onPrev: () => void;
  onUpdate: (data: any) => void;
}

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  acceptedTypes: string[];
  maxSize: number;
  label: string;
  required?: boolean;
  currentFile?: File;
  onRemove?: () => void;
}

function FileUpload({ 
  onFileUpload, 
  acceptedTypes, 
  maxSize, 
  label, 
  required = false,
  currentFile,
  onRemove 
}: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Invalid file type. Please upload PDF or Word document.');
      }
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      // Simulate upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            onFileUpload(file);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  }, [onFileUpload, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple: false,
  });

  if (currentFile && uploadProgress === 100) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">{currentFile.name}</p>
                <p className="text-sm text-green-700">
                  {(currentFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {onRemove && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium">
            {isDragActive ? 'Drop the file here' : `Upload ${label}`}
            {required && <span className="text-red-500 ml-1">*</span>}
          </p>
          <p className="text-sm text-gray-500">
            Drag and drop or click to browse
          </p>
          <p className="text-xs text-gray-400">
            PDF, DOC, DOCX up to {maxSize / 1024 / 1024}MB
          </p>
        </div>
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-gray-600 text-center">Uploading... {uploadProgress}%</p>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export function DocumentsStep({ data, onNext, onPrev, onUpdate }: DocumentsStepProps) {
  const [files, setFiles] = useState({
    resume: data.resume || null,
    coverLetter: data.coverLetter || null,
    additionalDocuments: data.additionalDocuments || [],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: files,
  });

  const onSubmit = (formData: FormData) => {
    onUpdate(files);
    onNext();
  };

  const handleFileUpload = (file: File, type: string) => {
    setFiles(prev => ({
      ...prev,
      [type]: file,
    }));
    form.setValue(type as any, file);
  };

  const handleRemoveFile = (type: string) => {
    setFiles(prev => ({
      ...prev,
      [type]: null,
    }));
    form.setValue(type as any, null);
  };

  const handleAdditionalFileUpload = (file: File) => {
    setFiles(prev => ({
      ...prev,
      additionalDocuments: [...prev.additionalDocuments, file],
    }));
  };

  const handleRemoveAdditionalFile = (index: number) => {
    setFiles(prev => ({
      ...prev,
      additionalDocuments: prev.additionalDocuments.filter((_: any, i:any) => i !== index),
    }));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          {/* Resume Upload */}
          <div>
            <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume/CV *</FormLabel>
                  <FormControl>
                    <FileUpload
                      onFileUpload={(file) => handleFileUpload(file, 'resume')}
                      acceptedTypes={Object.keys(ACCEPTED_FILE_TYPES)}
                      maxSize={MAX_FILE_SIZE}
                      label="Resume/CV"
                      required
                      currentFile={files.resume}
                      onRemove={() => handleRemoveFile('resume')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Cover Letter Upload */}
          <div>
            <FormField
              control={form.control}
              name="coverLetter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Letter (Optional)</FormLabel>
                  <FormControl>
                    <FileUpload
                      onFileUpload={(file) => handleFileUpload(file, 'coverLetter')}
                      acceptedTypes={Object.keys(ACCEPTED_FILE_TYPES)}
                      maxSize={MAX_FILE_SIZE}
                      label="Cover Letter"
                      currentFile={files.coverLetter}
                      onRemove={() => handleRemoveFile('coverLetter')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Additional Documents */}
          <div>
            <Label>Additional Documents (Optional)</Label>
            <p className="text-sm text-gray-500 mb-4">
              Upload any additional documents such as certificates, portfolio, or references.
            </p>
            
            <FileUpload
              onFileUpload={handleAdditionalFileUpload}
              acceptedTypes={Object.keys(ACCEPTED_FILE_TYPES)}
              maxSize={MAX_FILE_SIZE}
              label="Additional Document"
            />

            {files.additionalDocuments.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.additionalDocuments.map((file: File, index: number) => (
                  <Card key={index} className="border-blue-200 bg-blue-50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-900 text-sm">{file.name}</p>
                            <p className="text-xs text-blue-700">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAdditionalFile(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Upload Guidelines */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-900 mb-2">Upload Guidelines</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Maximum file size: 5MB per file</li>
                <li>• Accepted formats: PDF, DOC, DOCX</li>
                <li>• Resume/CV is required</li>
                <li>• Ensure all documents are clearly readable</li>
                <li>• Remove any sensitive personal information (SSN, etc.)</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onPrev}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button type="submit" disabled={!files.resume}>
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}