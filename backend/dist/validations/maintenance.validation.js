"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReceiptSchema = exports.addCommentSchema = exports.updateMaintenanceRequestSchema = exports.createMaintenanceRequestSchema = void 0;
const zod_1 = require("zod");
exports.createMaintenanceRequestSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title must be at least 3 characters").max(255),
    description: zod_1.z.string().min(10, "Description must be at least 10 characters"),
    type: zod_1.z.enum([
        "plumbing",
        "electrical",
        "hvac",
        "appliance",
        "structural",
        "cleaning",
        "painting",
        "landscaping",
        "security",
        "other",
    ]),
    priority: zod_1.z
        .enum(["low", "medium", "high", "urgent"])
        .optional()
        .default("medium"),
    propertyId: zod_1.z.string().uuid("Invalid property ID"),
    unitId: zod_1.z.string().uuid("Invalid unit ID").optional(),
    assignedTo: zod_1.z.string().uuid("Invalid user ID").optional(),
    estimatedCost: zod_1.z.number().positive().optional(),
    scheduledDate: zod_1.z.string().datetime().optional().or(zod_1.z.date().optional()),
    vendorNotes: zod_1.z.string().optional(),
    managerNotes: zod_1.z.string().optional(),
    receipts: zod_1.z.array(zod_1.z.string().url()).optional(),
    reminderDate: zod_1.z.string().datetime().optional().or(zod_1.z.date().optional()),
});
exports.updateMaintenanceRequestSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(255).optional(),
    description: zod_1.z.string().min(10).optional(),
    type: zod_1.z
        .enum([
        "plumbing",
        "electrical",
        "hvac",
        "appliance",
        "structural",
        "cleaning",
        "painting",
        "landscaping",
        "security",
        "other",
    ])
        .optional(),
    priority: zod_1.z.enum(["low", "medium", "high", "urgent"]).optional(),
    status: zod_1.z
        .enum(["pending", "in_progress", "completed", "cancelled"])
        .optional(),
    assignedTo: zod_1.z.string().uuid().optional(),
    estimatedCost: zod_1.z.number().positive().optional(),
    actualCost: zod_1.z.number().positive().optional(),
    scheduledDate: zod_1.z.string().datetime().optional().or(zod_1.z.date().optional()),
    completedAt: zod_1.z.string().datetime().optional().or(zod_1.z.date().optional()),
    vendorNotes: zod_1.z.string().optional(),
    managerNotes: zod_1.z.string().optional(),
    receipts: zod_1.z.array(zod_1.z.string().url()).optional(),
    reminderDate: zod_1.z.string().datetime().optional().or(zod_1.z.date().optional()),
});
exports.addCommentSchema = zod_1.z.object({
    comment: zod_1.z.string().min(1, "Comment cannot be empty").max(2000),
});
exports.addReceiptSchema = zod_1.z.object({
    receiptUrl: zod_1.z.string().url("Invalid receipt URL"),
});
//# sourceMappingURL=maintenance.validation.js.map