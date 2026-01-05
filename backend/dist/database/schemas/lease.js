"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leasesRelations = exports.leases = exports.leaseStatusEnum = exports.billingCycleEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const finance_1 = require("./finance");
const unit_1 = require("./unit");
const user_1 = require("./user");
exports.billingCycleEnum = (0, pg_core_1.pgEnum)("billing_cycle", [
    "monthly",
    "quarterly",
    "biannually",
    "annually",
]);
exports.leaseStatusEnum = (0, pg_core_1.pgEnum)("leases_status", [
    "draft",
    "active",
    "pending",
    "terminated",
    "expired",
]);
exports.leases = (0, pg_core_1.pgTable)("leases", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    organizationId: (0, pg_core_1.uuid)("organization_id")
        .notNull()
        .references(() => user_1.organizations.id, { onDelete: "cascade" }),
    unitId: (0, pg_core_1.uuid)("unit_id")
        .references(() => unit_1.propertyUnits.id, { onDelete: "restrict" })
        .notNull(),
    tenantId: (0, pg_core_1.uuid)("tenant_id")
        .references(() => user_1.tenants.id, { onDelete: "restrict" })
        .notNull(),
    startDate: (0, pg_core_1.timestamp)("start_date").notNull(),
    endDate: (0, pg_core_1.timestamp)("end_date").notNull(),
    terminationDate: (0, pg_core_1.timestamp)("termination_date"),
    rentAmount: (0, pg_core_1.decimal)("rent_amount", { precision: 12, scale: 2 }).notNull(),
    billingCycle: (0, exports.billingCycleEnum)("billing_cycle")
        .default("annually")
        .notNull(),
    agencyFee: (0, pg_core_1.decimal)("agency_fee", { precision: 12, scale: 2 }).default("0"),
    legalFee: (0, pg_core_1.decimal)("legal_fee", { precision: 12, scale: 2 }).default("0"),
    cautionDeposit: (0, pg_core_1.decimal)("caution_deposit", {
        precision: 12,
        scale: 2,
    }).default("0"),
    status: (0, exports.leaseStatusEnum)("status").default("draft").notNull(),
    agreementUrl: (0, pg_core_1.text)("agreement_url"),
    notes: (0, pg_core_1.text)("notes"),
    createdBy: (0, pg_core_1.uuid)("created_by")
        .notNull()
        .references(() => user_1.users.id, { onDelete: "restrict" }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => [
    (0, pg_core_1.index)("idx_leases_org").on(table.organizationId),
    (0, pg_core_1.index)("idx_leases_tenant").on(table.tenantId),
    (0, pg_core_1.index)("idx_leases_one_active_per_unit")
        .on(table.unitId)
        .where((0, drizzle_orm_1.sql) `status = 'active'`),
]);
exports.leasesRelations = (0, drizzle_orm_1.relations)(exports.leases, ({ one, many }) => ({
    unit: one(unit_1.propertyUnits, {
        fields: [exports.leases.unitId],
        references: [unit_1.propertyUnits.id],
    }),
    tenant: one(user_1.tenants, {
        fields: [exports.leases.tenantId],
        references: [user_1.tenants.id],
    }),
    invoices: many(finance_1.invoices),
}));
//# sourceMappingURL=lease.js.map