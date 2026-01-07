"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifications = exports.notificationStatusEnum = exports.notificationChannelEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const user_1 = require("./user");
exports.notificationChannelEnum = (0, pg_core_1.pgEnum)("notification_channel", [
    "email",
    "sms",
    "whatsapp",
    "push",
]);
exports.notificationStatusEnum = (0, pg_core_1.pgEnum)("notification_status", [
    "pending",
    "sent",
    "failed",
    "delivered",
]);
exports.notifications = (0, pg_core_1.pgTable)("notifications", {
    id: (0, pg_core_1.uuid)("id")
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`)
        .primaryKey(),
    organizationId: (0, pg_core_1.uuid)("organization_id")
        .notNull()
        .references(() => user_1.organizations.id, { onDelete: "cascade" }),
    userId: (0, pg_core_1.uuid)("user_id").references(() => user_1.users.id, { onDelete: "cascade" }),
    recipientEmail: (0, pg_core_1.varchar)("recipient_email", { length: 255 }),
    recipientPhone: (0, pg_core_1.varchar)("recipient_phone", { length: 50 }),
    subject: (0, pg_core_1.varchar)("subject", { length: 500 }),
    message: (0, pg_core_1.text)("message").notNull(),
    channel: (0, exports.notificationChannelEnum)("channel").default("email").notNull(),
    status: (0, exports.notificationStatusEnum)("status").default("pending").notNull(),
    metadata: (0, pg_core_1.jsonb)("metadata"),
    failureReason: (0, pg_core_1.text)("failure_reason"),
    isRead: (0, pg_core_1.boolean)("is_read").default(false).notNull(),
    readAt: (0, pg_core_1.timestamp)("read_at"),
    sentAt: (0, pg_core_1.timestamp)("sent_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at")
        .default((0, drizzle_orm_1.sql) `now()`)
        .notNull(),
});
//# sourceMappingURL=notification.js.map