"use client";

import {
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "~/lib/utils";

interface ActivityItem {
  id: string;
  type: "payment" | "lease" | "invoice" | "property";
  title: string;
  description: string;
  timestamp: string;
  status?: "success" | "pending" | "warning";
}

interface RecentActivityCardProps {
  activities?: ActivityItem[];
  isLoading?: boolean;
}

const activityIcons = {
  payment: CheckCircle,
  lease: FileText,
  invoice: AlertCircle,
  property: Activity,
};

const statusColors = {
  success: "text-green-500 bg-green-50",
  pending: "text-amber-500 bg-amber-50",
  warning: "text-red-500 bg-red-50",
};

export function RecentActivityCard({
  activities = [],
  isLoading,
}: RecentActivityCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-slate-100 rounded w-1/3" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="h-8 w-8 bg-slate-100 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-50 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Mock activities if none provided
  const displayActivities: ActivityItem[] =
    activities.length > 0
      ? activities
      : [
          {
            id: "1",
            type: "payment",
            title: "Payment received",
            description: "John Doe paid ₦150,000 for Unit A1",
            timestamp: new Date().toISOString(),
            status: "success",
          },
          {
            id: "2",
            type: "lease",
            title: "Lease renewed",
            description: "Sarah Smith renewed lease for Unit B3",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            status: "success",
          },
          {
            id: "3",
            type: "invoice",
            title: "Invoice overdue",
            description: "Mike Johnson - Unit C2 payment overdue",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            status: "warning",
          },
          {
            id: "4",
            type: "payment",
            title: "Payment pending",
            description: "Awaiting confirmation for Unit D1",
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            status: "pending",
          },
        ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        <Activity className="h-4 w-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-900">
          Recent Activity
        </h3>
      </div>

      <div className="divide-y divide-slate-50">
        {displayActivities.slice(0, 5).map((activity) => {
          const Icon = activityIcons[activity.type];
          const statusClass = activity.status
            ? statusColors[activity.status]
            : "text-slate-400 bg-slate-50";

          return (
            <div
              key={activity.id}
              className="px-5 py-3 hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex gap-3">
                <div
                  className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                    statusClass
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    {activity.title}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
