// Lease status types
export type LeaseStatus =
  | "draft"
  | "active"
  | "pending"
  | "terminated"
  | "expired";
export type BillingCycle = "monthly" | "quarterly" | "biannually" | "annually";

// Response when creating a lease (includes initial invoice)
export interface CreateLeaseResponse {
  lease: Lease;
  invoice: {
    id: string;
    amount: string;
    status: string;
    dueDate: string;
    description: string;
  };
}

// Base Lease interface (matches backend response)
export interface Lease {
  id: string;
  unitId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  terminationDate?: string | null;
  rentAmount: string;
  billingCycle: BillingCycle;
  cautionDeposit?: string | null;
  agencyFee?: string | null;
  legalFee?: string | null;
  agreementUrl?: string | null;
  notes?: string | null;
  status: LeaseStatus;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Lease with related data (matches backend response)
export interface LeaseWithDetails extends Lease {
  tenant: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  } | null;
  unit: {
    id: string; // Always UUID string
    code: string;
    type: string;
    status?: string;
    propertyId?: string;
    floor?: number;
    rentAmount?: string;
  } | null;
  property: {
    id: string;
    name: string;
    address: string;
    city?: string;
    state?: string;
  } | null;
  creator?: {
    id: string;
    fullName: string;
  };
}

// For listing view
export interface LeaseListItem {
  id: string;
  startDate: string;
  endDate: string;
  rentAmount: string;
  status: LeaseStatus;
  billingCycle: BillingCycle;
  tenantName: string;
  tenantEmail: string;
  propertyName: string;
  unitCode: string;
  daysRemaining?: number;
}

// Create lease data (matches backend expectation)
export interface CreateLeaseData {
  unitId: number | string;
  tenantId: string;
  startDate: string;
  endDate: string;
  rentAmount: string | number;
  billingCycle: BillingCycle;
  depositAmount?: string | number;
  note?: string;
  documentUrl?: string;
  // Frontend convenience - will be mapped in service
  agencyFee?: number;
  legalFee?: number;
  cautionDeposit?: number;
  agreementUrl?: string;
  notes?: string;
}

// Update lease data
export interface UpdateLeaseData {
  startDate?: string;
  endDate?: string;
  rentAmount?: string | number;
  billingCycle?: BillingCycle;
  depositAmount?: string | number;
  note?: string;
  documentUrl?: string;
  // Frontend convenience
  agencyFee?: number;
  legalFee?: number;
  cautionDeposit?: number;
  agreementUrl?: string;
  notes?: string;
}

// Terminate lease data
export interface TerminateLeaseData {
  terminationDate: string;
  reason?: string;
}

// Renew lease data
export interface RenewLeaseData {
  startDate: string;
  endDate: string;
  rentAmount: number;
  billingCycle?: BillingCycle;
  agencyFee?: number;
  legalFee?: number;
  cautionDeposit?: number;
  agreementUrl?: string;
  notes?: string;
}

// Lease statistics
export interface LeaseStatistics {
  totalLeases: number;
  activeLeases: number;
  pendingLeases: number;
  expiredLeases: number;
  terminatedLeases: number;
  expiringSoon: number;
}

// Lease filter options
export interface LeaseFilters {
  status?: LeaseStatus;
  tenantId?: string;
  unitId?: string;
  propertyId?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  search?: string;
}

// Lease query params
export interface LeaseQueryParams extends LeaseFilters {
  page?: number;
  limit?: number;
  sortBy?: "startDate" | "endDate" | "rentAmount" | "createdAt";
  sortOrder?: "asc" | "desc";
}

// Response types
export interface GetLeasesResponse {
  leases: LeaseWithDetails[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetLeaseResponse {
  lease: LeaseWithDetails;
}
