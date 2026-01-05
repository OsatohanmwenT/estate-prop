import { z } from "zod";

export const createOwnerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(256, "Full name must not exceed 256 characters")
    .trim(),
  email: z
    .email("Invalid email format")
    .max(256, "Email must not exceed 256 characters")
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(50, "Phone number must not exceed 50 characters")
    .trim(),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(512, "Address must not exceed 512 characters")
    .trim(),
  bankName: z
    .string()
    .max(100, "Bank name must not exceed 100 characters")
    .trim()
    .optional(),
  accountNumber: z
    .string()
    .max(20, "Account number must not exceed 20 characters")
    .trim()
    .optional(),
  accountName: z
    .string()
    .max(256, "Account name must not exceed 256 characters")
    .trim()
    .optional(),
  organizationId: z
    .string()
    .uuid("Organization ID must be a valid UUID")
    .trim(),
  managedBy: z.string().uuid("Manager ID must be a valid UUID").optional(),
});

export const updateOwnerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(256, "Full name must not exceed 256 characters")
    .trim()
    .optional(),
  email: z
    .email("Invalid email format")
    .max(256, "Email must not exceed 256 characters")
    .toLowerCase()
    .trim()
    .optional(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(50, "Phone number must not exceed 50 characters")
    .trim()
    .optional(),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(512, "Address must not exceed 512 characters")
    .trim()
    .optional(),
  bankName: z
    .string()
    .max(100, "Bank name must not exceed 100 characters")
    .trim()
    .optional(),
  accountNumber: z
    .string()
    .max(20, "Account number must not exceed 20 characters")
    .trim()
    .optional(),
  accountName: z
    .string()
    .max(256, "Account name must not exceed 256 characters")
    .trim()
    .optional(),
  managedBy: z.uuid("Invalid manager ID").optional().nullable(),
});

export type CreateOwnerInput = z.infer<typeof createOwnerSchema>;
export type UpdateOwnerInput = z.infer<typeof updateOwnerSchema>;
