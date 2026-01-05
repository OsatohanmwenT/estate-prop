"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  User,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { RevenueOverview } from "~/components/reports/RevenueOverview";
import { RevenueSplitChart } from "~/components/reports/RevenueSplitChart";
import { MonthlyBreakdown } from "~/components/reports/MonthlyBreakdown";
import { PropertyPerformance } from "~/components/reports/PropertyPerformance";
import { PaymentStatusChart } from "~/components/reports/PaymentStatusChart";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("year");

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
            Financial Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Revenue analytics and distribution
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            {["month", "quarter", "year"].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  dateRange === range
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {range === "month"
                  ? "Month"
                  : range === "quarter"
                    ? "Quarter"
                    : "Year"}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SummaryCard
          title="Total Revenue"
          value="₦48,250,000"
          change={12.5}
          icon={DollarSign}
        />
        <SummaryCard
          title="Owner Revenue"
          value="₦38,600,000"
          change={11.2}
          icon={User}
        />
        <SummaryCard
          title="Company Revenue"
          value="₦9,650,000"
          change={18.7}
          icon={Briefcase}
        />
        <SummaryCard
          title="Collection Rate"
          value="94.2%"
          change={2.1}
          icon={PieChart}
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="overview" className="text-xs">
            Overview
          </TabsTrigger>
          <TabsTrigger value="monthly" className="text-xs">
            Monthly
          </TabsTrigger>
          <TabsTrigger value="properties" className="text-xs">
            By Property
          </TabsTrigger>
          <TabsTrigger value="payments" className="text-xs">
            Payments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RevenueOverview />
            </div>
            <div className="space-y-6">
              <RevenueSplitChart />
            </div>
          </div>
          <PaymentStatusChart />
        </TabsContent>

        <TabsContent value="monthly">
          <MonthlyBreakdown />
        </TabsContent>

        <TabsContent value="properties">
          <PropertyPerformance />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentStatusChart detailed />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Summary Card Component
function SummaryCard({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: number;
  icon: any;
}) {
  const isUp = change > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="h-9 w-9 bg-slate-50 rounded-lg flex items-center justify-center">
          <Icon className="h-4 w-4 text-slate-600" />
        </div>
        <div
          className={`flex items-center gap-0.5 text-xs font-medium ${
            isUp ? "text-green-600" : "text-red-500"
          }`}
        >
          {isUp ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="mt-3">
        <p className="text-xs text-slate-500">{title}</p>
        <p className="text-lg font-bold text-slate-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
