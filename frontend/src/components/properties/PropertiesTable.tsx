"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useProperties } from "~/lib/query";
import { Property } from "~/types/property";
import { DataTable } from "../shared/DataTable";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PropertiesTableSkeleton } from "./PropertiesTableSkeleton";
import { PropertyCard } from "./PropertyCard";
import { propertyColumns } from "./PropertyColumns";

const PropertiesTable = () => {
  const [propertyType, setPropertyType] = useState<string>("all");
  const [propertyStatus, setPropertyStatus] = useState<string>("all");
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data, isLoading, error } = useProperties({
    search: searchQuery,
    category: propertyType,
  });

  const propertiesList = useMemo(() => {
    return Array.isArray(data) ? data : data?.data || [];
  }, [data]);

  const filteredData = useMemo(() => {
    return propertiesList.filter((property: Property) => {
      const matchesType =
        propertyType === "all" || property.category === propertyType;
      const matchesStatus =
        propertyStatus === "all" || property.status === propertyStatus;
      return matchesType && matchesStatus;
    });
  }, [propertiesList, propertyType, propertyStatus]);

  // Memoize callbacks
  const handleSearch = useCallback(() => {
    setSearchQuery(searchInput);
  }, [searchInput]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        setSearchQuery(searchInput);
      }
    },
    [searchInput]
  );

  const handleClearFilters = useCallback(() => {
    setPropertyType("all");
    setPropertyStatus("all");
  }, []);

  // Memoize filter options to prevent recreating on every render
  const desktopFilterOptions = useMemo(
    () => [
      {
        label: "Property Type",
        value: propertyType,
        options: [
          { label: "All Types", value: "all" },
          { label: "Residential", value: "residential" },
          { label: "Commercial", value: "commercial" },
          { label: "Industrial", value: "industrial" },
          { label: "Land", value: "land" },
        ],
        onChange: setPropertyType,
      },
      {
        label: "Property Status",
        value: propertyStatus,
        options: [
          { label: "All Status", value: "all" },
          { label: "Available", value: "available" },
          { label: "Occupied", value: "occupied" },
          { label: "Maintenance", value: "maintenance" },
        ],
        onChange: setPropertyStatus,
      },
    ],
    [propertyType, propertyStatus]
  );

  // Custom search component for desktop
  const customSearchComponent = useMemo(
    () => (
      <div className="flex gap-2">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search properties..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-8 text-sm bg-white border-slate-200 rounded-sm focus:border-slate-900"
          />
        </div>
        <Button
          onClick={handleSearch}
          size="sm"
          className="h-8 rounded-sm bg-slate-900 text-white hover:bg-slate-800"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    ),
    [searchInput, handleKeyDown, handleSearch]
  );

  // Memoize custom actions
  const customActions = useMemo(
    () => (
      <Button
        variant="outline"
        size="sm"
        className="h-8 rounded-sm border-slate-200 text-xs font-medium uppercase tracking-wider"
      >
        <SlidersHorizontal className="h-3 w-3 mr-2" /> Filter View
      </Button>
    ),
    []
  );

  if (isLoading) {
    return <PropertiesTableSkeleton rows={5} />;
  }

  if (error) {
    console.error("Properties error:", error);
    return (
      <div className="rounded-sm border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-red-600 font-medium">
          Failed to load properties:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  // Show empty state if no properties
  if (propertiesList.length === 0) {
    return (
      <div className="rounded-sm border border-slate-200 bg-white">
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="rounded-sm bg-slate-50 p-6 mb-4 border border-slate-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-300"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-2">
            No properties yet
          </h3>
          <p className="text-slate-500 text-center max-w-sm mb-6 text-sm">
            Get started by adding your first property to begin managing your
            real estate portfolio.
          </p>
          <Button
            asChild
            className="rounded-sm border-slate-200"
            variant="outline"
          >
            <a href="/properties/add">Add Your First Property</a>
          </Button>
        </div>
      </div>
    );
  }

  // Show empty state for filtered results
  if (filteredData.length === 0) {
    return (
      <div className="rounded-sm border border-slate-200 bg-white">
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="rounded-sm border-slate-200 text-xs font-medium uppercase tracking-wider"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="rounded-sm bg-slate-50 p-4 mb-4 border border-slate-100">
            <SlidersHorizontal className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-2">
            No properties found
          </h3>
          <p className="text-slate-500 text-center max-w-sm text-sm">
            No properties match your current filters. Try adjusting your search
            criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile/Tablet List View - Below md */}
      <div className="lg:hidden space-y-4">
        <div className="space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">
              Properties ({filteredData.length})
            </h2>
          </div>

          {/* Search Input with Button */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search properties..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-9 bg-white border-slate-200 rounded-sm focus:border-slate-900"
              />
            </div>
            <Button
              onClick={handleSearch}
              size="default"
              className="rounded-sm bg-slate-900 text-white hover:bg-slate-800"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="flex-1 bg-white border-slate-200 rounded-sm">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent className="border-slate-200">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="mixed_use">Mixed Use</SelectItem>
              </SelectContent>
            </Select>

            <Select value={propertyStatus} onValueChange={setPropertyStatus}>
              <SelectTrigger className="flex-1 bg-white border-slate-200 rounded-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="border-slate-200">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="vacant">Vacant</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          {filteredData.map((property) => (
            <PropertyCard key={property?.id} property={property} />
          ))}
        </div>
      </div>

      {/* Desktop Table View - md and above */}
      <div className="hidden lg:block">
        <DataTable
          columns={propertyColumns}
          data={filteredData}
          title="Properties"
          showCount
          searchable={false}
          filterable
          filterOptions={desktopFilterOptions}
          customSearch={customSearchComponent}
          customActions={customActions}
          pagination
          className=""
          containerClassName="border rounded-sm shadow-sm"
          pageSize={20}
        />
      </div>
    </>
  );
};

export default PropertiesTable;
