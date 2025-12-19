import { z } from "zod";

export const createTenantSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(256, "Full name must be less than 256 characters"),
  email: z
    .email("Invalid email address")
    .max(256, "Email must be less than 256 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .max(50, "Phone number must be less than 50 characters"),
  nokName: z
    .string()
    .max(256, "Next of kin name must be less than 256 characters")
    .optional(),
  nokPhone: z
    .string()
    .max(50, "Next of kin phone must be less than 50 characters")
    .optional(),
});

export const updateTenantSchema = createTenantSchema.partial();

export type CreateTenantData = z.infer<typeof createTenantSchema>;
export type UpdateTenantData = z.infer<typeof updateTenantSchema>;
