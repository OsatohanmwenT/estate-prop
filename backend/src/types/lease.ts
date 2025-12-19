export interface CreateLeaseData {
  organizationId: string;
  startDate: Date;
  endDate: Date;
  rentAmount: string;
  tenantId: string;
  unitId: string;
  billingCycle: "monthly" | "quarterly" | "biannually" | "annually";
  cautionDeposit?: string;
  agencyFee?: string;
  legalFee?: string;
  notes?: string;
  agreementUrl?: string;
  createdBy: string;
}

export interface UpdateLeaseData {
  startDate?: Date;
  endDate?: Date;
  rentAmount?: string;
  status?: "active" | "terminated" | "expired";
  billingCycle?: "monthly" | "quarterly" | "biannually" | "annually";
  cautionDeposit?: string;
  agencyFee?: string;
  legalFee?: string;
  notes?: string;
  agreementUrl?: string;
}

export interface TerminateLeaseData {
  terminationDate?: string;
  reason?: string;
}

export interface CreateInvoiceData {
  organizationId: string;
  tenantId: string;
  leaseId?: string | null;
  type:
    | "rent"
    | "service_charge"
    | "legal_fee"
    | "agency_fee"
    | "caution_fee"
    | "maintenance"
    | "penalty";
  description: string;
  amount: number;
  dueDate: Date;
  status?: "draft" | "pending" | "paid" | "partial" | "overdue" | "void";
  ownerAmount?: number;
  managementFee?: number;
}

export interface UpdateInvoiceData {
  amount?: string;
  dueDate?: Date;
  status?: "pending" | "paid" | "overdue";
  note?: string;
  paymentDate?: Date;
  receiptUrl?: string;
}

export interface RecordPaymentData {
  amount: number;
  method: "bank_transfer" | "cash" | "cheque" | "pos" | "online";
  reference?: string;
  paidAt: string;
  bankName?: string;
  accountNumber?: string;
  receiptUrl?: string;
}

export type InvoiceFilters = {
  status?: "pending" | "paid" | "overdue";
  leaseId?: string;
  tenantId?: string;
  propertyId?: string;
  startDate?: Date;
  endDate?: Date;
};

export type PaginatedInvoiceQuery = InvoiceFilters & {
  limit: number;
  offset: number;
};
