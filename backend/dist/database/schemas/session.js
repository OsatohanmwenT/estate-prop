"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_1 = require("./user");
exports.sessions = (0, pg_core_1.pgTable)("sessions", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("user_id")
        .notNull()
        .references(() => user_1.users.id, { onDelete: "cascade" }),
    refreshTokenHash: (0, pg_core_1.varchar)("refresh_token_hash", { length: 255 }).notNull(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (table) => [
    (0, pg_core_1.index)("idx_sessions_user_id").on(table.userId),
    (0, pg_core_1.index)("idx_sessions_expires_at").on(table.expiresAt),
]);
//# sourceMappingURL=session.js.map