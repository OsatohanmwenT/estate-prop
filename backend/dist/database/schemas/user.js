"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantsRelations = exports.ownersRelations = exports.membersRelations = exports.organizationsRelations = exports.tenants = exports.owners = exports.members = exports.organizations = exports.users = exports.memberStatusEnum = exports.orgRoleEnum = exports.userSystemRoleEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const property_1 = require("./property");
const lease_1 = require("./lease");
exports.userSystemRoleEnum = (0, pg_core_1.pgEnum)("user_system_role", ["admin", "user"]);
exports.orgRoleEnum = (0, pg_core_1.pgEnum)("org_role", [
    "owner",
    "manager",
    "surveyor",
    "agent",
    "staff",
]);
exports.memberStatusEnum = (0, pg_core_1.pgEnum)("member_status", [
    "active",
    "invited",
    "suspended",
]);
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    imageUrl: (0, pg_core_1.text)("image_url"),
    fullName: (0, pg_core_1.varchar)("full_name", { length: 256 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 256 }).notNull().unique(),
    phone: (0, pg_core_1.varchar)("phone", { length: 50 }),
    passwordHash: (0, pg_core_1.text)("password_hash").notNull(),
    systemRole: (0, exports.userSystemRoleEnum)("system_role").default("user").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (table) => [
    (0, pg_core_1.index)("idx_users_email").on(table.email),
    (0, pg_core_1.index)("idx_users_created_at").on(table.createdAt),
]);
exports.organizations = (0, pg_core_1.pgTable)("organizations", {
    id: (0, pg_core_1.uuid)("id")
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`)
        .primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    slug: (0, pg_core_1.text)("slug").notNull().unique(),
    ownerId: (0, pg_core_1.uuid)("owner_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "restrict" }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.members = (0, pg_core_1.pgTable)("members", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    organizationId: (0, pg_core_1.uuid)("organization_id")
        .notNull()
        .references(() => exports.organizations.id, { onDelete: "cascade" }),
    userId: (0, pg_core_1.uuid)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    role: (0, exports.orgRoleEnum)("role").default("agent").notNull(),
    joinedAt: (0, pg_core_1.timestamp)("joined_at").defaultNow().notNull(),
    status: (0, exports.memberStatusEnum)("status").default("active").notNull(),
    invitedBy: (0, pg_core_1.uuid)("invited_by").references(() => exports.users.id),
    invitedAt: (0, pg_core_1.timestamp)("invited_at"),
}, (table) => [
    (0, pg_core_1.index)("idx_members_org").on(table.organizationId),
    (0, pg_core_1.index)("idx_members_user").on(table.userId),
    (0, pg_core_1.uniqueIndex)("idx_members_org_user_unique").on(table.organizationId, table.userId),
]);
exports.owners = (0, pg_core_1.pgTable)("owners", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    organizationId: (0, pg_core_1.uuid)("organization_id")
        .notNull()
        .references(() => exports.organizations.id, { onDelete: "cascade" }),
    fullName: (0, pg_core_1.varchar)("full_name", { length: 256 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 256 }).notNull(),
    phone: (0, pg_core_1.varchar)("phone", { length: 50 }).notNull(),
    address: (0, pg_core_1.text)("address").notNull(),
    bankName: (0, pg_core_1.varchar)("bank_name", { length: 100 }),
    accountNumber: (0, pg_core_1.varchar)("account_number", { length: 20 }),
    accountName: (0, pg_core_1.varchar)("account_name", { length: 256 }),
    managedBy: (0, pg_core_1.uuid)("managed_by").references(() => exports.users.id, {
        onDelete: "set null",
    }),
    deletedAt: (0, pg_core_1.timestamp)("deleted_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (table) => [
    (0, pg_core_1.index)("idx_owners_org").on(table.organizationId),
    (0, pg_core_1.uniqueIndex)("idx_owners_org_email_unique").on(table.organizationId, table.email),
    (0, pg_core_1.index)("idx_owners_managed_by").on(table.managedBy),
]);
exports.tenants = (0, pg_core_1.pgTable)("tenants", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    organizationId: (0, pg_core_1.uuid)("organization_id")
        .notNull()
        .references(() => exports.organizations.id, { onDelete: "cascade" }),
    fullName: (0, pg_core_1.varchar)("full_name", { length: 256 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 256 }).notNull(),
    phone: (0, pg_core_1.varchar)("phone", { length: 50 }).notNull(),
    nokName: (0, pg_core_1.varchar)("nok_name", { length: 256 }),
    nokPhone: (0, pg_core_1.varchar)("nok_phone", { length: 50 }),
    annualIncome: (0, pg_core_1.decimal)("annual_income", { precision: 12, scale: 2 }),
    metadata: (0, pg_core_1.text)("metadata"),
    deletedAt: (0, pg_core_1.timestamp)("deleted_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (table) => [
    (0, pg_core_1.index)("idx_tenants_org").on(table.organizationId),
    (0, pg_core_1.uniqueIndex)("idx_tenants_org_email_unique").on(table.organizationId, table.email),
]);
exports.organizationsRelations = (0, drizzle_orm_1.relations)(exports.organizations, ({ many, one }) => ({
    members: many(exports.members),
    owners: many(exports.owners),
    tenants: many(exports.tenants),
    creator: one(exports.users, {
        fields: [exports.organizations.ownerId],
        references: [exports.users.id],
    }),
}));
exports.membersRelations = (0, drizzle_orm_1.relations)(exports.members, ({ one }) => ({
    user: one(exports.users, { fields: [exports.members.userId], references: [exports.users.id] }),
    organization: one(exports.organizations, {
        fields: [exports.members.organizationId],
        references: [exports.organizations.id],
    }),
}));
exports.ownersRelations = (0, drizzle_orm_1.relations)(exports.owners, ({ one, many }) => ({
    organization: one(exports.organizations, {
        fields: [exports.owners.organizationId],
        references: [exports.organizations.id],
    }),
    properties: many(property_1.properties),
}));
exports.tenantsRelations = (0, drizzle_orm_1.relations)(exports.tenants, ({ one, many }) => ({
    organization: one(exports.organizations, {
        fields: [exports.tenants.organizationId],
        references: [exports.organizations.id],
    }),
    leases: many(lease_1.leases),
}));
//# sourceMappingURL=user.js.map