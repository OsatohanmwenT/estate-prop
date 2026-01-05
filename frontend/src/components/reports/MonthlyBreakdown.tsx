"use client";

import { Calendar, TrendingUp, TrendingDown } from "lucide-react";

const monthlyData = [
  {
    month: "January 2024",
    revenue: 4200000,
    collected: 3900000,
    pending: 300000,
    change: 5.2,
  },
  {
    month: "February 2024",
    revenue: 3800000,
    collected: 3600000,
    pending: 200000,
    change: -12.5,
  },
  {
    month: "March 2024",
    revenue: 4500000,
    collected: 4200000,
    pending: 300000,
    change: 25.0,
  },
  {
    month: "April 2024",
    revenue: 5200000,
    collected: 4900000,
    pending: 300000,
    change: 13.0,
  },
  {
    month: "May 2024",
    revenue: 4100000,
    collected: 3800000,
    pending: 300000,
    change: -21.8,
  },
  {
    month: "June 2024",
    revenue: 3900000,
    collected: 3700000,
    pending: 200000,
    change: -3.5,
  },
  {
    month: "July 2024",
    revenue: 4300000,
    collected: 4100000,
    pending: 200000,
    change: 7.3,
  },
  {
    month: "August 2024",
    revenue: 4600000,
    collected: 4400000,
    pending: 200000,
    change: 11.1,
  },
  {
    month: "September 2024",
    revenue: 4800000,
    collected: 4500000,
    pending: 300000,
    change: 4.6,
  },
  {
    month: "October 2024",
    revenue: 5100000,
    collected: 4800000,
    pending: 300000,
    change: 4.4,
  },
  {
    month: "November 2024",
    revenue: 4700000,
    collected: 4400000,
    pending: 300000,
    change: -7.5,
  },
  {
    month: "December 2024",
    revenue: 5050000,
    collected: 4700000,
    pending: 350000,
    change: 6.6,
  },
];

export function MonthlyBreakdown() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = monthlyData.reduce((sum, d) => sum + d.revenue, 0);
  const totalCollected = monthlyData.reduce((sum, d) => sum + d.collected, 0);
  const totalPending = monthlyData.reduce((sum, d) => sum + d.pending, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm font-semibold text-slate-900">
            Monthly Breakdown
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                Month
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-500">
                Expected
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-500">
                Collected
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-500">
                Pending
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-500">
                Change
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {monthlyData.map((row) => (
              <tr key={row.month} className="hover:bg-slate-50/50">
                <td className="px-5 py-3 font-medium text-slate-900">
                  {row.month}
                </td>
                <td className="px-5 py-3 text-right text-slate-600">
                  {formatCurrency(row.revenue)}
                </td>
                <td className="px-5 py-3 text-right font-medium text-green-600">
                  {formatCurrency(row.collected)}
                </td>
                <td className="px-5 py-3 text-right text-amber-600">
                  {formatCurrency(row.pending)}
                </td>
                <td className="px-5 py-3 text-right">
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                      row.change >= 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {row.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {row.change >= 0 ? "+" : ""}
                    {row.change}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 border-t border-slate-200">
            <tr>
              <td className="px-5 py-3 font-semibold text-slate-900">Total</td>
              <td className="px-5 py-3 text-right font-semibold text-slate-900">
                {formatCurrency(totalRevenue)}
              </td>
              <td className="px-5 py-3 text-right font-semibold text-green-600">
                {formatCurrency(totalCollected)}
              </td>
              <td className="px-5 py-3 text-right font-semibold text-amber-600">
                {formatCurrency(totalPending)}
              </td>
              <td className="px-5 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
