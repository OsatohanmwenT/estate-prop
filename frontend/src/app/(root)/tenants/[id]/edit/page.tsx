"use client";

import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { EditTenantForm } from "~/components/tenants/form/EditTenantForm";
import { Button } from "~/components/ui/button";
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
      <div className="min-h-screen bg-slate-50/30 font-sans">
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-8 rounded-sm" />
              <div>
                <Skeleton className="h-6 w-32 mb-1" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto py-8 px-6">
          <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="min-h-screen bg-slate-50/30 font-sans flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Tenant Not Found</h2>
          <Button onClick={() => router.push("/people")} variant="outline">
            Return to People
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 font-sans">
      {/* Linear Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/tenants/${tenantId}`)}
              className="h-8 w-8 rounded-sm border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                Edit Tenant
              </h1>
              <p className="text-xs text-slate-500">
                Update details for{" "}
                <span className="font-bold text-slate-700">
                  {tenant.fullName}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-8 px-6">
        <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
          <EditTenantForm
            tenant={tenant}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            isLoading={updateTenantMutation.isPending}
            isDeleting={deleteTenantMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
