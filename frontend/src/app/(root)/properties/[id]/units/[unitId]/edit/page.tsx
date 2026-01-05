"use client";

import { use } from "react";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { EditUnitWrapper } from "~/components/units/EditUnitWrapper";
import { useUnitById } from "~/lib/query";
import { Unit as EditUnit } from "~/types/unit";

interface PageProps {
  params: Promise<{ id: string; unitId: string }>;
}

export default function EditUnitPage({ params }: PageProps) {
  const { id, unitId } = use(params);
  const propertyId = id;

  const { data: unit, isLoading, error } = useUnitById(propertyId, unitId);

  if (isLoading) {
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

  if (error || !unit) {
    return (
      <div className="min-h-screen bg-slate-50/30 font-sans flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Unit Not Found</h2>
          <Button onClick={() => window.history.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Transform the unit data to match EditUnitWrapper's expected type
  const unitData: EditUnit = {
    id: unit.id,
    propertyId,
    code: unit.code,
    type: unit.type,
    floor: unit.floor,
    bedrooms: unit.bedrooms,
    bathrooms: unit.bathrooms,
    unitSize: unit.unitSize,
    status: unit.status,
    rentAmount: unit.rentAmount,
    condition: unit.condition || undefined,
    createdAt: new Date(unit.createdAt),
    updatedAt: new Date(),
    tenant: unit.tenant
      ? {
          id: unit.tenant.id,
          firstName: unit.tenant.fullName.split(" ")[0],
          lastName: unit.tenant.fullName.split(" ").slice(1).join(" ") || "",
          email: unit.tenant.email,
        }
      : undefined,
  };

  return (
    <div className="min-h-screen bg-slate-50/30 font-sans">
      {/* Sticky Linear Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              Edit Unit
            </h1>
            <p className="text-xs text-slate-500">
              Update details for unit{" "}
              <span className="font-bold text-slate-700">{unit.code}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-8 px-6">
        <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden p-6">
          <EditUnitWrapper unit={unitData} propertyId={propertyId} />
        </div>
      </div>
    </div>
  );
}
