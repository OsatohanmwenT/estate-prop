"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#22c55e",
  },
} satisfies ChartConfig;

const data = [
  { month: "Jan", revenue: 4200000 },
  { month: "Feb", revenue: 3800000 },
  { month: "Mar", revenue: 4500000 },
  { month: "Apr", revenue: 5200000 },
  { month: "May", revenue: 4100000 },
  { month: "Jun", revenue: 3900000 },
  { month: "Jul", revenue: 4300000 },
  { month: "Aug", revenue: 4600000 },
  { month: "Sep", revenue: 4800000 },
  { month: "Oct", revenue: 5100000 },
  { month: "Nov", revenue: 4700000 },
  { month: "Dec", revenue: 5050000 },
];

export function RevenueOverview() {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1)}M`;
    }
    return `₦${(value / 1000).toFixed(0)}K`;
  };

  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const avgMonthly = totalRevenue / data.length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <h3 className="text-sm font-semibold text-slate-900">
            Monthly Revenue
          </h3>
        </div>
        <div className="text-xs text-slate-500">
          Avg:{" "}
          <span className="font-semibold text-slate-900">
            {formatCurrency(avgMonthly)}/mo
          </span>
        </div>
      </div>

      <div className="p-4">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <BarChart data={data} margin={{ left: 0, right: 0 }}>
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
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>

        <p className="text-xs text-slate-400 mt-3 text-center">
          Total: {formatCurrency(totalRevenue)} this year
        </p>
      </div>
    </div>
  );
}
