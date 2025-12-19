"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  XCircle,
} from "lucide-react";
import { LeasesTable } from "~/components/leases/LeasesTable";
import MaxContainer from "~/components/shared/MaxContainer";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useLeaseStatistics, useLeases } from "~/lib/query/leases";

export default function LeasesPage() {
  // We fetch basic list just for length count in stats if stats api fails,
  // but ideally stats hook should be enough.
  // We can keep useLeases here just for fallback count if needed, or rely on stats.
  // Let's rely on stats hook and fallback to 0 or empty list logic from hook if needed.
  const { data: leasesData } = useLeases({ limit: 1000 }); // Get all for simplified client-side stats fallback if needed
  const leases = leasesData || [];

  const { data: statistics, isLoading: isLoadingStats } = useLeaseStatistics();

  const stats = [
    {
      label: "Total Leases",
      value: statistics?.totalLeases ?? leases.length,
      icon: FileText,
      color: "text-slate-900",
      bgIcon: "bg-slate-100",
    },
    {
      label: "Active",
      value:
        statistics?.activeLeases ??
        leases.filter((l) => l.status === "active").length,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgIcon: "bg-emerald-50",
    },
    {
      label: "Pending",
      value:
        statistics?.pendingLeases ??
        leases.filter((l) => l.status === "pending").length,
      icon: Clock,
      color: "text-amber-600",
      bgIcon: "bg-amber-50",
    },
    {
      label: "Expiring Soon",
      value:
        statistics?.expiringSoon ??
        leases.filter((l) => {
          if (l.status !== "active") return false;
          const daysRemaining = Math.ceil(
            (new Date(l.endDate).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          );
          return daysRemaining <= 30 && daysRemaining > 0;
        }).length,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgIcon: "bg-orange-50",
    },
    {
      label: "Expired",
      value:
        statistics?.expiredLeases ??
        leases.filter((l) => l.status === "expired").length,
      icon: XCircle,
      color: "text-red-600",
      bgIcon: "bg-red-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/30">
      {/* Linear Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wide text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
              Lease Agreements
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage your lease agreements, renewals, and terminations
            </p>
          </div>
        </div>
      </div>

      <MaxContainer className="py-8 space-y-8">
        {/* Stats Row */}
        <div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {isLoadingStats ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <Skeleton className="h-24 w-full rounded-sm" key={i} />
                ))}
              </>
            ) : (
              stats.map((stat, i) => (
                <Card
                  key={i}
                  className="border border-slate-200 shadow-sm bg-white rounded-sm"
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1.5">
                        {stat.label}
                      </p>
                      <p className="text-xl font-bold text-slate-900 tracking-tight">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`h-8 w-8 rounded-full ${stat.bgIcon} flex items-center justify-center`}
                    >
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Content */}
        <div>
          <LeasesTable />
        </div>
      </MaxContainer>
    </div>
  );
}
