"use client";

import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { DataTable } from "~/components/shared/DataTable";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { useLeases } from "~/lib/query/leases";
import { LEASE_STATUSES } from "~/schemas/lease";
import { LeaseStatus, LeaseWithDetails } from "~/types/lease";
import { createLeaseColumns } from "./LeaseColumns";
import LeaseDialog from "./LeaseDialog";
import { formatCurrency } from "~/lib/utils";

export function LeasesTable() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [terminateDialog, setTerminateDialog] = useState<{
    open: boolean;
    leaseId: string;
    lease?: LeaseWithDetails;
  }>({ open: false, leaseId: "" });
  const [renewDialog, setRenewDialog] = useState<{
    open: boolean;
    leaseId: string;
    lease?: LeaseWithDetails;
  }>({ open: false, leaseId: "" });

  const {
    data: leasesData,
    isLoading,
    refetch,
  } = useLeases({
    status: statusFilter !== "all" ? (statusFilter as LeaseStatus) : undefined,
    search: searchQuery || undefined,
  });

  const leases = leasesData || [];

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

  const handleTerminate = useCallback(
    (leaseId: string) => {
      const lease = leases.find((l) => String(l.id) === leaseId);
      setTerminateDialog({ open: true, leaseId, lease });
    },
    [leases]
  );

  const handleRenew = useCallback(
    (leaseId: string) => {
      const lease = leases.find((l) => String(l.id) === leaseId);
      setRenewDialog({ open: true, leaseId, lease });
    },
    [leases]
  );

  const columns = useMemo(
    () => createLeaseColumns(handleTerminate, handleRenew),
    [handleTerminate, handleRenew]
  );

  // Custom search component for desktop
  const customSearchComponent = useMemo(
    () => (
      <div className="flex gap-2">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search leases..."
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
        <Link href="/leases/add">
          <Button
            size="sm"
            className="h-8 rounded-sm bg-slate-900 text-white hover:bg-slate-800 gap-2"
          >
            <Plus className="h-3 w-3" />
            New Lease
          </Button>
        </Link>
      </div>
    ),
    []
  );

  const loadingSkeletons = (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-sm" />
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

  // Mobile/Card View Content
  const mobileView = (
    <div className="lg:hidden space-y-4">
      <div className="space-y-4 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">
            Leases ({leases.length})
          </h2>
          <Link href="/leases/add">
            <Button
              size="sm"
              className="h-8 rounded-sm bg-slate-900 text-white hover:bg-slate-800"
            >
              <Plus className="h-3 w-3 mr-1" /> New
            </Button>
          </Link>
        </div>

        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search leases..."
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
              {LEASE_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {leases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-sm border border-dashed border-slate-200">
          <Calendar className="h-8 w-8 text-slate-300 mb-2" />
          <p className="text-slate-500 font-medium">No leases found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leases.map((lease) => (
            <Card
              key={lease.id}
              className="rounded-lg border border-slate-200 shadow-sm overflow-hidden"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                      {lease.tenant?.fullName?.charAt(0) || "?"}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {lease.tenant?.fullName || "Unknown Tenant"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {lease.property?.name || "Unknown Property"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`capitalize ${
                      lease.status === "active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : lease.status === "pending"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {lease.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-xs text-slate-500 mb-4">
                  <div>
                    <span className="block font-medium text-slate-700">
                      Duration
                    </span>
                    {new Date(lease.startDate).toLocaleDateString()} -{" "}
                    {new Date(lease.endDate).toLocaleDateString()}
                  </div>
                  <div className="text-right">
                    <span className="block font-medium text-slate-700">
                      Rent
                    </span>
                    {formatCurrency(Number(lease.rentAmount))}/
                    {lease.billingCycle}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/leases/${lease.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full h-8 text-xs border-slate-200"
                    >
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {mobileView}

      {/* Desktop View */}
      <div className="hidden lg:block">
        <DataTable
          columns={columns}
          data={leases}
          title="Leases"
          showCount
          searchable={false} // We use our custom search
          filterable
          filterOptions={[
            {
              label: "Status",
              value: statusFilter,
              options: [
                { label: "All Status", value: "all" },
                ...LEASE_STATUSES.map((s) => ({
                  label: s.label,
                  value: s.value,
                })),
              ],
              onChange: setStatusFilter,
            },
          ]}
          customSearch={customSearchComponent}
          customActions={customActions}
          pagination
          pageSize={10}
          containerClassName="rounded-lg border border-slate-200 bg-white shadow-sm"
        />
      </div>

      {/* Terminate Dialog */}
      <LeaseDialog
        type="TERMINATE"
        open={terminateDialog.open}
        onOpenChange={(open) => {
          if (!open) setTerminateDialog({ open: false, leaseId: "" });
        }}
        leaseId={terminateDialog.leaseId}
        lease={terminateDialog.lease || null}
        onSuccess={refetch}
      />

      {/* Renew Dialog */}
      <LeaseDialog
        type="RENEW"
        open={renewDialog.open}
        onOpenChange={(open) => {
          if (!open) setRenewDialog({ open: false, leaseId: "" });
        }}
        leaseId={renewDialog.leaseId}
        lease={renewDialog.lease || null}
        onSuccess={refetch}
      />
    </>
  );
}
