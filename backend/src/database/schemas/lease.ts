import { relations, sql } from "drizzle-orm";
import {
  decimal,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { invoices } from "./finance";
import { propertyUnits } from "./unit";
import { organizations, tenants, users } from "./user";

export const billingCycleEnum = pgEnum("billing_cycle", [
  "monthly",
  "quarterly",
  "biannually",
  "annually",
]);

export const leaseStatusEnum = pgEnum("leases_status", [
  "draft", // Offer created, awaiting payment
  "active",
  "pending", // Signed but not started
  "terminated", // Ended early
  "expired", // Ended naturally
]);

export const leases = pgTable(
  "leases",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    unitId: uuid("unit_id")
      .references(() => propertyUnits.id, { onDelete: "restrict" })
      .notNull(),
    tenantId: uuid("tenant_id")
      .references(() => tenants.id, { onDelete: "restrict" })
      .notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    terminationDate: timestamp("termination_date"), // If they leave early
    rentAmount: decimal("rent_amount", { precision: 12, scale: 2 }).notNull(),
    billingCycle: billingCycleEnum("billing_cycle")
      .default("annually")
      .notNull(),
    agencyFee: decimal("agency_fee", { precision: 12, scale: 2 }).default("0"),
    legalFee: decimal("legal_fee", { precision: 12, scale: 2 }).default("0"),
    cautionDeposit: decimal("caution_deposit", {
      precision: 12,
      scale: 2,
    }).default("0"),
    status: leaseStatusEnum("status").default("draft").notNull(),
    agreementUrl: text("agreement_url"), // The signed PDF
    notes: text("notes"),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_leases_org").on(table.organizationId),
    index("idx_leases_tenant").on(table.tenantId),
    index("idx_leases_one_active_per_unit")
      .on(table.unitId)
      .where(sql`status = 'active'`),
  ]
);

export const leasesRelations = relations(leases, ({ one, many }) => ({
  unit: one(propertyUnits, {
    fields: [leases.unitId],
    references: [propertyUnits.id],
  }),
  tenant: one(tenants, {
    fields: [leases.tenantId],
    references: [tenants.id],
  }),
  invoices: many(invoices),
}));
