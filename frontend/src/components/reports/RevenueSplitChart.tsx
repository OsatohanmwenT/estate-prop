"use client";

import { Pie, PieChart, Cell } from "recharts";
import { DollarSign } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

const chartConfig = {
  owner: {
    label: "Owner Revenue",
    color: "#3b82f6", // blue-500
  },
  company: {
    label: "Company Revenue",
    color: "#22c55e", // green-500
  },
} satisfies ChartConfig;

const data = [
  { name: "owner", value: 38600000, fill: chartConfig.owner.color },
  { name: "company", value: 9650000, fill: chartConfig.company.color },
];

export function RevenueSplitChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-blue-500" />
        <h3 className="text-sm font-semibold text-slate-900">
          Revenue Distribution
        </h3>
      </div>

      <div className="p-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[200px]"
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
                        {formatCurrency(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
            />
          </PieChart>
        </ChartContainer>

        {/* Summary */}
        <div className="space-y-3 mt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-xs text-slate-600">
                  {chartConfig[item.name as keyof typeof chartConfig]?.label}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-slate-900">
                  {formatCurrency(item.value)}
                </span>
                <span className="text-xs text-slate-400 ml-2">
                  ({((item.value / total) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
          <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-900">
              Total Collected
            </span>
            <span className="text-xs font-bold text-slate-900">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
