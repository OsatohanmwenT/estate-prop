"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import MaxContainer from "~/components/shared/MaxContainer";
import { EditTenantForm } from "~/components/tenants/form/EditTenantForm";
import { Skeleton } from "~/components/ui/skeleton";
import { useDeleteTenant, useTenantById, useUpdateTenant } from "~/lib/query";
import { UpdateTenantFormData } from "~/schemas/tenant";

export default function EditTenantPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params.id as string;

  const { data: tenant, isLoading: isLoadingTenant } = useTenantById(tenantId);
  const updateTenantMutation = useUpdateTenant();
  const deleteTenantMutation = useDeleteTenant();

  const handleSubmit = (data: UpdateTenantFormData) => {
    // Prepare metadata
    const metadata = JSON.stringify({
      occupation: data.occupation,
      currentAddress: data.currentAddress,
      guarantorName: data.guarantorName,
      guarantorPhone: data.guarantorPhone,
      allottedParking: data.allottedParking,
      accessCardNo: data.accessCardNo,
      idType: data.idType,
      idNumber: data.idNumber,
      dateOfBirth: data.dateOfBirth,
      nationality: data.nationality,
      employerName: data.employerName,
      employerAddress: data.employerAddress,
      notes: data.notes,
    });

    updateTenantMutation.mutate(
      {
        id: tenantId,
        data: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          nokName: data.nokName,
          nokPhone: data.nokPhone,
          annualIncome: data.annualIncome,
          metadata,
        },
      },
      {
        onSuccess: () => {
          toast.success("Tenant updated successfully");
          router.push(`/tenants/${tenantId}`);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Failed to update tenant"
          );
        },
      }
    );
  };

  const handleDelete = () => {
    deleteTenantMutation.mutate(tenantId, {
      onSuccess: () => {
        toast.success("Tenant deleted successfully");
        router.push("/people");
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete tenant"
        );
      },
    });
  };

  if (isLoadingTenant) {
    return (
      <MaxContainer>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </MaxContainer>
    );
  }

  if (!tenant) {
    return (
      <MaxContainer>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Tenant not found
          </h2>
          <p className="text-muted-foreground mb-4">
            The tenant you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/people" className="text-primary hover:underline">
            Back to People
          </Link>
        </div>
      </MaxContainer>
    );
  }

  return (
    <MaxContainer className="!px-0">
      {/* Linear Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-7 py-4 mb-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col gap-4">
            {/* Back Link */}
            <Link
              href={`/tenants/${tenantId}`}
              className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors w-fit"
            >
              <ChevronLeft className="h-3 w-3" />
              Back to Tenant Details
            </Link>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold uppercase tracking-wide text-slate-900 flex items-center gap-2">
                  Edit Tenant: {tenant.fullName}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Update tenant information and details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-7">
        <EditTenantForm
          tenant={tenant}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          isLoading={updateTenantMutation.isPending}
          isDeleting={deleteTenantMutation.isPending}
        />
      </div>
    </MaxContainer>
  );
}
