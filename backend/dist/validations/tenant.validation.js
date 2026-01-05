"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTenantSchema = exports.createTenantSchema = void 0;
const zod_1 = require("zod");
exports.createTenantSchema = zod_1.z.object({
    fullName: zod_1.z
        .string()
        .min(1, "Full name is required")
        .max(256, "Full name must be less than 256 characters"),
    email: zod_1.z
        .email("Invalid email address")
        .max(256, "Email must be less than 256 characters"),
    phone: zod_1.z
        .string()
        .min(1, "Phone number is required")
        .max(50, "Phone number must be less than 50 characters"),
    nokName: zod_1.z
        .string()
        .max(256, "Next of kin name must be less than 256 characters")
        .optional(),
    nokPhone: zod_1.z
        .string()
        .max(50, "Next of kin phone must be less than 50 characters")
        .optional(),
});
exports.updateTenantSchema = exports.createTenantSchema.partial();
//# sourceMappingURL=tenant.validation.js.map