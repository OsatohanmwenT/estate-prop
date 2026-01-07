"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeaseSchema = exports.createLeaseSchema = void 0;
const zod_1 = require("zod");
exports.createLeaseSchema = zod_1.z.object({
    startDate: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid start date format",
    }),
    endDate: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid end date format",
    }),
    rentAmount: zod_1.z
        .union([zod_1.z.string(), zod_1.z.number()])
        .transform((val) => val.toString())
        .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Rent amount must be a positive number",
    }),
    tenantId: zod_1.z.string(),
    unitId: zod_1.z.string().uuid({ message: "Unit ID must be a valid UUID" }),
    billingCycle: zod_1.z.enum(["monthly", "quarterly", "biannually", "annually"]),
    cautionDeposit: zod_1.z
        .union([zod_1.z.string(), zod_1.z.number()])
        .transform((val) => val.toString())
        .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
        message: "Caution deposit must be a non-negative number",
    })
        .optional(),
    agencyFee: zod_1.z
        .union([zod_1.z.string(), zod_1.z.number()])
        .transform((val) => val.toString())
        .optional(),
    legalFee: zod_1.z
        .union([zod_1.z.string(), zod_1.z.number()])
        .transform((val) => val.toString())
        .optional(),
    notes: zod_1.z.string().optional(),
    agreementUrl: zod_1.z.string().optional(),
});
exports.updateLeaseSchema = exports.createLeaseSchema.partial();
//# sourceMappingURL=lease.validation.js.map