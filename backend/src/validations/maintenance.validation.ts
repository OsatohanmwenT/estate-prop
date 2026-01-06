/**
 * Maintenance Request Validation Schemas
 */

import { z } from "zod";

export const createMaintenanceRequestSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.enum([
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
  priority: z
    .enum(["low", "medium", "high", "urgent"])
    .optional()
    .default("medium"),
  propertyId: z.string().uuid("Invalid property ID"),
  unitId: z.string().uuid("Invalid unit ID").optional(),
  assignedTo: z.string().uuid("Invalid user ID").optional(),
  estimatedCost: z.number().positive().optional(),
  scheduledDate: z.string().datetime().optional().or(z.date().optional()),
  vendorNotes: z.string().optional(),
  managerNotes: z.string().optional(),
  receipts: z.array(z.string().url()).optional(),
  reminderDate: z.string().datetime().optional().or(z.date().optional()),
});

export const updateMaintenanceRequestSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  description: z.string().min(10).optional(),
  type: z
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
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  status: z
    .enum(["pending", "in_progress", "completed", "cancelled"])
    .optional(),
  assignedTo: z.string().uuid().optional(),
  estimatedCost: z.number().positive().optional(),
  actualCost: z.number().positive().optional(),
  scheduledDate: z.string().datetime().optional().or(z.date().optional()),
  completedAt: z.string().datetime().optional().or(z.date().optional()),
  vendorNotes: z.string().optional(),
  managerNotes: z.string().optional(),
  receipts: z.array(z.string().url()).optional(),
  reminderDate: z.string().datetime().optional().or(z.date().optional()),
});

export const addCommentSchema = z.object({
  comment: z.string().min(1, "Comment cannot be empty").max(2000),
});

export const addReceiptSchema = z.object({
  receiptUrl: z.string().url("Invalid receipt URL"),
});
