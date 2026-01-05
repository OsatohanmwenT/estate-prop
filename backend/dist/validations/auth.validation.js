"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
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
        .optional(),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password must not exceed 128 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .email("Invalid email format")
        .max(256, "Email must not exceed 256 characters")
        .toLowerCase()
        .trim(),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password must not exceed 128 characters"),
});
//# sourceMappingURL=auth.validation.js.map