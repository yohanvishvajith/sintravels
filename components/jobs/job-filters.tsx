'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/use-debounce';
import { useEffect } from 'react';

interface JobFiltersProps {
  filters: {
    search: string;
    country: string;
    industry: string;
    experience: string;
    salary: number[];
    type: string;
    remote: boolean;
  };
  onFiltersChange: (filters: any) => void;
}

const countries = [
  { value: 'Singapore', label: 'Singapore', flag: '🇸🇬' },
  { value: 'Canada', label: 'Canada', flag: '🇨🇦' },
  { value: 'Australia', label: 'Australia', flag: '🇦🇺' },
  { value: 'UAE', label: 'United Arab Emirates', flag: '🇦🇪' },
  { value: 'UK', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'USA', label: 'United States', flag: '🇺🇸' },
];

const industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'Marketing',
  'Engineering',
  'Education',
  'Retail',
  'Manufacturing',
];

const experiences = [
  'Entry-level',
  'Mid-level',
  'Senior',
  'Executive',
];

const jobTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
];

export function JobFilters({ filters, onFiltersChange }: JobFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    onFiltersChange({ ...filters, search: debouncedSearch });
  }, [debouncedSearch]);

  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setLocalSearch('');
    onFiltersChange({
      search: '',
      country: '',
      industry: '',
      experience: '',
      salary: [0, 200000],
      type: '',
      remote: false,
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => {
    if (typeof value === 'string') return value !== '';
    if (typeof value === 'boolean') return value;
    if (Array.isArray(value)) return value[0] !== 0 || value[1] !== 200000;
    return false;
  }).length;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Job title, company..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label>Country</Label>
          <Select value={filters.country} onValueChange={(value) => updateFilter('country', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  <div className="flex items-center space-x-2">
                    <span>{country.flag}</span>
                    <span>{country.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Industry */}
        <div className="space-y-2">
          <Label>Industry</Label>
          <Select value={filters.industry} onValueChange={(value) => updateFilter('industry', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <Label>Experience Level</Label>
          <Select value={filters.experience} onValueChange={(value) => updateFilter('experience', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent>
              {experiences.map((experience) => (
                <SelectItem key={experience} value={experience}>
                  {experience}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Job Type */}
        <div className="space-y-2">
          <Label>Job Type</Label>
          <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              {jobTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Salary Range */}
        <div className="space-y-2">
          <Label>Salary Range (USD)</Label>
          <div className="px-2">
            <Slider
              value={filters.salary}
              onValueChange={(value) => updateFilter('salary', value)}
              max={200000}
              min={0}
              step={5000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>${filters.salary[0].toLocaleString()}</span>
              <span>${filters.salary[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Remote Work */}
        <div className="flex items-center justify-between">
          <Label htmlFor="remote">Remote Work Only</Label>
          <Switch
            id="remote"
            checked={filters.remote}
            onCheckedChange={(checked) => updateFilter('remote', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}