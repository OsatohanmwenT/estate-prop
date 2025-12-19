"use client";

import { Download, Plus, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { DataTable } from "~/components/shared/DataTable";
import { tenantColumns } from "~/components/tenants/TenantsTable";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useTenants } from "~/lib/query/tenants";
import { TenantWithDetails } from "~/types/tenant";
import { PersonCard } from "./PersonCard";
import { Skeleton } from "../ui/skeleton";

export function TenantsList() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: tenants, isLoading } = useTenants(searchQuery);

  const filteredData = useMemo(() => {
    if (!tenants) return [];
    let filtered = tenants;

    if (statusFilter !== "all") {
      filtered = filtered.filter((tenant) => tenant.status === statusFilter);
    }

    return filtered;
  }, [tenants, statusFilter]);

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
    setStatusFilter("all");
    setSearchQuery("");
    setSearchInput("");
  }, []);

  // Custom search component for desktop
  const customSearchComponent = useMemo(
    () => (
      <div className="flex gap-2">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search tenants..."
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

  // Custom actions for desktop
  const customActions = useMemo(
    () => (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-sm border-slate-200 text-xs font-medium uppercase tracking-wider"
        >
          <SlidersHorizontal className="h-3 w-3 mr-2" /> Filter
        </Button>
        <Link href="/tenants/add">
          <Button
            size="sm"
            className="h-8 rounded-sm bg-slate-900 text-white hover:bg-slate-800 gap-2"
          >
            <Plus className="h-3 w-3" />
            Add Tenant
          </Button>
        </Link>
      </div>
    ),
    []
  );

  const loadingSkeletons = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="h-[200px] w-full rounded-sm" />
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <>
        <div className="lg:hidden">{loadingSkeletons}</div>
        <div className="hidden lg:block space-y-4">
          <Skeleton className="h-12 w-full rounded-sm" />
          <Skeleton className="h-64 w-full rounded-sm" />
        </div>
      </>
    );
  }

  // Mobile View Content
  const mobileView = (
    <div className="lg:hidden space-y-4">
      <div className="space-y-4 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">
            Tenants ({filteredData.length})
          </h2>
          <Link href="/tenants/add">
            <Button
              size="sm"
              className="h-8 rounded-sm bg-slate-900 text-white hover:bg-slate-800"
            >
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </Link>
        </div>

        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search tenants..."
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="flex-1 bg-white border-slate-200 rounded-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="border-slate-200">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-sm border border-dashed border-slate-200">
          <p className="text-slate-500 font-medium">No tenants found.</p>
        </div>
      ) : (
        <div className="flex flex-col space-y-3">
          {filteredData.map((tenant: TenantWithDetails) => (
            <PersonCard
              key={tenant.id}
              id={tenant.id}
              name={tenant.fullName}
              role="tenant"
              email={tenant.email}
              phone={tenant.phone}
              avatarUrl={tenant.avatarUrl}
              propertiesCount={(tenant as any).propertiesCount || 1}
              unitsCount={(tenant as any).unitsCount || 1}
              leaseType="Standard Lease"
              subText={tenant.status || "Active"}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {mobileView}

      {/* Desktop List View */}
      <div className="hidden lg:block">
        <DataTable
          columns={tenantColumns}
          data={filteredData}
          title="Tenants"
          showCount
          searchable={false}
          filterable
          // We can add filter options for DataTable here later if needed to match PropertiesTable's desktopFilterOptions
          filterOptions={[
            {
              label: "Status",
              value: statusFilter,
              options: [
                { label: "All Status", value: "all" },
                { label: "Active", value: "active" },
                { label: "Overdue", value: "overdue" },
                { label: "Terminated", value: "terminated" },
              ],
              onChange: setStatusFilter,
            },
          ]}
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
}
