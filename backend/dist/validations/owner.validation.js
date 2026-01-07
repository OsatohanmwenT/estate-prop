"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOwnerSchema = exports.createOwnerSchema = void 0;
const zod_1 = require("zod");
exports.createOwnerSchema = zod_1.z.object({
    fullName: zod_1.z
        .string()
        .min(2, "Full name must be at least 2 characters")
        .max(256, "Full name must not exceed 256 characters")
        .trim(),
    email: zod_1.z
        .email("Invalid email format")
        .max(256, "Email must not exceed 256 characters")
        .toLowerCase()
        .trim(),
    phone: zod_1.z
        .string()
        .min(10, "Phone number must be at least 10 characters")
        .max(50, "Phone number must not exceed 50 characters")
        .trim(),
    address: zod_1.z
        .string()
        .min(5, "Address must be at least 5 characters")
        .max(512, "Address must not exceed 512 characters")
        .trim(),
    bankName: zod_1.z
        .string()
        .max(100, "Bank name must not exceed 100 characters")
        .trim()
        .optional(),
    accountNumber: zod_1.z
        .string()
        .max(20, "Account number must not exceed 20 characters")
        .trim()
        .optional(),
    accountName: zod_1.z
        .string()
        .max(256, "Account name must not exceed 256 characters")
        .trim()
        .optional(),
    organizationId: zod_1.z
        .string()
        .uuid("Organization ID must be a valid UUID")
        .trim()
        .optional(),
    managedBy: zod_1.z.string().uuid("Manager ID must be a valid UUID").optional(),
});
exports.updateOwnerSchema = zod_1.z.object({
    fullName: zod_1.z
        .string()
        .min(2, "Full name must be at least 2 characters")
        .max(256, "Full name must not exceed 256 characters")
        .trim()
        .optional(),
    email: zod_1.z
        .email("Invalid email format")
        .max(256, "Email must not exceed 256 characters")
        .toLowerCase()
        .trim()
        .optional(),
    phone: zod_1.z
        .string()
        .min(10, "Phone number must be at least 10 characters")
        .max(50, "Phone number must not exceed 50 characters")
        .trim()
        .optional(),
    address: zod_1.z
        .string()
        .min(5, "Address must be at least 5 characters")
        .max(512, "Address must not exceed 512 characters")
        .trim()
        .optional(),
    bankName: zod_1.z
        .string()
        .max(100, "Bank name must not exceed 100 characters")
        .trim()
        .optional(),
    accountNumber: zod_1.z
        .string()
        .max(20, "Account number must not exceed 20 characters")
        .trim()
        .optional(),
    accountName: zod_1.z
        .string()
        .max(256, "Account name must not exceed 256 characters")
        .trim()
        .optional(),
    managedBy: zod_1.z.uuid("Invalid manager ID").optional().nullable(),
});
//# sourceMappingURL=owner.validation.js.map