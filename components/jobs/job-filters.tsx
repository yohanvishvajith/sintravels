"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect } from "react";

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

const countriesFallback = [
  { value: "Singapore", label: "Singapore", flag: "🇸🇬" },
  { value: "Canada", label: "Canada", flag: "🇨🇦" },
  { value: "Australia", label: "Australia", flag: "🇦🇺" },
  { value: "UAE", label: "United Arab Emirates", flag: "🇦🇪" },
  { value: "UK", label: "United Kingdom", flag: "🇬🇧" },
  { value: "USA", label: "United States", flag: "🇺🇸" },
];

const industriesFallback = [
  "Technology",
  "Finance",
  "Healthcare",
  "Marketing",
  "Engineering",
  "Education",
  "Retail",
  "Manufacturing",
];

const experiences = ["Entry-level", "Mid-level", "Senior", "Executive"];

const jobTypes = ["Full-time", "Part-time", "Contract", "Freelance"];

export function JobFilters({ filters, onFiltersChange }: JobFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(localSearch, 300);
  const [countriesList, setCountriesList] = useState<
    {
      value: string;
      label: string;
      flag?: string | null;
    }[]
  >(countriesFallback);
  const [industriesList, setIndustriesList] =
    useState<string[]>(industriesFallback);

  useEffect(() => {
    onFiltersChange({ ...filters, search: debouncedSearch });
  }, [debouncedSearch]);

  // Load real countries and industries from admin APIs
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/countries");
        const data = await res.json();
        if (mounted && data?.ok && Array.isArray(data.countries)) {
          const mapped = data.countries.map((c: any) => ({
            value: String(c.name),
            label: String(c.name),
            flag: c.flagimg || null,
          }));
          setCountriesList(mapped);
        }
      } catch (e) {
        // ignore and use fallback
      }
    })();

    (async () => {
      try {
        const res = await fetch("/api/admin/industries");
        const data = await res.json();
        if (mounted && data?.ok && Array.isArray(data.industries)) {
          setIndustriesList(data.industries.map((i: any) => String(i.name)));
        }
      } catch (e) {
        // ignore and use fallback
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setLocalSearch("");
    onFiltersChange({
      search: "",
      country: "",
      industry: "",
      experience: "",
      salary: [0, 200000],
      type: "",
      remote: false,
    });
  };

  const activeFiltersCount = Object.values(filters).filter((value) => {
    if (typeof value === "string") return value !== "";
    if (typeof value === "boolean") return value;
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
          <Select
            value={filters.country}
            onValueChange={(value: string) => updateFilter("country", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countriesList.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  <div className="flex items-center space-x-2">
                    <span>
                      {country.flag &&
                      (country.flag.startsWith("http") ||
                        country.flag.startsWith("/")) ? (
                        <img
                          src={country.flag}
                          alt={`${country.label} flag`}
                          className="h-4 w-6 object-cover"
                        />
                      ) : (
                        country.flag ?? ""
                      )}
                    </span>
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
          <Select
            value={filters.industry}
            onValueChange={(value: string) => updateFilter("industry", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industriesList.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
