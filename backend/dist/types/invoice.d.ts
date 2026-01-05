export type InvoiceByLeaseResult = {
    id: string;
    leaseId: number;
    amount: string;
    dueDate: Date;
    status: "pending" | "paid" | "overdue";
    note?: string | null;
    paymentDate?: Date | null;
    receiptUrl?: string | null;
    createdAt: Date;
    lease_startDate?: Date;
    lease_endDate?: Date;
    lease_tenantId?: string;
    lease_unitId?: number;
    tenant_id?: string;
    tenant_name?: string | null;
    tenant_email?: string | null;
    property_id?: number;
    property_name?: string | null;
    property_address?: string | null;
};
//# sourceMappingURL=invoice.d.ts.map