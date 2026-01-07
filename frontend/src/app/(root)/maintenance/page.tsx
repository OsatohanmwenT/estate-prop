"use client";

import { useState } from "react";
import { Plus, Wrench } from "lucide-react";
import { Button } from "~/components/ui/button";
import MaxContainer from "~/components/shared/MaxContainer";
import { MaintenanceStats } from "~/components/maintenance/MaintenanceStats";
import { MaintenanceList } from "~/components/maintenance/MaintenanceList";
import { CreateMaintenanceDialog } from "~/components/maintenance/CreateMaintenanceDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function MaintenancePage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wide text-slate-900 flex items-center gap-2">
              <Wrench className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
              Maintenance
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage property issues, work orders, and repairs
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              className="h-9 rounded-sm bg-slate-900 text-white hover:bg-slate-800 shadow-none"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="size-4 mr-2" strokeWidth={1.5} />
              Report Issue
            </Button>
          </div>
        </div>
      </div>

      <MaxContainer className="p-4 !max-h-fit !h-full sm:p-6 space-y-6">
        {/* Stats */}
        <MaintenanceStats />

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] h-9 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px] h-9 text-xs">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* List */}
        <MaintenanceList
          filters={{
            status: statusFilter === "all" ? undefined : statusFilter,
            priority: priorityFilter === "all" ? undefined : priorityFilter,
          }}
        />
      </MaxContainer>

      {/* Create Dialog */}
      <CreateMaintenanceDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
