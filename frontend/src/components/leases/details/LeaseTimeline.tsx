"use client";

import { History } from "lucide-react";
import { cn, formatDate } from "~/lib/utils";
import { calculateLeaseDuration, formatBillingCycle } from "~/schemas/lease";

interface LeaseTimelineProps {
  startDate: string;
  endDate: string;
  billingCycle: string;
  isActive: boolean;
  daysRemaining: number;
}

export function LeaseTimeline({
  startDate,
  endDate,
  billingCycle,
  isActive,
  daysRemaining,
}: LeaseTimelineProps) {
  const leaseDuration = calculateLeaseDuration(startDate, endDate);
  const progressPercent = Math.max(
    0,
    Math.min(100, (daysRemaining / (leaseDuration * 30)) * 100)
  );

  return (
    <section className="space-y-6">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
        Lease Timeline
      </h3>

      <div className="space-y-8">
        <div className="flex justify-between items-end text-sm">
          <div className="text-left">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">
              Start Date
            </p>
            <p className="font-bold text-slate-900 text-lg">
              {formatDate(startDate)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">
              End Date
            </p>
            <p className="font-bold text-slate-900 text-lg">
              {formatDate(endDate)}
            </p>
          </div>
        </div>

        <div className="relative py-2">
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-1000",
                daysRemaining <= 30 ? "bg-amber-500" : "bg-emerald-500"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {isActive && (
            <div
              className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center mt-[-4px]"
              style={{ left: `${progressPercent}%` }}
            >
              <div className="relative">
                <div
                  className={cn(
                    "h-4 w-4 rounded-full border-[3px] border-white shadow-sm mb-1",
                    daysRemaining <= 30 ? "bg-amber-500" : "bg-emerald-500"
                  )}
                />
              </div>
              <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 whitespace-nowrap uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded-sm border border-slate-100">
                {daysRemaining > 0 ? `${daysRemaining} days left` : "Expired"}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-8 pt-6 border-t border-slate-100">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">
              Duration
            </p>
            <p className="text-sm font-bold text-slate-900">
              {leaseDuration} Months
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">
              Billing
            </p>
            <p className="text-sm font-bold text-slate-900">
              {formatBillingCycle(billingCycle)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">
              Renewal Status
            </p>
            <p className="text-sm font-bold text-slate-400">Not Scheduled</p>
          </div>
        </div>
      </div>
    </section>
  );
}
