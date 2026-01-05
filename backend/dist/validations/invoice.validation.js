"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordPaymentSchema = exports.updateInvoiceSchema = exports.createInvoiceSchema = void 0;
const zod_1 = require("zod");
exports.createInvoiceSchema = zod_1.z.object({
    tenantId: zod_1.z.uuid({ message: "Valid tenant ID is required" }),
    leaseId: zod_1.z.uuid().optional().nullable(),
    type: zod_1.z.enum([
        "rent",
        "service_charge",
        "legal_fee",
        "agency_fee",
        "caution_fee",
        "maintenance",
        "penalty",
    ]),
    description: zod_1.z.string().min(1, { message: "Description is required" }),
    amount: zod_1.z
        .number()
        .positive({ message: "Amount must be a positive number" })
        .or(zod_1.z
        .string()
        .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Amount must be a positive number",
    })),
    dueDate: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid due date format",
    }),
    status: zod_1.z
        .enum(["draft", "pending", "paid", "partial", "overdue", "void"])
        .default("pending"),
    ownerAmount: zod_1.z
        .number()
        .positive()
        .optional()
        .or(zod_1.z
        .string()
        .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0)
        .optional()),
    managementFee: zod_1.z
        .number()
        .positive()
        .optional()
        .or(zod_1.z
        .string()
        .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0)
        .optional()),
});
exports.updateInvoiceSchema = zod_1.z.object({
    amount: zod_1.z
        .string()
        .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Amount must be a positive number",
    })
        .optional(),
    dueDate: zod_1.z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid due date format",
    })
        .optional(),
    status: zod_1.z.enum(["pending", "paid", "overdue"]).optional(),
    note: zod_1.z.string().optional(),
});
exports.recordPaymentSchema = zod_1.z.object({
    amount: zod_1.z.number().positive({ message: "Amount must be positive" }),
    method: zod_1.z.enum(["bank_transfer", "cash", "cheque", "pos", "online"]),
    reference: zod_1.z.string().optional(),
    paidAt: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid payment date format",
    }),
    bankName: zod_1.z.string().optional(),
    accountNumber: zod_1.z.string().optional(),
    receiptUrl: zod_1.z.url().optional(),
});
//# sourceMappingURL=invoice.validation.js.map