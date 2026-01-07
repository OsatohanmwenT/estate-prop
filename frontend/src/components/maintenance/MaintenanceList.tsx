"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MoreVertical,
  Wrench,
  User,
  Building,
  Calendar,
  Receipt,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  useMaintenanceRequests,
  useDeleteMaintenance,
} from "~/lib/query/maintenance";
import { cn } from "~/lib/utils";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { UpdateExpenseDialog } from "./UpdateExpenseDialog";
import { MaintenanceRequest } from "~/types/maintenance";

interface MaintenanceListProps {
  filters?: {
    status?: string;
    priority?: string;
    search?: string;
  };
}

export function MaintenanceList({ filters }: MaintenanceListProps) {
  const { data: requests = [], isLoading } = useMaintenanceRequests(filters);
  const deleteMutation = useDeleteMaintenance();
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);

  const handleAddExpense = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setExpenseDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this maintenance request?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg bg-white">
        <div className="animate-spin h-8 w-8 border-4 border-slate-200 border-t-blue-600 rounded-full" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-white text-center p-8">
        <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Wrench className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">
          No requests found
        </h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">
          No maintenance requests match your filters. Try adjusting them or
          create a new request.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
            Completed
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
            In Progress
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="text-slate-500">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">
            Pending
          </Badge>
        );
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
      case "urgent":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatCurrency = (amount: string | null) => {
    if (!amount || amount === "0") return "-";
    return `₦${Number(amount).toLocaleString()}`;
  };

  return (
    <>
      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="w-[280px]">Request</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request: any) => (
              <TableRow key={request.id} className="group hover:bg-slate-50/50">
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(request.priority)}
                      <span
                        className="font-medium text-slate-900 truncate max-w-[200px]"
                        title={request.title}
                      >
                        {request.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 uppercase tracking-wider text-[10px]">
                        {request.type.replace("_", " ")}
                      </span>
                      <span className="truncate max-w-[180px] opacity-75">
                        {request.description}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-xs font-medium text-slate-700">
                      <Building className="h-3 w-3 text-slate-400" />
                      {request.property?.name || "Unknown Property"}
                    </div>
                    {request.unit && (
                      <span className="text-[11px] text-slate-500 ml-4">
                        Unit {request.unit.unitNumber || request.unit.code}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    {request.actualCost && Number(request.actualCost) > 0 ? (
                      <span className="text-sm font-medium text-slate-900">
                        {formatCurrency(request.actualCost)}
                      </span>
                    ) : request.estimatedCost &&
                      Number(request.estimatedCost) > 0 ? (
                      <span className="text-xs text-slate-500">
                        Est: {formatCurrency(request.estimatedCost)}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    {formatDistanceToNow(new Date(request.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-slate-600"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleAddExpense(request)}
                      >
                        <Receipt className="h-4 w-4 mr-2" />
                        Record Expense
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(request.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Expense Dialog */}
      <UpdateExpenseDialog
        open={expenseDialogOpen}
        onOpenChange={setExpenseDialogOpen}
        request={selectedRequest}
      />
    </>
  );
}
