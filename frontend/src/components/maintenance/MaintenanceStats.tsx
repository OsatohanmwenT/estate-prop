import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Wrench,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { StatsCard } from "~/components/dashboard/StatsCard";
import { useMaintenanceStats } from "~/lib/query/maintenance";

export function MaintenanceStats() {
  const { data: stats, isLoading } = useMaintenanceStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <StatsCard
        title="Total Requests"
        value={isLoading ? "..." : stats?.total || 0}
        icon={Wrench}
        trend={{ value: 0, label: "Total active" }}
        className="border-l-4 border-l-blue-500"
      />
      <StatsCard
        title="In Progress"
        value={isLoading ? "..." : stats?.inProgress || 0}
        icon={Clock}
        trend={{ value: 0, label: "Currently working" }}
        className="border-l-4 border-l-amber-500"
      />
      <StatsCard
        title="Completed"
        value={isLoading ? "..." : stats?.completed || 0}
        icon={CheckCircle2}
        trend={{ value: 0, label: "This month" }}
        className="border-l-4 border-l-green-500"
      />
      <StatsCard
        title="Total Cost"
        value={isLoading ? "..." : formatCurrency(stats?.totalCost || 0)}
        icon={TrendingUp} // Or DollarSign
        trend={{ value: 0, label: "Total spent" }}
        className="border-l-4 border-l-purple-500"
      />
    </div>
  );
}
