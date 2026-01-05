"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  const isPositive = trend && trend.value >= 0;

  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-xl p-3 sm:p-5",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">
            {title}
          </p>
          <p className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
            {value}
          </p>
        </div>
        {Icon && (
          <div className="h-8 w-8 sm:h-10 sm:w-10 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-2 sm:mt-3 flex items-center gap-1 flex-wrap">
          <span
            className={cn(
              "text-[10px] sm:text-xs font-medium",
              isPositive ? "text-green-600" : "text-red-500"
            )}
          >
            {isPositive ? "+" : ""}
            {trend.value}%
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400 truncate">
            {trend.label}
          </span>
        </div>
      )}
    </div>
  );
}
