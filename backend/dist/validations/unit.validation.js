"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUnitSchema = exports.createUnitSchema = void 0;
const zod_1 = require("zod");
exports.createUnitSchema = zod_1.z.object({
    code: zod_1.z
        .string()
        .min(1, "Unit code is required")
        .max(50, "Unit code must be less than 50 characters"),
    type: zod_1.z.enum([
        "apartment",
        "studio",
        "penthouse",
        "duplex",
        "shop",
        "office",
        "warehouse",
        "townhouse",
    ], {
        message: "Invalid unit type",
    }),
    rentAmount: zod_1.z
        .union([zod_1.z.string(), zod_1.z.number()])
        .transform((val) => val.toString())
        .refine((val) => !isNaN(parseFloat(val)), {
        message: "Rent amount must be a valid number",
    }),
    floor: zod_1.z.number().int().min(0, "Floor must be a non-negative integer"),
    unitSize: zod_1.z.number().int().min(1, "Unit size must be greater than 0"),
    bedrooms: zod_1.z.number().int().min(0, "Bedrooms must be a non-negative integer"),
    bathrooms: zod_1.z
        .number()
        .int()
        .min(0, "Bathrooms must be a non-negative integer"),
    status: zod_1.z.enum(["vacant", "occupied"]).default("vacant"),
    condition: zod_1.z
        .enum(["good", "fair", "poor", "renovation_needed"])
        .default("good"),
    description: zod_1.z.string().optional(),
    amenities: zod_1.z.array(zod_1.z.string()).optional(),
    managementFeePercentage: zod_1.z
        .union([zod_1.z.string(), zod_1.z.number()])
        .transform((val) => val?.toString() || "0.00")
        .optional(),
    managementFeeFixed: zod_1.z
        .union([zod_1.z.string(), zod_1.z.number()])
        .transform((val) => val?.toString() || "0.00")
        .optional(),
});
exports.updateUnitSchema = exports.createUnitSchema.partial();
//# sourceMappingURL=unit.validation.js.map