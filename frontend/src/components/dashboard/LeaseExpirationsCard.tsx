"use client";

import { Calendar, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";
import { cn } from "~/lib/utils";
import { UpcomingLeaseItem } from "~/types/dashboard";

interface LeaseExpirationsCardProps {
  leases: UpcomingLeaseItem[];
  isLoading?: boolean;
}

export function LeaseExpirationsCard({
  leases,
  isLoading,
}: LeaseExpirationsCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-slate-100 rounded w-1/3" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-50 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-slate-900">
            Upcoming Lease Expirations
          </h3>
        </div>
        <Link
          href="/leases"
          className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="divide-y divide-slate-50">
        {leases.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <Calendar className="h-8 w-8 text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No upcoming expirations</p>
          </div>
        ) : (
          leases.slice(0, 5).map((lease) => {
            const expiryDate = new Date(lease.expiryDate);
            const daysLeft = differenceInDays(expiryDate, new Date());
            const isUrgent = daysLeft <= 14;

            return (
              <div
                key={lease.id}
                className="px-5 py-3 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {lease.tenantName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {lease.unitInfo}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-xs text-slate-500">
                      {format(expiryDate, "MMM d, yyyy")}
                    </p>
                    <p
                      className={cn(
                        "text-xs font-medium",
                        isUrgent ? "text-red-500" : "text-amber-600"
                      )}
                    >
                      {daysLeft} days left
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {leases.length > 5 && (
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
          <Link
            href="/leases"
            className="text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            +{leases.length - 5} more expirations
          </Link>
        </div>
      )}
    </div>
  );
}
