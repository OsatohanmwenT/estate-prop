import { 
  pgTable, 
  uuid, 
  varchar, 
  text, 
  timestamp, 
  pgEnum, 
  jsonb 
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { organizations, users } from './user';

// Support multiple channels (Critical for Nigerian market)
export const notificationChannelEnum = pgEnum('notification_channel', [
  'email', 
  'sms', 
  'whatsapp', 
  'push'
]);

export const notificationStatusEnum = pgEnum('notification_status', [
  'pending', 
  'sent', 
  'failed', 
  'delivered'
]);

export const notifications = pgTable('notifications', {
  id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
  
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),

  // Optional: Link to a system user (for "In-App" notifications)
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),

  // The actual destination (Snapshot)
  // We store this specifically because users change emails/phones, 
  // but the log must show where it was sent *at that time*.
  recipientEmail: varchar('recipient_email', { length: 255 }),
  recipientPhone: varchar('recipient_phone', { length: 50 }), 
  
  subject: varchar('subject', { length: 500 }),
  message: text('message').notNull(), // HTML content or SMS text
  
  channel: notificationChannelEnum('channel').default('email').notNull(),
  status: notificationStatusEnum('status').default('pending').notNull(),
  
  // ---------------------------------------------------------
  // THE POWER MOVE: Metadata
  // ---------------------------------------------------------
  // Store context here: { "invoiceId": "...", "maintenanceId": 12 }
  // This avoids having 10 nullable foreign key columns.
  metadata: jsonb('metadata'), 
  
  // Error logging (Why did it fail?)
  failureReason: text('failure_reason'),

  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').default(sql`now()`).notNull(),
});