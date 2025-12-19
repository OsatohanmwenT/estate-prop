import { z } from "zod";

// Invoice type options
export const INVOICE_TYPES = [
  { value: "rent", label: "Rent" },
  { value: "service_charge", label: "Service Charge" },
  { value: "legal_fee", label: "Legal Fee" },
  { value: "agency_fee", label: "Agency Fee" },
  { value: "caution_fee", label: "Caution Fee" },
  { value: "maintenance", label: "Maintenance" },
  { value: "penalty", label: "Penalty" },
] as const;

// Invoice status options
export const INVOICE_STATUSES = [
  { value: "draft", label: "Draft", color: "bg-slate-100 text-slate-700" },
  { value: "pending", label: "Pending", color: "bg-amber-100 text-amber-700" },
  { value: "paid", label: "Paid", color: "bg-emerald-100 text-emerald-700" },
  {
    value: "partial",
    label: "Partially Paid",
    color: "bg-blue-100 text-blue-700",
  },
  { value: "overdue", label: "Overdue", color: "bg-red-100 text-red-700" },
  { value: "void", label: "Void", color: "bg-slate-100 text-slate-500" },
] as const;

// Create invoice schema
export const createInvoiceSchema = z.object({
  // Tenant & Lease Selection
  tenantId: z.string().min(1, "Tenant is required"),
  leaseId: z.string().optional().nullable(),

  // Invoice Details
  type: z.enum([
    "rent",
    "service_charge",
    "legal_fee",
    "agency_fee",
    "caution_fee",
    "maintenance",
    "penalty",
  ]),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description is too long"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["draft", "pending", "paid", "partial", "overdue", "void"]),

  // Optional fields for management properties
  ownerAmount: z.number().optional(),
  managementFee: z.number().optional(),
});

// Edit invoice schema (same as create)
export const editInvoiceSchema = createInvoiceSchema;

// Type inference
export type CreateInvoiceFormData = z.infer<typeof createInvoiceSchema>;
export type EditInvoiceFormData = z.infer<typeof editInvoiceSchema>;
