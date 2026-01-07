import { z } from "zod";

export const ownerFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(256, "Full name must not exceed 256 characters")
    .trim(),
  email: z
    .string()
    .max(256, "Email must not exceed 256 characters")
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(50, "Phone number must not exceed 50 characters")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(512, "Address must not exceed 512 characters")
    .optional()
    .or(z.literal("")),
});

export const bankDetailsSchema = z.object({
  bankName: z
    .string()
    .max(100, "Bank name must not exceed 100 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  accountNumber: z
    .string()
    .max(20, "Account number must not exceed 20 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  accountName: z
    .string()
    .max(256, "Account name must not exceed 256 characters")
    .trim()
    .optional()
    .or(z.literal("")),
});

export const fullOwnerSchema = ownerFormSchema.merge(bankDetailsSchema);

export type OwnerFormData = z.infer<typeof ownerFormSchema>;
export type BankDetailsData = z.infer<typeof bankDetailsSchema>;
export type FullOwnerData = z.infer<typeof fullOwnerSchema>;
