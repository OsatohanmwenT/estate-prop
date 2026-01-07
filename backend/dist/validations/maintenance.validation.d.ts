import { z } from "zod";
export declare const createMaintenanceRequestSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    type: z.ZodEnum<{
        plumbing: "plumbing";
        electrical: "electrical";
        hvac: "hvac";
        appliance: "appliance";
        structural: "structural";
        cleaning: "cleaning";
        painting: "painting";
        landscaping: "landscaping";
        security: "security";
        other: "other";
    }>;
    priority: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
        urgent: "urgent";
    }>>>;
    propertyId: z.ZodString;
    unitId: z.ZodOptional<z.ZodString>;
    assignedTo: z.ZodOptional<z.ZodString>;
    estimatedCost: z.ZodOptional<z.ZodNumber>;
    scheduledDate: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodDate>]>;
    vendorNotes: z.ZodOptional<z.ZodString>;
    managerNotes: z.ZodOptional<z.ZodString>;
    receipts: z.ZodOptional<z.ZodArray<z.ZodString>>;
    reminderDate: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodDate>]>;
}, z.core.$strip>;
export declare const updateMaintenanceRequestSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        plumbing: "plumbing";
        electrical: "electrical";
        hvac: "hvac";
        appliance: "appliance";
        structural: "structural";
        cleaning: "cleaning";
        painting: "painting";
        landscaping: "landscaping";
        security: "security";
        other: "other";
    }>>;
    priority: z.ZodOptional<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
        urgent: "urgent";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        in_progress: "in_progress";
        completed: "completed";
        cancelled: "cancelled";
    }>>;
    assignedTo: z.ZodOptional<z.ZodString>;
    estimatedCost: z.ZodOptional<z.ZodNumber>;
    actualCost: z.ZodOptional<z.ZodNumber>;
    scheduledDate: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodDate>]>;
    completedAt: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodDate>]>;
    vendorNotes: z.ZodOptional<z.ZodString>;
    managerNotes: z.ZodOptional<z.ZodString>;
    receipts: z.ZodOptional<z.ZodArray<z.ZodString>>;
    reminderDate: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodDate>]>;
}, z.core.$strip>;
export declare const addCommentSchema: z.ZodObject<{
    comment: z.ZodString;
}, z.core.$strip>;
export declare const addReceiptSchema: z.ZodObject<{
    receiptUrl: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=maintenance.validation.d.ts.map