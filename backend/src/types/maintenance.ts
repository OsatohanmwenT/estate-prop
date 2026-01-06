/**
 * Maintenance Request Types
 */

export type MaintenanceType =
  | "plumbing"
  | "electrical"
  | "hvac"
  | "appliance"
  | "structural"
  | "cleaning"
  | "painting"
  | "landscaping"
  | "security"
  | "other";

export type MaintenancePriority = "low" | "medium" | "high" | "urgent";

export type MaintenanceStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface CreateMaintenanceRequestDTO {
  title: string;
  description: string;
  type: MaintenanceType;
  priority?: MaintenancePriority;
  propertyId: string;
  unitId?: string;
  reportedBy: string;
  assignedTo?: string;
  estimatedCost?: number;
  scheduledDate?: Date;
  vendorNotes?: string;
  managerNotes?: string;
  receipts?: string[];
  reminderDate?: Date;
  organizationId: string;
}

export interface UpdateMaintenanceRequestDTO {
  title?: string;
  description?: string;
  type?: MaintenanceType;
  priority?: MaintenancePriority;
  status?: MaintenanceStatus;
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
  scheduledDate?: Date;
  completedAt?: Date;
  vendorNotes?: string;
  managerNotes?: string;
  receipts?: string[];
  reminderDate?: Date;
}

export interface MaintenanceRequestFilters {
  status?: MaintenanceStatus | MaintenanceStatus[];
  priority?: MaintenancePriority | MaintenancePriority[];
  type?: MaintenanceType | MaintenanceType[];
  propertyId?: string;
  unitId?: string;
  assignedTo?: string;
  reportedBy?: string;
  organizationId: string;
  limit?: number;
  offset?: number;
  search?: string;
}

export interface MaintenanceStatsDTO {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  avgCompletionDays: number;
  totalCost: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  byType: {
    [key in MaintenanceType]: number;
  };
}

// Maintenance Log Types
export type MaintenanceLogAction =
  | "created"
  | "status_changed"
  | "assigned"
  | "updated"
  | "comment_added"
  | "priority_changed"
  | "cost_updated"
  | "scheduled"
  | "completed"
  | "cancelled";

export interface CreateMaintenanceLogDTO {
  maintenanceRequestId: string;
  userId: string;
  action: MaintenanceLogAction;
  description: string;
  previousValue?: string;
  newValue?: string;
  notes?: string;
}

export interface MaintenanceLogDTO {
  id: string;
  maintenanceRequestId: string;
  userId: string;
  action: MaintenanceLogAction;
  description: string;
  previousValue: string | null;
  newValue: string | null;
  notes: string | null;
  createdAt: Date;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
}

