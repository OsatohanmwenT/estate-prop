import { z } from "zod";
export declare const createInvoiceSchema: z.ZodObject<{
    tenantId: z.ZodUUID;
    leaseId: z.ZodNullable<z.ZodOptional<z.ZodUUID>>;
    type: z.ZodEnum<{
        rent: "rent";
        service_charge: "service_charge";
        legal_fee: "legal_fee";
        agency_fee: "agency_fee";
        caution_fee: "caution_fee";
        maintenance: "maintenance";
        penalty: "penalty";
    }>;
    description: z.ZodString;
    amount: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
    dueDate: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<{
        draft: "draft";
        pending: "pending";
        paid: "paid";
        partial: "partial";
        overdue: "overdue";
        void: "void";
    }>>;
    ownerAmount: z.ZodUnion<[z.ZodOptional<z.ZodNumber>, z.ZodOptional<z.ZodString>]>;
    managementFee: z.ZodUnion<[z.ZodOptional<z.ZodNumber>, z.ZodOptional<z.ZodString>]>;
}, z.core.$strip>;
export declare const updateInvoiceSchema: z.ZodObject<{
    amount: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        paid: "paid";
        overdue: "overdue";
    }>>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const recordPaymentSchema: z.ZodObject<{
    amount: z.ZodNumber;
    method: z.ZodEnum<{
        bank_transfer: "bank_transfer";
        cash: "cash";
        cheque: "cheque";
        pos: "pos";
        online: "online";
    }>;
    reference: z.ZodOptional<z.ZodString>;
    paidAt: z.ZodString;
    bankName: z.ZodOptional<z.ZodString>;
    accountNumber: z.ZodOptional<z.ZodString>;
    receiptUrl: z.ZodOptional<z.ZodURL>;
}, z.core.$strip>;
//# sourceMappingURL=invoice.validation.d.ts.map