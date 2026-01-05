"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceRequestsRelations = exports.maintenanceRequests = exports.maintenanceTypeEnum = exports.maintenanceStatusEnum = exports.maintenancePriorityEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const property_1 = require("./property");
const unit_1 = require("./unit");
const user_1 = require("./user");
exports.maintenancePriorityEnum = (0, pg_core_1.pgEnum)("maintenance_priority", [
    "low",
    "medium",
    "high",
    "urgent",
]);
exports.maintenanceStatusEnum = (0, pg_core_1.pgEnum)("maintenance_status", [
    "pending",
    "in_progress",
    "completed",
    "cancelled",
]);
exports.maintenanceTypeEnum = (0, pg_core_1.pgEnum)("maintenance_type", [
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
exports.maintenanceRequests = (0, pg_core_1.pgTable)("maintenance_requests", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    organizationId: (0, pg_core_1.uuid)("organization_id")
        .notNull()
        .references(() => user_1.organizations.id, { onDelete: "cascade" }),
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    type: (0, exports.maintenanceTypeEnum)("type").notNull(),
    priority: (0, exports.maintenancePriorityEnum)("priority").default("medium").notNull(),
    status: (0, exports.maintenanceStatusEnum)("status").default("pending").notNull(),
    propertyId: (0, pg_core_1.uuid)("property_id")
        .references(() => property_1.properties.id, { onDelete: "cascade" })
        .notNull(),
    unitId: (0, pg_core_1.uuid)("unit_id").references(() => unit_1.propertyUnits.id, {
        onDelete: "cascade",
    }),
    reportedBy: (0, pg_core_1.uuid)("reported_by")
        .references(() => user_1.users.id, { onDelete: "restrict" })
        .notNull(),
    assignedTo: (0, pg_core_1.uuid)("assigned_to").references(() => user_1.users.id, {
        onDelete: "set null",
    }),
    estimatedCost: (0, pg_core_1.decimal)("estimated_cost", { precision: 12, scale: 2 }),
    actualCost: (0, pg_core_1.decimal)("actual_cost", { precision: 12, scale: 2 }),
    scheduledDate: (0, pg_core_1.timestamp)("scheduled_date"),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
    vendorNotes: (0, pg_core_1.text)("vendor_notes"),
    managerNotes: (0, pg_core_1.text)("manager_notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.maintenanceRequestsRelations = (0, drizzle_orm_1.relations)(exports.maintenanceRequests, ({ one }) => ({
    property: one(property_1.properties, {
        fields: [exports.maintenanceRequests.propertyId],
        references: [property_1.properties.id],
    }),
    unit: one(unit_1.propertyUnits, {
        fields: [exports.maintenanceRequests.unitId],
        references: [unit_1.propertyUnits.id],
    }),
    reporter: one(user_1.users, {
        fields: [exports.maintenanceRequests.reportedBy],
        references: [user_1.users.id],
    }),
    assignee: one(user_1.users, {
        fields: [exports.maintenanceRequests.assignedTo],
        references: [user_1.users.id],
    }),
}));
//# sourceMappingURL=maintenance.js.map