"use client";

import { Pie, PieChart } from "recharts";
import { Activity } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

interface PortfolioHealthData {
  active: number;
  vacant: number;
}

interface PortfolioHealthCardProps {
  data?: PortfolioHealthData;
  isLoading?: boolean;
}

const chartConfig = {
  active: {
    label: "Occupied",
    color: "#22c55e", // green-500
  },
  vacant: {
    label: "Vacant",
    color: "#3b82f6", // blue-500
  },
} satisfies ChartConfig;

export function PortfolioHealthCard({
  data,
  isLoading,
}: PortfolioHealthCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-slate-100 rounded w-1/3" />
          <div className="h-40 bg-slate-50 rounded-lg" />
        </div>
      </div>
    );
  }

  const chartData = data
    ? [
        { name: "active", value: data.active, fill: chartConfig.active.color },
        { name: "vacant", value: data.vacant, fill: chartConfig.vacant.color },
      ]
    : [
        { name: "active", value: 85, fill: chartConfig.active.color },
        { name: "vacant", value: 15, fill: chartConfig.vacant.color },
      ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const occupancyRate =
    total > 0 ? ((chartData[0].value / total) * 100).toFixed(0) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-green-500" />
          <h3 className="text-sm font-semibold text-slate-900">Occupancy</h3>
        </div>
        <span className="text-xs font-medium text-green-600">
          {occupancyRate}% occupied
        </span>
      </div>

      <div className="p-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[160px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex items-center gap-2">
                      <span>
                        {chartConfig[name as keyof typeof chartConfig]?.label}
                      </span>
                      <span className="font-medium">
                        {value} ({((Number(value) / total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={40}
              outerRadius={65}
              paddingAngle={2}
            />
          </PieChart>
        </ChartContainer>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-2">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-xs text-slate-600">
                {chartConfig[item.name as keyof typeof chartConfig]?.label}
              </span>
              <span className="text-xs font-medium text-slate-900">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
