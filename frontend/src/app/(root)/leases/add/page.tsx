"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AddLeaseForm } from "~/components/leases/AddLeaseForm";
import MaxContainer from "~/components/shared/MaxContainer";
import { Skeleton } from "~/components/ui/skeleton";
import { usePropertyById, usePropertyUnits } from "~/lib/query";
import { useCreateLease, useLeaseById } from "~/lib/query/leases";
import { CreateLeaseFormData } from "~/schemas/lease";

export default function AddLeasePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const renewFromId = searchParams.get("renewFrom");
  const unitIdParam = searchParams.get("unitId");
  const propertyIdParam = searchParams.get("propertyId");

  const createLease = useCreateLease();

  const { data: existingLease, isLoading: isLoadingLease } = useLeaseById(
    renewFromId || "",
    !!renewFromId
  );

  // Fetch property and unit data if coming from unit assignment
  const { data: property, isLoading: isLoadingProperty } = usePropertyById(
    propertyIdParam || "",
    !!propertyIdParam
  );

  const { data: units = [], isLoading: isLoadingUnits } = usePropertyUnits(
    propertyIdParam || "",
    !!propertyIdParam
  );

  const unit = units.find((u) => u.id === unitIdParam);

  const handleSubmit = async (data: CreateLeaseFormData) => {
    try {
      const result = await createLease.mutateAsync(data);

      // Show success message with invoice info
      toast.success(
        unitIdParam
          ? `Tenant assigned successfully - Lease created in draft status. Invoice ${result.invoice.id.slice(0, 8)} generated for ₦${parseFloat(result.invoice.amount).toLocaleString()}`
          : `Lease offer created successfully! Invoice generated for ₦${parseFloat(result.invoice.amount).toLocaleString()}. The lease will activate once payment is received.`
      );

      // If came from unit assignment, go back to unit
      if (unitIdParam && propertyIdParam) {
        router.push(`/properties/${propertyIdParam}/units/${unitIdParam}`);
      } else {
        // Go to the new lease details page
        router.push(`/leases/${result.lease.id}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create lease");
    }
  };

  // Prepare initial data
  const initialData = existingLease
    ? {
        propertyId: existingLease.property?.id || "",
        unitId: String(existingLease.unitId),
        tenantId: existingLease.tenantId,
        rentAmount: Number(existingLease.rentAmount),
        billingCycle: existingLease.billingCycle,
        startDate: new Date(
          new Date(existingLease.endDate).setDate(
            new Date(existingLease.endDate).getDate() + 1
          )
        )
          .toISOString()
          .split("T")[0],
      }
    : unitIdParam && propertyIdParam
      ? {
          propertyId: propertyIdParam,
          unitId: unitIdParam,
        }
      : undefined;

  const isLoading =
    isLoadingLease || (unitIdParam && (isLoadingProperty || isLoadingUnits));

  return (
    <MaxContainer className="!px-0">
      {/* Linear Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-7 py-4 mb-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col gap-4">
            {/* Breadcrumb - only show if coming from unit */}
            {unitIdParam && propertyIdParam && (
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                <Link
                  href="/properties"
                  className="hover:text-slate-900 transition-colors"
                >
                  Portfolio
                </Link>
                <ChevronRight className="h-3 w-3" />
                <Link
                  href={`/properties/${propertyIdParam}`}
                  className="hover:text-slate-900 transition-colors"
                >
                  {isLoading ? "..." : property?.name || "Property"}
                </Link>
                <ChevronRight className="h-3 w-3" />
                <Link
                  href={`/properties/${propertyIdParam}/units/${unitIdParam}`}
                  className="hover:text-slate-900 transition-colors"
                >
                  {isLoading ? "..." : `Unit ${unit?.code}` || "Unit"}
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-slate-900">Assign Tenant</span>
              </div>
            )}

            {/* Back Link */}
            <Link
              href={
                unitIdParam && propertyIdParam
                  ? `/properties/${propertyIdParam}/units/${unitIdParam}`
                  : "/leases"
              }
              className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors w-fit"
            >
              <ChevronLeft className="h-3 w-3" />
              {unitIdParam ? "Back to Unit Details" : "Back to Leases"}
            </Link>

            <div>
              <h1 className="text-xl font-bold uppercase tracking-wide text-slate-900">
                {renewFromId
                  ? "Renew Lease"
                  : unitIdParam
                    ? "Assign Tenant to Unit"
                    : "Create New Lease"}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {renewFromId
                  ? "Create a renewal lease based on existing terms"
                  : unitIdParam && !isLoading
                    ? `Create a lease agreement to assign a tenant to ${property?.name} - Unit ${unit?.code}`
                    : unitIdParam
                      ? "Loading unit information..."
                      : "Set up a new lease agreement between a tenant and a property unit"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-7 max-w-[1600px] mx-auto pb-12">
        {isLoading ? (
          <div className="space-y-6 max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-sm border border-slate-200 bg-white p-6 space-y-4"
              >
                <Skeleton className="h-4 w-1/3" />
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AddLeaseForm
            onSubmit={handleSubmit}
            initialData={initialData}
            isLoading={createLease.isPending}
          />
        )}
      </div>
    </MaxContainer>
  );
}
