"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Calendar } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

interface SeasonalityData {
  month: string;
  revenue: number;
}

interface SeasonalityChartProps {
  data?: SeasonalityData[];
  isLoading?: boolean;
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#22c55e",
  },
} satisfies ChartConfig;

// Mock data showing seasonal patterns
const mockData: SeasonalityData[] = [
  { month: "Jan", revenue: 2400000 },
  { month: "Feb", revenue: 1800000 },
  { month: "Mar", revenue: 2200000 },
  { month: "Apr", revenue: 4500000 }, // Spike
  { month: "May", revenue: 2800000 },
  { month: "Jun", revenue: 2100000 },
  { month: "Jul", revenue: 1900000 },
  { month: "Aug", revenue: 2300000 },
  { month: "Sep", revenue: 2600000 },
  { month: "Oct", revenue: 4200000 }, // Spike
  { month: "Nov", revenue: 2900000 },
  { month: "Dec", revenue: 3100000 },
];

export function SeasonalityChart({ data, isLoading }: SeasonalityChartProps) {
  const chartData = data || mockData;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1)}M`;
    }
    return `₦${(value / 1000).toFixed(0)}K`;
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

  // Find peak months
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue));
  const peakMonths = chartData
    .filter((d) => d.revenue >= maxRevenue * 0.9)
    .map((d) => d.month);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-green-500" />
          <h3 className="text-sm font-semibold text-slate-900">
            Revenue Seasonality
          </h3>
        </div>
        {peakMonths.length > 0 && (
          <span className="text-xs text-slate-500">
            Peak: {peakMonths.join(", ")}
          </span>
        )}
      </div>

      <div className="p-4">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={chartData} margin={{ left: 0, right: 0 }}>
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
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              content={
                <ChartTooltipContent
                  formatter={(value) => [
                    `₦${Number(value).toLocaleString()}`,
                    "Revenue",
                  ]}
                />
              }
            />
            <Bar
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>

        <p className="text-xs text-slate-400 mt-3 text-center">
          Historical monthly revenue collection patterns
        </p>
      </div>
    </div>
  );
}
