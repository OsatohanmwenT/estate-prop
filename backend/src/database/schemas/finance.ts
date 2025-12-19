import { sql } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  decimal,
  text,
  uuid,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { tenants, organizations, users } from "./user";
import { leases } from "./lease";
import { varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ------------------------------------------
// Financial Enums
// ------------------------------------------
export const invoiceTypeEnum = pgEnum("invoice_type", [
  "rent",
  "service_charge",
  "legal_fee",
  "agency_fee",
  "caution_fee", // Security Deposit
  "maintenance",
  "penalty", // Late payment fee
]);

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft", // Not sent to tenant yet
  "pending", // Sent, waiting for payment
  "paid", // Fully settled
  "partial", // Paid some, but not all
  "overdue", // Date passed
  "void", // Cancelled
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "bank_transfer",
  "cash",
  "cheque",
  "pos",
  "online", // Flutterwave/Paystack
]);

// ------------------------------------------
// 1. Invoices (What they owe)
// ------------------------------------------
export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),

    leaseId: uuid("lease_id").references(() => leases.id),
    tenantId: uuid("tenant_id")
      .references(() => tenants.id)
      .notNull(),
    type: invoiceTypeEnum("type").notNull(),
    description: text("description").notNull(), // e.g., "Rent 2025-2026"
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    amountPaid: decimal("amount_paid", { precision: 12, scale: 2 }).default(
      "0"
    ),
    ownerAmount: decimal("owner_amount", { precision: 12, scale: 2 }),
    managementFee: decimal("management_fee", { precision: 12, scale: 2 }),
    dueDate: timestamp("due_date").notNull(),
    status: invoiceStatusEnum("status").default("draft").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_invoices_org").on(table.organizationId),
    index("idx_invoices_tenant").on(table.tenantId),
    index("idx_invoices_status").on(table.status),
    index("idx_invoices_due_date").on(table.dueDate),
    index("idx_invoices_lease").on(table.leaseId),
  ]
);

// ------------------------------------------
// 2. Transactions (Money received)
// ------------------------------------------
export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    // Linking
    invoiceId: uuid("invoice_id").references(() => invoices.id), // Can be null if it's a generic wallet top-up
    tenantId: uuid("tenant_id")
      .references(() => tenants.id)
      .notNull(),
    // Payment Details
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    method: paymentMethodEnum("method").default("bank_transfer").notNull(),
    reference: varchar("reference", { length: 100 }), // Bank transaction ID
    paidAt: timestamp("paid_at").defaultNow().notNull(),
    bankName: varchar("bank_name", { length: 100 }),
    accountNumber: varchar("account_number", { length: 20 }),
    recordedBy: uuid("recorded_by").references(() => users.id),
    receiptUrl: text("receipt_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_transactions_org").on(table.organizationId),
    index("idx_transactions_tenant").on(table.tenantId),
    index("idx_transactions_invoice").on(table.invoiceId),
    index("idx_transactions_paid_at").on(table.paidAt),
  ]
);

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  lease: one(leases, {
    fields: [invoices.leaseId],
    references: [leases.id],
  }),
  tenant: one(tenants, {
    fields: [invoices.tenantId],
    references: [tenants.id],
  }),
  transactions: many(transactions), // An invoice can have multiple partial payments
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  invoice: one(invoices, {
    fields: [transactions.invoiceId],
    references: [invoices.id],
  }),
  recordedBy: one(users, {
    fields: [transactions.recordedBy],
    references: [users.id],
  }),
}));
