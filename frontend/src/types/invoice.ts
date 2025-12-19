// Invoice Types
export type InvoiceType =
  | "rent"
  | "service_charge"
  | "legal_fee"
  | "agency_fee"
  | "caution_fee"
  | "maintenance"
  | "penalty";

export type InvoiceStatus =
  | "draft"
  | "pending"
  | "paid"
  | "partial"
  | "overdue"
  | "void";

export type PaymentMethod =
  | "bank_transfer"
  | "cash"
  | "cheque"
  | "pos"
  | "online";

export interface Invoice {
  id: string;
  organizationId: string;
  leaseId: string | null;
  tenantId: string;
  type: InvoiceType;
  description: string;
  amount: string;
  amountPaid: string;
  ownerAmount: string | null;
  managementFee: string | null;
  dueDate: string;
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;

  tenant?: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
  };
  lease?: {
    id: string;
    startDate: string;
    endDate: string;
    status: string;
    unitId: string;
  };
  unit?: {
    id: string;
    code: string;
    type: string;
    status: string;
    propertyId: string;
    propertyName: string;
    propertyAddress: string;
    propertyCity: string;
    propertyState: string;
  };
  transactions?: Transaction[];
}

export interface Transaction {
  id: string;
  organizationId: string;
  invoiceId: string | null;
  tenantId: string;
  amount: string;
  method: PaymentMethod;
  reference: string | null;
  paidAt: string;
  bankName: string | null;
  accountNumber: string | null;
  recordedBy: string | null;
  receiptUrl: string | null;
  createdAt: string;
}

export interface CreateInvoiceData {
  leaseId?: string | null;
  tenantId: string;
  type: InvoiceType;
  description: string;
  amount: number;
  ownerAmount?: number;
  managementFee?: number;
  dueDate: string;
  status?: InvoiceStatus;
}

export interface UpdateInvoiceData {
  leaseId?: string | null;
  type?: InvoiceType;
  description?: string;
  amount?: number;
  ownerAmount?: number;
  managementFee?: number;
  dueDate?: string;
  status?: InvoiceStatus;
}

export interface RecordPaymentData {
  amount: number;
  method: PaymentMethod;
  reference?: string;
  paidAt: string;
  bankName?: string;
  accountNumber?: string;
  receiptUrl?: string;
}

export interface InvoiceStats {
  status: InvoiceStatus;
  count: number;
  totalAmount: string;
}

export interface InvoiceFilters {
  status?: InvoiceStatus;
  tenantId?: string;
  leaseId?: string;
  propertyId?: string; // UUID string, not number
  startDate?: string;
  endDate?: string;
  search?: string;
}
