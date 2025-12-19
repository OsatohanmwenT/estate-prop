"use client";

import { Building2, ChevronLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
import MaxContainer from "~/components/shared/MaxContainer";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { UnitCreationForm } from "~/components/units/UnitCreationForm";
import { usePropertyById } from "~/lib/query";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AddUnitsPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const propertyId = id;

  const { data: property, isLoading } = usePropertyById(
    propertyId,
    !!propertyId
  );

  if (isLoading) {
    return (
      <MaxContainer>
        <div className="space-y-6 pt-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </MaxContainer>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30">
      {/* Linear Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/properties/${propertyId}`)}
              className="h-8 w-8 rounded-sm border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-bold uppercase tracking-wide text-slate-900 flex items-center gap-2">
                <Building2
                  className="h-5 w-5 text-slate-400"
                  strokeWidth={1.5}
                />
                Add Units
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Adding inventory to{" "}
                <span className="font-semibold text-slate-700">
                  {property?.name}
                </span>
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className="border-slate-200 text-slate-500 py-1 px-3 rounded-sm bg-slate-50"
          >
            <Sparkles className="h-3 w-3 mr-2 text-emerald-500" />
            AI Generation Available
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-8 px-6">
        <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
          <UnitCreationForm propertyId={propertyId} />
        </div>
      </div>
    </div>
  );
}
