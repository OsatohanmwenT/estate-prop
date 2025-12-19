"use client";

import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  ChevronRight,
  Edit,
  FileText,
  Home,
  MoreVertical,
  RefreshCw,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { LeaseDialogs } from "~/components/leases/details/LeaseDialogs";
import { LeaseDocuments } from "~/components/leases/details/LeaseDocuments";
import { LeaseFinancialCard } from "~/components/leases/details/LeaseFinancialCard";
import { LeaseTimeline } from "~/components/leases/details/LeaseTimeline";
import MaxContainer from "~/components/shared/MaxContainer";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";
import {
  useLeaseById,
  useRenewLease,
  useTerminateLease,
} from "~/lib/query/leases";
import { cn, formatDate } from "~/lib/utils";
import { calculateDaysRemaining } from "~/schemas/lease";

export default function LeaseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const leaseId = params.id as string;

  const { data: leaseData, isLoading, error } = useLeaseById(leaseId);
  const terminateLease = useTerminateLease();
  const renewLease = useRenewLease();

  const [terminateDialog, setTerminateDialog] = useState(false);
  const [renewDialog, setRenewDialog] = useState(false);
  const [terminationReason, setTerminationReason] = useState("");

  const lease = leaseData;

  if (isLoading) {
    return <LeaseDetailsSkeleton />;
  }

  if (error || !lease) {
    return (
      <MaxContainer>
        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
          <div className="bg-slate-50 p-6 rounded-full">
            <FileText className="h-10 w-10 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Lease Not Found
          </h2>
          <p className="text-slate-500 max-w-sm">
            The lease agreement you are looking for does not exist or has been
            removed.
          </p>
          <Link href="/leases">
            <Button variant="outline">Back to Leases</Button>
          </Link>
        </div>
      </MaxContainer>
    );
  }

  const isActive = lease.status === "active";
  const daysRemaining = calculateDaysRemaining(lease.endDate);

  const rentAmount = parseFloat(lease.rentAmount);
  const cautionDeposit = lease.cautionDeposit
    ? parseFloat(lease.cautionDeposit)
    : 0;
  const agencyFee = lease.agencyFee ? parseFloat(lease.agencyFee) : 0;
  const legalFee = lease.legalFee ? parseFloat(lease.legalFee) : 0;

  const handleTerminate = async () => {
    try {
      await terminateLease.mutateAsync({
        id: leaseId,
        data: {
          terminationDate: new Date().toISOString().split("T")[0],
          reason: terminationReason,
        },
      });
      toast.success("Lease terminated successfully");
      setTerminateDialog(false);
      router.push("/leases");
    } catch {
      toast.error("Failed to terminate lease");
    }
  };

  const handleRenew = async () => {
    const startDate = new Date(lease.endDate);
    startDate.setDate(startDate.getDate() + 1);
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);

    try {
      await renewLease.mutateAsync({
        id: leaseId,
        data: {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          rentAmount: rentAmount,
          billingCycle: lease.billingCycle as any,
        },
      });
      toast.success("Lease renewed successfully");
      setRenewDialog(false);
      router.push("/leases");
    } catch {
      toast.error("Failed to renew lease");
    }
  };

  const renewStartDate = new Date(lease.endDate);
  renewStartDate.setDate(renewStartDate.getDate() + 1);

  return (
    <MaxContainer className="!px-0 !pt-0">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-7 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500 mb-4">
            <Link
              href="/dashboard"
              className="hover:text-slate-900 transition-colors flex items-center gap-1"
            >
              <Home className="h-3 w-3" />
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <Link
              href="/leases"
              className="hover:text-slate-900 transition-colors"
            >
              Leases
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-slate-900 font-semibold">Lease Details</span>
          </div>

          {/* Title & Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="flex items-start gap-4">
              <Link href="/leases">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-sm border-slate-200 hover:bg-slate-50 shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-sm text-[10px] uppercase px-2 py-0.5 font-bold tracking-wider border text-slate-900",
                      isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-50 text-slate-500 border-slate-200"
                    )}
                  >
                    {isActive ? "Active Lease" : lease.status}
                  </Badge>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    #{lease.id.slice(0, 8)}
                  </span>
                </div>
                <h1 className="text-3xl font-light text-slate-900 tracking-tight">
                  {lease.tenant?.fullName || "Unknown Tenant"}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
                  {lease.property && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span>{lease.property.name}</span>
                    </div>
                  )}
                  {lease.unit && (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 flex items-center justify-center border border-slate-300 rounded-[2px] text-[8px] font-bold text-slate-500">
                        U
                      </div>
                      <span>Unit {lease.unit.code}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>
                      {formatDate(lease.startDate)} -{" "}
                      {formatDate(lease.endDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {isActive ? (
                <>
                  <Button
                    variant="outline"
                    className="h-10 rounded-sm border-slate-200 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 uppercase text-xs font-bold tracking-wider transition-colors"
                    onClick={() => setRenewDialog(true)}
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-2" />
                    Renew
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-10 w-10 p-0 rounded-sm border-slate-200 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/leases/${lease.id}/edit`}>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Lease
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setTerminateDialog(true)}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Terminate Lease
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button
                  disabled
                  variant="outline"
                  className="opacity-50 cursor-not-allowed bg-slate-50"
                >
                  Lease Inactive
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content - 8/4 Split Layout */}
        <div className="px-4 sm:px-7 pb-12">
          {/* Alert for expiration */}
          {isActive && daysRemaining <= 30 && daysRemaining > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 flex items-center gap-3 mb-8">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <div className="flex-1">
                <p className="font-bold text-amber-800 text-sm uppercase tracking-wider">
                  Expiring Soon
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  This lease expires in {daysRemaining} days.
                </p>
              </div>
              <Button
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white border-0 rounded-sm text-xs uppercase font-bold tracking-wider h-8"
                onClick={() => setRenewDialog(true)}
              >
                Renew Now
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* LEFT COLUMN (Wider) */}
            <div className="lg:col-span-8 space-y-12">
              {/* Timeline (Clean Section) */}
              <LeaseTimeline
                startDate={lease.startDate}
                endDate={lease.endDate}
                billingCycle={lease.billingCycle}
                isActive={isActive}
                daysRemaining={daysRemaining}
              />

              {/* Occupant & Property Info (Clean Section) */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3">
                  Lease Entities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Tenant Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Occupant
                      </span>
                    </div>
                    <div className="pl-6 border-l-2 border-slate-100 space-y-3">
                      <div>
                        <p className="font-bold text-slate-900">
                          {lease.tenant?.fullName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {lease.tenant?.email}
                        </p>
                        <p className="text-xs text-slate-500">
                          {lease.tenant?.phone}
                        </p>
                      </div>
                      <Link href={`/tenants/${lease.tenant?.id}`}>
                        <Button
                          variant="link"
                          className="h-auto p-0 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900"
                        >
                          View Profile <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Property Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Property
                      </span>
                    </div>
                    <div className="pl-6 border-l-2 border-slate-100 space-y-3">
                      <div>
                        <p className="font-bold text-slate-900">
                          {lease.property?.name}
                        </p>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {lease.property?.address}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <Link href={`/properties/${lease.property?.id}`}>
                          <Button
                            variant="link"
                            className="h-auto p-0 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900"
                          >
                            View Property{" "}
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes (Clean Section) */}
              {lease.notes && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    Notes
                  </h3>
                  <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {lease.notes}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN (Sidebar) */}
            <div className="lg:col-span-4 space-y-8">
              <LeaseFinancialCard
                rentAmount={rentAmount}
                cautionDeposit={cautionDeposit}
                agencyFee={agencyFee}
                legalFee={legalFee}
              />

              <LeaseDocuments agreementUrl={lease.agreementUrl} />
            </div>
          </div>
        </div>
      </div>

      <LeaseDialogs
        leaseId={leaseId}
        terminateOpen={terminateDialog}
        onTerminateOpenChange={setTerminateDialog}
        terminationReason={terminationReason}
        onTerminationReasonChange={setTerminationReason}
        onTerminateConfirm={handleTerminate}
        isTerminating={terminateLease.isPending}
        renewOpen={renewDialog}
        onRenewOpenChange={setRenewDialog}
        onRenewConfirm={handleRenew}
        isRenewing={renewLease.isPending}
        renewData={{
          startDate: renewStartDate.toISOString(),
          rentAmount: rentAmount,
        }}
      />
    </MaxContainer>
  );
}

function LeaseDetailsSkeleton() {
  return (
    <MaxContainer className="!px-0">
      <div className="space-y-8">
        <div className="bg-white border-b border-slate-200 px-4 sm:px-7 py-6">
          <Skeleton className="h-4 w-64 mb-4" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-96" />
              <Skeleton className="h-5 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="px-4 sm:px-7">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              <Skeleton className="h-48 w-full rounded-sm" />
              <div className="grid grid-cols-2 gap-8">
                <Skeleton className="h-32 w-full rounded-sm" />
                <Skeleton className="h-32 w-full rounded-sm" />
              </div>
            </div>
            <div className="lg:col-span-4 space-y-8">
              <Skeleton className="h-64 w-full rounded-sm" />
              <Skeleton className="h-24 w-full rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </MaxContainer>
  );
}
