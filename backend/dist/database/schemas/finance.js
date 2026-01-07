"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionsRelations = exports.invoicesRelations = exports.transactions = exports.invoices = exports.paymentMethodEnum = exports.invoiceStatusEnum = exports.invoiceTypeEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const lease_1 = require("./lease");
const user_1 = require("./user");
exports.invoiceTypeEnum = (0, pg_core_1.pgEnum)("invoice_type", [
    "rent",
    "service_charge",
    "legal_fee",
    "agency_fee",
    "caution_fee",
    "maintenance",
    "penalty",
]);
exports.invoiceStatusEnum = (0, pg_core_1.pgEnum)("invoice_status", [
    "draft",
    "pending",
    "paid",
    "partial",
    "overdue",
    "void",
]);
exports.paymentMethodEnum = (0, pg_core_1.pgEnum)("payment_method", [
    "bank_transfer",
    "cash",
    "cheque",
    "pos",
    "online",
]);
exports.invoices = (0, pg_core_1.pgTable)("invoices", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    organizationId: (0, pg_core_1.uuid)("organization_id")
        .notNull()
        .references(() => user_1.organizations.id, { onDelete: "cascade" }),
    leaseId: (0, pg_core_1.uuid)("lease_id").references(() => lease_1.leases.id),
    tenantId: (0, pg_core_1.uuid)("tenant_id")
        .references(() => user_1.tenants.id)
        .notNull(),
    type: (0, exports.invoiceTypeEnum)("type").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    amount: (0, pg_core_1.decimal)("amount", { precision: 12, scale: 2 }).notNull(),
    amountPaid: (0, pg_core_1.decimal)("amount_paid", { precision: 12, scale: 2 }).default("0"),
    ownerAmount: (0, pg_core_1.decimal)("owner_amount", { precision: 12, scale: 2 }),
    managementFee: (0, pg_core_1.decimal)("management_fee", { precision: 12, scale: 2 }),
    dueDate: (0, pg_core_1.timestamp)("due_date").notNull(),
    status: (0, exports.invoiceStatusEnum)("status").default("draft").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => [
    (0, pg_core_1.index)("idx_invoices_org").on(table.organizationId),
    (0, pg_core_1.index)("idx_invoices_tenant").on(table.tenantId),
    (0, pg_core_1.index)("idx_invoices_status").on(table.status),
    (0, pg_core_1.index)("idx_invoices_due_date").on(table.dueDate),
    (0, pg_core_1.index)("idx_invoices_lease").on(table.leaseId),
]);
exports.transactions = (0, pg_core_1.pgTable)("transactions", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    organizationId: (0, pg_core_1.uuid)("organization_id")
        .notNull()
        .references(() => user_1.organizations.id, { onDelete: "cascade" }),
    invoiceId: (0, pg_core_1.uuid)("invoice_id").references(() => exports.invoices.id),
    tenantId: (0, pg_core_1.uuid)("tenant_id")
        .references(() => user_1.tenants.id)
        .notNull(),
    amount: (0, pg_core_1.decimal)("amount", { precision: 12, scale: 2 }).notNull(),
    method: (0, exports.paymentMethodEnum)("method").default("bank_transfer").notNull(),
    reference: (0, pg_core_1.varchar)("reference", { length: 100 }),
    paidAt: (0, pg_core_1.timestamp)("paid_at").defaultNow().notNull(),
    bankName: (0, pg_core_1.varchar)("bank_name", { length: 100 }),
    accountNumber: (0, pg_core_1.varchar)("account_number", { length: 20 }),
    recordedBy: (0, pg_core_1.uuid)("recorded_by").references(() => user_1.users.id),
    receiptUrl: (0, pg_core_1.text)("receipt_url"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (table) => [
    (0, pg_core_1.index)("idx_transactions_org").on(table.organizationId),
    (0, pg_core_1.index)("idx_transactions_tenant").on(table.tenantId),
    (0, pg_core_1.index)("idx_transactions_invoice").on(table.invoiceId),
    (0, pg_core_1.index)("idx_transactions_paid_at").on(table.paidAt),
]);
exports.invoicesRelations = (0, drizzle_orm_1.relations)(exports.invoices, ({ one, many }) => ({
    lease: one(lease_1.leases, {
        fields: [exports.invoices.leaseId],
        references: [lease_1.leases.id],
    }),
    tenant: one(user_1.tenants, {
        fields: [exports.invoices.tenantId],
        references: [user_1.tenants.id],
    }),
    transactions: many(exports.transactions),
}));
exports.transactionsRelations = (0, drizzle_orm_1.relations)(exports.transactions, ({ one }) => ({
    invoice: one(exports.invoices, {
        fields: [exports.transactions.invoiceId],
        references: [exports.invoices.id],
    }),
    recordedBy: one(user_1.users, {
        fields: [exports.transactions.recordedBy],
        references: [user_1.users.id],
    }),
}));
//# sourceMappingURL=finance.js.map