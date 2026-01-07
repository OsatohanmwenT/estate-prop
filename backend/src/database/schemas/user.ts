import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  text,
  uuid,
  timestamp,
  varchar,
  pgEnum,
  index,
  uniqueIndex,
  decimal,
} from "drizzle-orm/pg-core";
import { properties } from "./property";
import { leases } from "./lease";
export const userSystemRoleEnum = pgEnum("user_system_role", ["admin", "user"]);

// Role within a specific Agency (Organization)
export const orgRoleEnum = pgEnum("org_role", [
  "owner", // Created the agency account
  "manager", // Can delete things
  "surveyor", // Field worker
  "agent", // Sales/Leasing
  "staff", // Office support
]);

export const memberStatusEnum = pgEnum("member_status", [
  "active",
  "invited", // Pending acceptance
  "suspended",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    imageUrl: text("image_url"),
    fullName: varchar("full_name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull().unique(),
    phone: varchar("phone", { length: 50 }),
    passwordHash: text("password_hash").notNull(),
    systemRole: userSystemRoleEnum("system_role").default("user").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_users_email").on(table.email),
    index("idx_users_created_at").on(table.createdAt),
  ]
);

export const organizations = pgTable("organizations", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // e.g., app.com/my-agency
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const members = pgTable(
  "members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: orgRoleEnum("role").default("agent").notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    status: memberStatusEnum("status").default("active").notNull(),
    invitedBy: uuid("invited_by").references(() => users.id),
    invitedAt: timestamp("invited_at"),
  },
  (table) => [
    index("idx_members_org").on(table.organizationId),
    index("idx_members_user").on(table.userId),
    uniqueIndex("idx_members_org_user_unique").on(
      table.organizationId,
      table.userId
    ),
  ]
);

export const owners = pgTable(
  "owners",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    fullName: varchar("full_name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }),
    phone: varchar("phone", { length: 50 }),
    address: text("address"),
    bankName: varchar("bank_name", { length: 100 }),
    accountNumber: varchar("account_number", { length: 20 }),
    accountName: varchar("account_name", { length: 256 }),
    managedBy: uuid("managed_by").references(() => users.id, {
      onDelete: "set null",
    }),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_owners_org").on(table.organizationId),
    uniqueIndex("idx_owners_org_email_unique").on(
      table.organizationId,
      table.email
    ),
    index("idx_owners_managed_by").on(table.managedBy),
  ]
);

export const tenants = pgTable(
  "tenants",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // CRITICAL: Tenants belong to an Agency
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),

    fullName: varchar("full_name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }),
    phone: varchar("phone", { length: 50 }),
    nokName: varchar("nok_name", { length: 256 }),
    nokPhone: varchar("nok_phone", { length: 50 }),
    annualIncome: decimal("annual_income", { precision: 12, scale: 2 }),
    metadata: text("metadata"),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_tenants_org").on(table.organizationId),
    uniqueIndex("idx_tenants_org_email_unique").on(
      table.organizationId,
      table.email
    ),
  ]
);

// ------------------------------------------
// Relations
// ------------------------------------------

export const organizationsRelations = relations(
  organizations,
  ({ many, one }) => ({
    members: many(members),
    owners: many(owners),
    tenants: many(tenants),
    creator: one(users, {
      fields: [organizations.ownerId],
      references: [users.id],
    }),
  })
);

export const membersRelations = relations(members, ({ one }) => ({
  user: one(users, { fields: [members.userId], references: [users.id] }),
  organization: one(organizations, {
    fields: [members.organizationId],
    references: [organizations.id],
  }),
}));

export const ownersRelations = relations(owners, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [owners.organizationId],
    references: [organizations.id],
  }),
  properties: many(properties),
}));

export const tenantsRelations = relations(tenants, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [tenants.organizationId],
    references: [organizations.id],
  }),
  leases: many(leases),
}));
