"use client";

import { ChevronLeft, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { OwnerProfile } from "~/components/owners/OwnerProfile";
import MaxContainer from "~/components/shared/MaxContainer";
import { Skeleton } from "~/components/ui/skeleton";
import { useOwnerWithDetails } from "~/lib/query";

export default function OwnerDetailsPage() {
  const params = useParams();
  const ownerId = params.id as string;

  const { data: owner, isLoading, error } = useOwnerWithDetails(ownerId);

  if (isLoading) {
    return (
      <MaxContainer className="!px-0">
        <div className="space-y-8 px-4 sm:px-7">
          <Skeleton className="h-80 md:h-[26rem] w-full rounded-sm" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-sm" />
            ))}
          </div>
        </div>
      </MaxContainer>
    );
  }

  if (error || !owner) {
    return (
      <MaxContainer>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Owner not found
          </h2>
          <p className="text-muted-foreground mb-4">
            The owner you&apos;re looking for doesn&apos;t exist or has been
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
              href="/people"
              className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors w-fit"
            >
              <ChevronLeft className="h-3 w-3" />
              Back to People
            </Link>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold uppercase tracking-wide text-slate-900 flex items-center gap-2">
                  <UserCircle2
                    className="h-5 w-5 text-slate-400"
                    strokeWidth={1.5}
                  />
                  Owner Details
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  View and manage owner information, properties, and financial
                  summary.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-7 pb-20">
        <OwnerProfile owner={owner} />
      </div>
    </MaxContainer>
  );
}
