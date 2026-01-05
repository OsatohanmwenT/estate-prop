import { z } from "zod";

export const createLeaseSchema = z.object({
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid start date format",
    }),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid end date format",
    }),
    rentAmount: z
      .union([z.string(), z.number()])
      .transform((val) => val.toString())
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Rent amount must be a positive number",
      }),
    tenantId: z.string(),
    unitId: z.string().uuid({ message: "Unit ID must be a valid UUID" }),
    billingCycle: z.enum(["monthly", "quarterly", "biannually", "annually"]),
    cautionDeposit: z
      .union([z.string(), z.number()])
      .transform((val) => val.toString())
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
        message: "Caution deposit must be a non-negative number",
      })
      .optional(),
    agencyFee: z
      .union([z.string(), z.number()])
      .transform((val) => val.toString())
      .optional(),
    legalFee: z
      .union([z.string(), z.number()])
      .transform((val) => val.toString())
      .optional(),
    notes: z.string().optional(),
    agreementUrl: z.string().optional(),
  });

export const updateLeaseSchema = createLeaseSchema.partial();