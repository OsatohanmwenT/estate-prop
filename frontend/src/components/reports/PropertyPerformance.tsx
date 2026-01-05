"use client";

import { Building2, TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

const propertyData = [
  {
    name: "Sunrise Estate",
    units: 24,
    occupied: 22,
    revenue: 8500000,
    occupancyRate: 91.7,
  },
  {
    name: "Palm Courts",
    units: 18,
    occupied: 16,
    revenue: 6200000,
    occupancyRate: 88.9,
  },
  {
    name: "Victoria Garden",
    units: 32,
    occupied: 30,
    revenue: 12800000,
    occupancyRate: 93.8,
  },
  {
    name: "Lekki Heights",
    units: 15,
    occupied: 14,
    revenue: 9500000,
    occupancyRate: 93.3,
  },
  {
    name: "Ikoyi Towers",
    units: 20,
    occupied: 17,
    revenue: 7200000,
    occupancyRate: 85.0,
  },
  {
    name: "Marina View",
    units: 12,
    occupied: 12,
    revenue: 4050000,
    occupancyRate: 100.0,
  },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#3b82f6",
  },
} satisfies ChartConfig;

export function PropertyPerformance() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatShortCurrency = (value: number) => {
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1)}M`;
    }
    return `₦${(value / 1000).toFixed(0)}K`;
  };

  const totalUnits = propertyData.reduce((sum, d) => sum + d.units, 0);
  const totalOccupied = propertyData.reduce((sum, d) => sum + d.occupied, 0);
  const totalRevenue = propertyData.reduce((sum, d) => sum + d.revenue, 0);
  const avgOccupancy = (totalOccupied / totalUnits) * 100;

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-semibold text-slate-900">
              Revenue by Property
            </h3>
          </div>
          <div className="text-xs text-slate-500">
            Total:{" "}
            <span className="font-semibold text-slate-900">
              {formatCurrency(totalRevenue)}
            </span>
          </div>
        </div>

        <div className="p-4">
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart
              data={propertyData}
              layout="vertical"
              margin={{ left: 100, right: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
              />
              <XAxis
                type="number"
                tickFormatter={formatShortCurrency}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                width={95}
              />
              <ChartTooltip
                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="revenue"
                fill="var(--color-revenue)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">
            Property Details
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                  Property
                </th>
                <th className="px-5 py-3 text-center text-xs font-medium text-slate-500">
                  Units
                </th>
                <th className="px-5 py-3 text-center text-xs font-medium text-slate-500">
                  Occupied
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium text-slate-500">
                  Revenue
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium text-slate-500">
                  Occupancy
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {propertyData.map((row) => (
                <tr key={row.name} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {row.name}
                  </td>
                  <td className="px-5 py-3 text-center text-slate-600">
                    {row.units}
                  </td>
                  <td className="px-5 py-3 text-center text-slate-600">
                    {row.occupied}
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-slate-900">
                    {formatCurrency(row.revenue)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={`text-xs font-medium ${
                        row.occupancyRate >= 90
                          ? "text-green-600"
                          : row.occupancyRate >= 80
                            ? "text-amber-600"
                            : "text-red-500"
                      }`}
                    >
                      {row.occupancyRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-200">
              <tr>
                <td className="px-5 py-3 font-semibold text-slate-900">
                  Total
                </td>
                <td className="px-5 py-3 text-center font-semibold text-slate-900">
                  {totalUnits}
                </td>
                <td className="px-5 py-3 text-center font-semibold text-slate-900">
                  {totalOccupied}
                </td>
                <td className="px-5 py-3 text-right font-semibold text-slate-900">
                  {formatCurrency(totalRevenue)}
                </td>
                <td className="px-5 py-3 text-right font-semibold text-green-600">
                  {avgOccupancy.toFixed(1)}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
