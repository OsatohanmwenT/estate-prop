"use client";

import { Building2, ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { EditPropertyWrapper } from "~/components/properties/edit/EditPropertyWrapper";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { usePropertyById } from "~/lib/query";

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: property, isLoading } = usePropertyById(id, !!id);

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
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50/30 font-sans flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            Property Not Found
          </h2>
          <Button onClick={() => router.push("/portfolio")} variant="outline">
            Return to Portfolio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/properties/${id}`)}
              className="h-8 w-8 rounded-sm border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-400" />
                Edit Property
              </h1>
              <p className="text-xs text-slate-500">
                Update details for{" "}
                <span className="font-medium text-slate-700">
                  {property.name}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-8 px-6">
        <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
          <EditPropertyWrapper property={property} />
        </div>
      </div>
    </div>
  );
}
