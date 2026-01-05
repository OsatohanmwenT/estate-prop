"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePropertySchema = exports.createPropertySchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createPropertySchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(1, "Name is required")
        .max(256, "Name must not exceed 256 characters")
        .trim(),
    address: zod_1.default
        .string()
        .min(1, "Address is required")
        .max(512, "Address must not exceed 512 characters")
        .trim(),
    city: zod_1.default
        .string()
        .min(1, "City is required")
        .max(100, "City must not exceed 100 characters")
        .trim(),
    state: zod_1.default
        .string()
        .min(1, "State is required")
        .max(100, "State must not exceed 100 characters")
        .trim(),
    category: zod_1.default.enum(["residential", "commercial", "industrial", "mixed_use"], {
        message: "Category must be one of: residential, commercial, industrial, mixed_use",
    }),
    lga: zod_1.default
        .string()
        .max(100, "LGA must not exceed 100 characters")
        .trim()
        .optional(),
    amenities: zod_1.default.array(zod_1.default.string()).optional(),
    ownerId: zod_1.default.string().uuid("Owner ID must be a valid UUID").trim(),
    organizationId: zod_1.default
        .string()
        .uuid("Organization ID must be a valid UUID")
        .trim(),
    description: zod_1.default
        .string()
        .max(1000, "Description must not exceed 1000 characters")
        .optional(),
    images: zod_1.default.array(zod_1.default.string().url("Each image must be a valid URL")).optional(),
});
exports.updatePropertySchema = exports.createPropertySchema.partial();
//# sourceMappingURL=property.validation.js.map