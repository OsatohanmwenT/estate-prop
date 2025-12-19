import { z } from "zod";

export const createInvoiceSchema = z.object({
  body: z.object({
    tenantId: z.string().uuid({ message: "Valid tenant ID is required" }),
    leaseId: z.string().uuid().optional().nullable(),
    type: z.enum([
      "rent",
      "service_charge",
      "legal_fee",
      "agency_fee",
      "caution_fee",
      "maintenance",
      "penalty",
    ]),
    description: z.string().min(1, { message: "Description is required" }),
    amount: z
      .number()
      .positive({ message: "Amount must be a positive number" })
      .or(
        z
          .string()
          .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
            message: "Amount must be a positive number",
          })
      ),
    dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid due date format",
    }),
    status: z
      .enum(["draft", "pending", "paid", "partial", "overdue", "void"])
      .default("pending"),
    ownerAmount: z
      .number()
      .positive()
      .optional()
      .or(
        z
          .string()
          .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0)
          .optional()
      ),
    managementFee: z
      .number()
      .positive()
      .optional()
      .or(
        z
          .string()
          .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0)
          .optional()
      ),
  }),
});

export const updateInvoiceSchema = z.object({
  body: z.object({
    amount: z
      .string()
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Amount must be a positive number",
      })
      .optional(),
    dueDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid due date format",
      })
      .optional(),
    status: z.enum(["pending", "paid", "overdue"]).optional(),
    note: z.string().optional(),
  }),
});

export const recordPaymentSchema = z.object({
  body: z.object({
    amount: z.number().positive({ message: "Amount must be positive" }),
    method: z.enum(["bank_transfer", "cash", "cheque", "pos", "online"]),
    reference: z.string().optional(),
    paidAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid payment date format",
    }),
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    receiptUrl: z.string().url().optional(),
  }),
});

export const invoiceIdParamSchema = z.object({
  params: z.object({
    invoiceId: z.string().uuid({ message: "Invalid invoice ID" }),
  }),
});
