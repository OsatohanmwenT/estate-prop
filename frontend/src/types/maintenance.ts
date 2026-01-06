/**
 * Maintenance Types for Frontend
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

export interface MaintenanceRequest {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  type: MaintenanceType;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  propertyId: string;
  unitId: string | null;
  reportedBy: string;
  assignedTo: string | null;
  estimatedCost: string | null;
  actualCost: string | null;
  receipts: string[] | null;
  scheduledDate: string | null;
  completedAt: string | null;
  vendorNotes: string | null;
  managerNotes: string | null;
  reminderDate: string | null;
  reminderSent: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRequestWithDetails extends MaintenanceRequest {
  property: {
    id: string;
    name: string;
    address: string;
  };
  unit: {
    id: string;
    unitNumber: string;
  } | null;
  reporter: {
    id: string;
    fullName: string;
    email: string;
  };
  assignee: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  logs: MaintenanceLog[];
}

export interface MaintenanceLog {
  id: string;
  maintenanceRequestId: string;
  userId: string;
  action: MaintenanceLogAction;
  description: string;
  previousValue: string | null;
  newValue: string | null;
  notes: string | null;
  createdAt: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface CreateMaintenanceRequest {
  title: string;
  description: string;
  type: MaintenanceType;
  priority?: MaintenancePriority;
  propertyId: string;
  unitId?: string;
  assignedTo?: string;
  estimatedCost?: number;
  scheduledDate?: string;
  vendorNotes?: string;
  managerNotes?: string;
  receipts?: string[];
  reminderDate?: string;
}

export interface UpdateMaintenanceRequest {
  title?: string;
  description?: string;
  type?: MaintenanceType;
  priority?: MaintenancePriority;
  status?: MaintenanceStatus;
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
  scheduledDate?: string;
  completedAt?: string;
  vendorNotes?: string;
  managerNotes?: string;
  receipts?: string[];
  reminderDate?: string;
}

export interface MaintenanceStatistics {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  totalCost: number;
}

export interface MaintenanceByProperty {
  requests: Array<{
    id: string;
    title: string;
    description: string;
    type: MaintenanceType;
    priority: MaintenancePriority;
    status: MaintenanceStatus;
    estimatedCost: string | null;
    actualCost: string | null;
    receipts: string[] | null;
    scheduledDate: string | null;
    completedAt: string | null;
    createdAt: string;
    unit: {
      id: string;
      unitNumber: string;
    } | null;
  }>;
  totalSpent: number;
  count: number;
}

export interface MaintenanceByUnit {
  requests: Array<{
    id: string;
    title: string;
    description: string;
    type: MaintenanceType;
    priority: MaintenancePriority;
    status: MaintenanceStatus;
    estimatedCost: string | null;
    actualCost: string | null;
    receipts: string[] | null;
    scheduledDate: string | null;
    completedAt: string | null;
    createdAt: string;
  }>;
  totalSpent: number;
  count: number;
}

export interface MaintenanceReminder {
  id: string;
  title: string;
  status: MaintenanceStatus;
  reminderDate: string;
  reminderSent: string | null;
  assignedTo: string | null;
  property: {
    name: string;
  };
}

// Maintenance type display names
export const maintenanceTypeLabels: Record<MaintenanceType, string> = {
  plumbing: "Plumbing",
  electrical: "Electrical",
  hvac: "HVAC",
  appliance: "Appliance",
  structural: "Structural",
  cleaning: "Cleaning",
  painting: "Painting",
  landscaping: "Landscaping",
  security: "Security",
  other: "Other",
};

// Priority display names and colors
export const priorityConfig: Record<
  MaintenancePriority,
  { label: string; color: string }
> = {
  low: { label: "Low", color: "gray" },
  medium: { label: "Medium", color: "blue" },
  high: { label: "High", color: "orange" },
  urgent: { label: "Urgent", color: "red" },
};

// Status display names and colors
export const statusConfig: Record<
  MaintenanceStatus,
  { label: string; color: string }
> = {
  pending: { label: "Pending", color: "yellow" },
  in_progress: { label: "In Progress", color: "blue" },
  completed: { label: "Completed", color: "green" },
  cancelled: { label: "Cancelled", color: "gray" },
};
