"use client";

import {
  Building2,
  Users,
  DollarSign,
  Clock,
  Plus,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { StatsCard } from "~/components/dashboard/StatsCard";
import { LeaseExpirationsCard } from "~/components/dashboard/LeaseExpirationsCard";
import { OverdueInvoicesCard } from "~/components/dashboard/OverdueInvoicesCard";
import { VacantUnitsCard } from "~/components/dashboard/VacantUnitsCard";
import { ProjectionChart } from "~/components/dashboard/ProjectionChart";
import MaxContainer from "~/components/shared/MaxContainer";
import {
  useDashboardSummary,
  useOverdueRentItems,
  useUpcomingLeaseItems,
  useVacantUnits,
} from "~/lib/query/dashboard";
import { useSendOverdueReminder } from "~/lib/query/notifications";
import { OverdueRentItem } from "~/types/dashboard";

export default function DashboardPage() {
  // Fetch real data from backend
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: overdueItems = [], isLoading: overdueLoading } =
    useOverdueRentItems();
  const { data: upcomingLeases = [], isLoading: leasesLoading } =
    useUpcomingLeaseItems(60);
  const { data: vacantUnits = [], isLoading: vacantLoading } = useVacantUnits();

  // Notification mutation
  const sendOverdueReminder = useSendOverdueReminder();

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const handleSendReminder = (invoice: OverdueRentItem) => {
    if (!invoice.email) {
      // Fallback if no email - you might want to show an error
      return;
    }

    sendOverdueReminder.mutate({
      tenantEmail: invoice.email,
      tenantName: invoice.tenantName,
      amount: invoice.amount,
      daysOverdue: invoice.daysOverdue,
      propertyAddress: invoice.unitInfo,
      invoiceId: invoice.id,
    });
  };

  return (
    <div className="">
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wide text-slate-900 flex items-center gap-2">
              <LayoutDashboard
                className="h-5 w-5 text-slate-400"
                strokeWidth={1.5}
              />
              Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Real-time information and activities of your portfolio
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/properties/add">
              <Button className="h-9 rounded-sm bg-slate-900 text-white hover:bg-slate-800 shadow-none">
                <Plus className="size-4 mr-2" strokeWidth={1.5} />
                Add Property
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <MaxContainer className="p-4 !max-h-fit !h-full sm:p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatsCard
            title="Total Units"
            value={summaryLoading ? "..." : summary?.occupancy?.totalUnits || 0}
            icon={Building2}
            trend={{ value: 1.2, label: "From last month" }}
          />
          <StatsCard
            title="Occupied Units"
            value={
              summaryLoading ? "..." : summary?.occupancy?.occupiedUnits || 0
            }
            icon={Users}
            trend={{ value: 4.1, label: "From last month" }}
          />
          <StatsCard
            title="Overdue Amount"
            value={
              summaryLoading
                ? "..."
                : formatCurrency(summary?.overdueRent?.totalAmount || "0")
            }
            icon={DollarSign}
            trend={{ value: -1.2, label: "From last month" }}
          />
          <StatsCard
            title="Pending Payments"
            value={
              summaryLoading
                ? "..."
                : formatCurrency(summary?.pendingPayments?.totalAmount || "0")
            }
            icon={Clock}
            trend={{ value: 2.5, label: "From last month" }}
          />
        </div>

        {/* Main Content - 2x2 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Row 1 */}
          <ProjectionChart isLoading={summaryLoading} />
          <OverdueInvoicesCard
            invoices={overdueItems}
            isLoading={overdueLoading}
            onSendReminder={handleSendReminder}
          />

          {/* Row 2 */}
          <LeaseExpirationsCard
            leases={upcomingLeases}
            isLoading={leasesLoading}
          />
          <VacantUnitsCard units={vacantUnits} isLoading={vacantLoading} />
        </div>
      </MaxContainer>
    </div>
  );
}
