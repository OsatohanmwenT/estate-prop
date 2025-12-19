"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import MaxContainer from "~/components/shared/MaxContainer";
import { TenantProfile } from "~/components/tenants/TenantProfile";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { useTenantById } from "~/lib/query";
import { TenantProfile as TenantProfileType } from "~/types/tenant";

export default function TenantDetailsPage() {
  const params = useParams();
  const tenantId = params.id as string;

  const { data: tenant, isLoading, error } = useTenantById(tenantId);

  if (isLoading) {
    return (
      <MaxContainer>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </MaxContainer>
    );
  }

  if (error || !tenant) {
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
          <Link href="/tenants" className="text-primary hover:underline">
            Back to Tenants
          </Link>
        </div>
      </MaxContainer>
    );
  }

  // Parse metadata or use empty object
  const parsedMetadata = tenant.metadata ? JSON.parse(tenant.metadata) : {};

  // Build tenant profile with real data only
  const tenantProfile: TenantProfileType = {
    ...tenant,
    metadata: parsedMetadata || null,
    currentLease: null, // TODO: Fetch from lease API
    paymentHistory: [], // TODO: Fetch from payment/invoice API
    documents: [], // TODO: Fetch from document API
    communications: [], // TODO: Fetch from communication API
    maintenanceRequests: [], // TODO: Fetch from maintenance API
  };

  return (
    <MaxContainer className="!px-0">
      {/* Linear Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-7 py-4 mb-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col gap-4">
            {/* Back Link */}
            <Link
              href="/people"
              className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors w-fit"
            >
              <ChevronLeft className="h-3 w-3" />
              Back to People
            </Link>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold uppercase tracking-wide text-slate-900 flex items-center gap-2">
                  <span className="text-slate-400 font-normal">Tenant:</span>{" "}
                  {tenant?.fullName}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Viewing tenant profile details, lease information, and
                  history.
                </p>
              </div>
              <Link href={`/tenants/${tenant.id}/edit`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-sm border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-semibold text-xs transition-colors uppercase tracking-wider"
                >
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-7 max-w-[1600px] mx-auto">
        <TenantProfile tenant={tenantProfile} />
      </div>
    </MaxContainer>
  );
}
