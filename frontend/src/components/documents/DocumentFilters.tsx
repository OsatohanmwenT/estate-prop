"use client";

import { Grid, List, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { DOCUMENT_CATEGORIES } from "~/constants/document";

interface DocumentFiltersProps {
  search: string;
  category: string;
  viewMode: "grid" | "list";
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onViewModeChange: (mode: "grid" | "list") => void;
}

export function DocumentFilters({
  search,
  category,
  viewMode,
  onSearchChange,
  onCategoryChange,
  onViewModeChange,
}: DocumentFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 border-slate-200 rounded-sm text-sm focus-visible:ring-1 focus-visible:ring-slate-400"
          />
        </div>

        {/* Category Filter */}
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-[180px] h-9 border-slate-200 rounded-sm text-sm">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {DOCUMENT_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-1 border border-slate-200 rounded-sm p-1 bg-white">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewModeChange("grid")}
          className={`h-7 w-7 p-0 rounded-sm ${
            viewMode === "grid"
              ? "bg-slate-100 text-slate-900"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewModeChange("list")}
          className={`h-7 w-7 p-0 rounded-sm ${
            viewMode === "list"
              ? "bg-slate-100 text-slate-900"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
