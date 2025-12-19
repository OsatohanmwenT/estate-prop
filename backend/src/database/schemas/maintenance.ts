import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
  uuid,
  pgEnum,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { properties } from "./property";
import { propertyUnits } from "./unit";
import { users, organizations } from "./user";

export const maintenancePriorityEnum = pgEnum("maintenance_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const maintenanceStatusEnum = pgEnum("maintenance_status", [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
]);

export const maintenanceTypeEnum = pgEnum("maintenance_type", [
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
]);

export const maintenanceRequests = pgTable("maintenance_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  type: maintenanceTypeEnum("type").notNull(),
  priority: maintenancePriorityEnum("priority").default("medium").notNull(),
  status: maintenanceStatusEnum("status").default("pending").notNull(),
  propertyId: uuid("property_id")
    .references(() => properties.id, { onDelete: "cascade" })
    .notNull(),
  unitId: uuid("unit_id").references(() => propertyUnits.id, {
    onDelete: "cascade",
  }),
  reportedBy: uuid("reported_by")
    .references(() => users.id, { onDelete: "restrict" })
    .notNull(), // Manager who reported
  assignedTo: uuid("assigned_to").references(() => users.id, {
    onDelete: "set null",
  }),
  estimatedCost: decimal("estimated_cost", { precision: 12, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 12, scale: 2 }),
  scheduledDate: timestamp("scheduled_date"),
  completedAt: timestamp("completed_at"),
  vendorNotes: text("vendor_notes"),
  managerNotes: text("manager_notes"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const maintenanceRequestsRelations = relations(
  maintenanceRequests,
  ({ one }) => ({
    property: one(properties, {
      fields: [maintenanceRequests.propertyId],
      references: [properties.id],
    }),
    unit: one(propertyUnits, {
      fields: [maintenanceRequests.unitId],
      references: [propertyUnits.id],
    }),
    reporter: one(users, {
      fields: [maintenanceRequests.reportedBy],
      references: [users.id],
    }),
    assignee: one(users, {
      fields: [maintenanceRequests.assignedTo],
      references: [users.id],
    }),
  })
);
