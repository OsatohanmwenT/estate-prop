import { z } from "zod";

export const registerSchema = z.object({
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
    .optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

export const loginSchema = z.object({
  email: z
    .email("Invalid email format")
    .max(256, "Email must not exceed 256 characters")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
