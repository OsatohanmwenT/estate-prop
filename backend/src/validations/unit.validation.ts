import { z } from "zod";

export const createUnitSchema = z.object({
  code: z
    .string()
    .min(1, "Unit code is required")
    .max(50, "Unit code must be less than 50 characters"),
  type: z.enum(
    [
      "apartment",
      "studio",
      "penthouse",
      "duplex",
      "shop",
      "office",
      "warehouse",
      "townhouse",
    ],
    {
      message: "Invalid unit type",
    }
  ),
  rentAmount: z
    .union([z.string(), z.number()])
    .transform((val) => val.toString())
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Rent amount must be a valid number",
    }),
  floor: z.number().int().min(0, "Floor must be a non-negative integer"),
  unitSize: z.number().int().min(1, "Unit size must be greater than 0"),
  bedrooms: z.number().int().min(0, "Bedrooms must be a non-negative integer"),
  bathrooms: z
    .number()
    .int()
    .min(0, "Bathrooms must be a non-negative integer"),
  status: z.enum(["vacant", "occupied"]).default("vacant"),
  condition: z
    .enum(["good", "fair", "poor", "renovation_needed"])
    .default("good"),
  description: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  managementFeePercentage: z
    .union([z.string(), z.number()])
    .transform((val) => val?.toString() || "0.00")
    .optional(),
  managementFeeFixed: z
    .union([z.string(), z.number()])
    .transform((val) => val?.toString() || "0.00")
    .optional(),
});

export const updateUnitSchema = createUnitSchema.partial();

export type CreateUnitData = z.infer<typeof createUnitSchema>;
