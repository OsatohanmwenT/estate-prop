import { z } from "zod";

// Billing cycle options
export const BILLING_CYCLES = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly (Every 3 months)" },
  { value: "biannually", label: "Bi-annually (Every 6 months)" },
  { value: "annually", label: "Annually (Yearly)" },
] as const;

// Lease status options
export const LEASE_STATUSES = [
  { value: "draft", label: "Draft", color: "bg-slate-100 text-slate-700" },
  { value: "active", label: "Active", color: "bg-green-100 text-green-700" },
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
  },
  { value: "expired", label: "Expired", color: "bg-red-100 text-red-700" },
  {
    value: "terminated",
    label: "Terminated",
    color: "bg-gray-100 text-gray-700",
  },
] as const;

// Create lease schema
export const createLeaseSchema = z
  .object({
    // Unit & Tenant Selection
    propertyId: z.string().min(1, "Property is required"),
    unitId: z.string().min(1, "Unit is required"),
    tenantId: z.string().min(1, "Tenant is required"),

    // Lease Period
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),

    // Financial Details
    rentAmount: z.coerce.number().min(1, "Rent amount must be greater than 0"),
    billingCycle: z.enum(["monthly", "quarterly", "biannually", "annually"]),
    cautionDeposit: z.coerce
      .number()
      .min(0, "Deposit cannot be negative")
      .default(0),
    agencyFee: z.coerce
      .number()
      .min(0, "Agency fee cannot be negative")
      .default(0),
    legalFee: z.coerce
      .number()
      .min(0, "Legal fee cannot be negative")
      .default(0),

    // Documents & Notes
    agreementUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

export type CreateLeaseFormData = z.infer<typeof createLeaseSchema>;

// Update lease schema
export const updateLeaseSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  rentAmount: z.coerce
    .number()
    .min(1, "Rent amount must be greater than 0")
    .optional(),
  billingCycle: z
    .enum(["monthly", "quarterly", "biannually", "annually"])
    .optional(),
  cautionDeposit: z.coerce.number().min(0).optional(),
  agencyFee: z.coerce.number().min(0).optional(),
  legalFee: z.coerce.number().min(0).optional(),
  agreementUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  notes: z.string().optional(),
});

export type UpdateLeaseFormData = z.infer<typeof updateLeaseSchema>;

// Terminate lease schema
export const terminateLeaseSchema = z.object({
  terminationDate: z.string().min(1, "Termination date is required"),
  reason: z.string().optional(),
});

export type TerminateLeaseFormData = z.infer<typeof terminateLeaseSchema>;

// Renew lease schema
export const renewLeaseSchema = z
  .object({
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    rentAmount: z.coerce.number().min(1, "Rent amount must be greater than 0"),
    billingCycle: z
      .enum(["monthly", "quarterly", "biannually", "annually"])
      .optional(),
    cautionDeposit: z.coerce.number().min(0).optional(),
    agencyFee: z.coerce.number().min(0).optional(),
    legalFee: z.coerce.number().min(0).optional(),
    agreementUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

export type RenewLeaseFormData = z.infer<typeof renewLeaseSchema>;

// Helper to calculate lease duration in months
export function calculateLeaseDuration(
  startDate: string,
  endDate: string
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  return months;
}

// Helper to calculate days remaining
export function calculateDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Helper to get suggested end date based on billing cycle
export function getSuggestedEndDate(
  startDate: string,
  billingCycle: string
): string {
  const start = new Date(startDate);
  let end = new Date(startDate);

  switch (billingCycle) {
    case "monthly":
      end.setMonth(end.getMonth() + 1);
      break;
    case "quarterly":
      end.setMonth(end.getMonth() + 3);
      break;
    case "biannually":
      end.setMonth(end.getMonth() + 6);
      break;
    case "annually":
      end.setFullYear(end.getFullYear() + 1);
      break;
    default:
      end.setFullYear(end.getFullYear() + 1);
  }

  return end.toISOString().split("T")[0];
}

// Helper to format billing cycle for display
export function formatBillingCycle(cycle: string): string {
  const found = BILLING_CYCLES.find((c) => c.value === cycle);
  return found?.label || cycle;
}

// Helper to get lease status badge props
export function getLeaseStatusBadge(status: string) {
  const found = LEASE_STATUSES.find((s) => s.value === status);
  return {
    label: found?.label || status,
    className: found?.color || "bg-gray-100 text-gray-700",
  };
}
