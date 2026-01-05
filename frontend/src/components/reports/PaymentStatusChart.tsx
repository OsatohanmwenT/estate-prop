"use client";

import { Pie, PieChart, Cell } from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

interface PaymentStatusChartProps {
  detailed?: boolean;
}

const chartConfig = {
  paid: {
    label: "Paid",
    color: "#22c55e",
  },
  pending: {
    label: "Pending",
    color: "#f59e0b",
  },
  overdue: {
    label: "Overdue",
    color: "#ef4444",
  },
} satisfies ChartConfig;

const data = [
  { name: "paid", value: 42500000, fill: chartConfig.paid.color },
  { name: "pending", value: 3200000, fill: chartConfig.pending.color },
  { name: "overdue", value: 2550000, fill: chartConfig.overdue.color },
];

const detailedData = [
  {
    tenant: "John Adeyemi",
    property: "Sunrise Estate",
    amount: 250000,
    status: "overdue",
    daysOverdue: 28,
  },
  {
    tenant: "Mary Okonkwo",
    property: "Palm Courts",
    amount: 180000,
    status: "overdue",
    daysOverdue: 19,
  },
  {
    tenant: "David Chukwu",
    property: "Victoria Garden",
    amount: 320000,
    status: "pending",
    daysOverdue: 0,
  },
  {
    tenant: "Grace Eze",
    property: "Lekki Heights",
    amount: 150000,
    status: "pending",
    daysOverdue: 0,
  },
  {
    tenant: "Samuel Obi",
    property: "Sunrise Estate",
    amount: 280000,
    status: "paid",
    daysOverdue: 0,
  },
  {
    tenant: "Amaka Nwosu",
    property: "Palm Courts",
    amount: 350000,
    status: "paid",
    daysOverdue: 0,
  },
];

export function PaymentStatusChart({
  detailed = false,
}: PaymentStatusChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (detailed) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">
            Payment Details
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                  Tenant
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                  Property
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                  Amount
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {detailedData.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {row.tenant}
                  </td>
                  <td className="px-5 py-3 text-slate-600">{row.property}</td>
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {formatCurrency(row.amount)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        row.status === "paid"
                          ? "bg-green-50 text-green-600"
                          : row.status === "pending"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-red-50 text-red-600"
                      }`}
                    >
                      {row.status === "overdue"
                        ? `${row.daysOverdue}d overdue`
                        : row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        <PieIcon className="h-4 w-4 text-blue-500" />
        <h3 className="text-sm font-semibold text-slate-900">Payment Status</h3>
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
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
            />
          </PieChart>
        </ChartContainer>

        {/* Summary */}
        <div className="space-y-2 mt-4">
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
        </div>
      </div>
    </div>
  );
}
