// Owner types (keeping existing)
export interface GetAllOwnersResponse {
  owners: Owner[];
}

export interface Owner {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  bankName?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  managedBy?: string | null;
  createdAt: string;
}

export interface CreateOwnerData {
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  organizationId?: string;
  managedBy?: string;
}

export interface UpdateOwnerData {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  managedBy?: string | null;
}

export interface OwnerProperty {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  category: string;
  createdAt: string;
}

export interface OwnerWithDetails extends Owner {
  propertiesCount: number;
  unitsCount: number;
  totalRevenue: string;
  managementFeeTotal?: string;
  ownerShareTotal?: string;
  properties: OwnerProperty[];
}

// Tenant types
export interface Tenant {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nokName?: string | null;
  nokPhone?: string | null;
  annualIncome?: string | null;
  metadata?: string | null;
  createdAt: string;
}

export interface TenantMetadata {
  occupation?: string;
  currentAddress?: string;
  guarantorName?: string;
  guarantorPhone?: string;
  allottedParking?: string;
  accessCardNo?: string;
  idType?: string;
  idNumber?: string;
  dateOfBirth?: string;
  nationality?: string;
  employerName?: string;
  employerAddress?: string;
  notes?: string;
}

export interface TenantWithDetails extends Tenant {
  propertyName?: string;
  propertyAddress?: string;
  unitType?: string;
  unitCode?: string;
  rentAmount?: string;
  status?: "active" | "overdue" | "terminated" | "expired";
  avatarUrl?: string;
  leaseId?: number;
  leaseStartDate?: string;
  leaseEndDate?: string;
  billingCycle?: string;
  depositAmount?: string;
}

export interface TenantProfile extends Omit<Tenant, "metadata"> {
  metadata: TenantMetadata | null;
  currentLease?: {
    id: number;
    startDate: string;
    endDate: string;
    rentAmount: string;
    depositAmount: string;
    billingCycle: "monthly" | "quarterly" | "biannually" | "annually";
    status: "active" | "terminated" | "expired";
    documentUrl?: string | null;
    property: {
      id: string;
      name: string;
      address: string;
    };
    unit: {
      id: number;
      code: string;
      type: string;
    };
  } | null;
  paymentHistory?: PaymentRecord[];
  documents?: TenantDocument[];
  communications?: CommunicationRecord[];
  maintenanceRequests?: MaintenanceRequest[];
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: "cash" | "bank_transfer" | "check" | "online" | "card";
  status: "paid" | "pending" | "overdue" | "partial";
  invoiceId?: string;
  receiptUrl?: string;
  note?: string;
}

export interface TenantDocument {
  id: string;
  name: string;
  type: "id" | "lease" | "receipt" | "reference" | "other";
  url: string;
  size?: string;
  uploadedAt: string;
}

export interface CommunicationRecord {
  id: string;
  date: string;
  type: "email" | "sms" | "call" | "in_person" | "letter";
  subject: string;
  summary: string;
  direction: "inbound" | "outbound";
  staffName?: string;
}

export interface MaintenanceRequest {
  id: string;
  date: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "normal" | "high" | "urgent";
  resolvedAt?: string;
}

export interface CreateTenantData {
  fullName: string;
  email: string;
  phone: string;
  nokName?: string;
  nokPhone?: string;
  annualIncome?: number;
  metadata?: string;
}

export interface CreateTenantWithLeaseData extends CreateTenantData {
  // Lease Details
  startDate: string;
  endDate: string;
  rentAmount: number;
  paymentTerms: "monthly" | "quarterly" | "biannually" | "annually";
  propertyId: number;
  unitId: number;
  depositAmount: number;

  // Additional Details (stored in metadata)
  occupation?: string;
  emergencyNo?: string;
  currentAddress?: string;
  guarantorName?: string;
  allottedParking?: string;
  accessCardNo?: string;
}

export interface UpdateTenantData {
  fullName?: string;
  email?: string;
  phone?: string;
  nokName?: string;
  nokPhone?: string;
  annualIncome?: number;
  metadata?: string;
}

// Lease types
export interface Lease {
  id: number;
  startDate: string;
  endDate: string;
  rentAmount: string;
  status: "active" | "terminated" | "expired";
  tenantId: string;
  billingCycle: "monthly" | "quarterly" | "biannually" | "annually";
  unitId: number;
  propertyId: string;
  depositAmount: string;
  note?: string | null;
  documentUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeaseWithDetails extends Lease {
  tenant?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  property?: {
    id: string;
    name: string;
    address: string;
  };
  unit?: {
    id: number;
    code: string;
    type: string;
  };
}

export interface CreateLeaseData {
  startDate: string;
  endDate: string;
  rentAmount: number;
  tenantId: string;
  billingCycle: "monthly" | "quarterly" | "biannually" | "annually";
  unitId: number;
  propertyId: string;
  depositAmount: number;
  note?: string;
  documentUrl?: string;
}

export interface UpdateLeaseData {
  startDate?: string;
  endDate?: string;
  rentAmount?: number;
  billingCycle?: "monthly" | "quarterly" | "biannually" | "annually";
  depositAmount?: number;
  note?: string;
  documentUrl?: string;
}

// Invoice types
export interface Invoice {
  id: string;
  leaseId: number;
  amount: string;
  dueDate: string;
  status: "pending" | "paid" | "overdue";
  note?: string | null;
  paymentDate?: string | null;
  receiptUrl?: string | null;
  createdAt: string;
}

export interface CreateInvoiceData {
  leaseId: number;
  amount: number;
  dueDate: string;
  note?: string;
}

export interface UpdateInvoiceData {
  amount?: number;
  dueDate?: string;
  status?: "pending" | "paid" | "overdue";
  note?: string;
}

export interface RecordPaymentData {
  paymentDate: string;
  receiptUrl?: string;
}

export interface InvoiceStats {
  totalInvoices: number;
  totalPending: number;
  totalPaid: number;
  totalOverdue: number;
  totalRevenue: string;
  totalOutstanding: string;
}
