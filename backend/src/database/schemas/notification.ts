import { sql } from "drizzle-orm";
import {
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { organizations, users } from "./user";

export const notificationChannelEnum = pgEnum("notification_channel", [
  "email",
  "sms",
  "whatsapp",
  "push",
]);

export const notificationStatusEnum = pgEnum("notification_status", [
  "pending",
  "sent",
  "failed",
  "delivered",
]);

export const notifications = pgTable("notifications", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),

  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),

  recipientEmail: varchar("recipient_email", { length: 255 }),
  recipientPhone: varchar("recipient_phone", { length: 50 }),

  subject: varchar("subject", { length: 500 }),
  message: text("message").notNull(), // HTML content or SMS text

  channel: notificationChannelEnum("channel").default("email").notNull(),
  status: notificationStatusEnum("status").default("pending").notNull(),

  metadata: jsonb("metadata"),

  failureReason: text("failure_reason"),

  isRead: boolean("is_read").default(false).notNull(),
  readAt: timestamp("read_at"),

  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
});
