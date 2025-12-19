"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AddLeaseForm } from "~/components/leases/AddLeaseForm";
import MaxContainer from "~/components/shared/MaxContainer";
import { Skeleton } from "~/components/ui/skeleton";
import { useLeaseById, useUpdateLease } from "~/lib/query/leases";
import { CreateLeaseFormData } from "~/schemas/lease";

export default function EditLeasePage() {
  const params = useParams();
  const router = useRouter();
  const leaseId = params.id as string;

  const { data: lease, isLoading } = useLeaseById(leaseId, !!leaseId);
  const updateLease = useUpdateLease();

  const handleSubmit = async (data: CreateLeaseFormData) => {
    try {
      await updateLease.mutateAsync({
        id: leaseId,
        data,
      });
      toast.success("Lease updated successfully");
      router.push("/leases");
    } catch (error: any) {
      toast.error(error.message || "Failed to update lease");
    }
  };

  if (isLoading) {
    return (
      <MaxContainer className="!px-0">
        <div className="bg-white border-b border-slate-200 px-4 sm:px-7 py-4 mb-8">
          <div className="max-w-[1600px] mx-auto">
            <Skeleton className="h-8 w-48" />
          </div>
        </div>
        <div className="px-4 sm:px-7 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </MaxContainer>
    );
  }

  if (!lease) {
    return (
      <MaxContainer className="!px-0">
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Lease not found</p>
        </div>
      </MaxContainer>
    );
  }

  const initialData = {
    propertyId: lease.property?.id || "",
    unitId: String(lease.unitId),
    tenantId: lease.tenantId,
    rentAmount: Number(lease.rentAmount),
    billingCycle: lease.billingCycle,
    startDate: lease.startDate,
    endDate: lease.endDate,
    agencyFee: lease.agencyFee ? Number(lease.agencyFee) : undefined,
    legalFee: lease.legalFee ? Number(lease.legalFee) : undefined,
    cautionDeposit: lease.cautionDeposit
      ? Number(lease.cautionDeposit)
      : undefined,
    agreementUrl: lease.agreementUrl || undefined,
    notes: lease.notes || undefined,
  };

  return (
    <MaxContainer className="!px-0">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-7 py-4 mb-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col gap-4">
            <Link
              href="/leases"
              className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors w-fit uppercase tracking-wider"
            >
              <ChevronLeft className="h-3 w-3" />
              Back to Leases
            </Link>

            <div>
              <h1 className="text-xl font-bold uppercase tracking-wide text-slate-900">
                Edit Lease
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Update lease agreement details
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 sm:px-7 pb-20">
        <AddLeaseForm
          onSubmit={handleSubmit}
          initialData={initialData}
          isEditMode={true}
        />
      </div>
    </MaxContainer>
  );
}
