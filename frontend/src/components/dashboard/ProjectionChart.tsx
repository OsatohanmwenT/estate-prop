"use client";

import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { useRevenueProjections } from "~/lib/query/dashboard";

const chartConfig = {
  secured: {
    label: "Secured Revenue",
    color: "#22c55e", // green
  },
  potential: {
    label: "Potential Revenue",
    color: "#94a3b8", // slate-400
  },
} satisfies ChartConfig;

interface ProjectionChartProps {
  isLoading?: boolean;
}

export function ProjectionChart({
  isLoading: externalLoading,
}: ProjectionChartProps) {
  const { data: projections = [], isLoading: queryLoading } =
    useRevenueProjections();

  const isLoading = externalLoading || queryLoading;
  const chartData = projections;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `₦${(value / 1000).toFixed(0)}K`;
    }
    return `₦${value}`;
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-slate-100 rounded w-1/3" />
          <div className="h-48 bg-slate-50 rounded-lg" />
        </div>
      </div>
    );
  }

  // Calculate totals for insight
  const totalSecured = chartData.reduce((sum, d) => sum + d.secured, 0);
  const totalPotential = chartData.reduce((sum, d) => sum + d.potential, 0);
  const captureRate =
    totalPotential > 0
      ? ((totalSecured / totalPotential) * 100).toFixed(0)
      : "0";

  // Show empty state if no data
  if (chartData.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-semibold text-slate-900">
              Revenue Projection
            </h3>
          </div>
        </div>
        <div className="p-8 text-center">
          <TrendingUp className="h-8 w-8 text-slate-200 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No projection data</p>
          <p className="text-xs text-slate-400 mt-1">
            Add leases to see revenue projections
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm font-semibold text-slate-900">
            Revenue Projection
          </h3>
        </div>
        <span className="text-xs text-slate-500">{captureRate}% secured</span>
      </div>

      <div className="p-4">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart data={chartData} margin={{ left: 0, right: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              width={50}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    `₦${Number(value).toLocaleString()}  `,
                    name === "secured" ? "Secured" : "Potential",
                  ]}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="potential"
              stroke="var(--color-potential)"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="var(--color-potential)"
              fillOpacity={0.1}
            />
            <Area
              type="monotone"
              dataKey="secured"
              stroke="var(--color-secured)"
              strokeWidth={2}
              fill="var(--color-secured)"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ChartContainer>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-3">
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-4 bg-green-500 rounded" />
            <span className="text-xs text-slate-600">Secured</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-0.5 w-4 bg-slate-400 rounded border-dashed"
              style={{ borderBottom: "2px dashed" }}
            />
            <span className="text-xs text-slate-600">Potential</span>
          </div>
        </div>
      </div>
    </div>
  );
}
