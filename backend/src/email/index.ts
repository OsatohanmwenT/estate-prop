/**
 * Email Module
 * Clean exports for the email system.
 *
 * Usage:
 * import { emailService } from '../email';
 * await emailService.sendRentReminder(to, data);
 *
 * To switch providers:
 * import { EmailService, NodemailerProvider } from '../email';
 * const customService = new EmailService(new CustomProvider());
 */

// Core types
export type {
  IEmailProvider,
  EmailOptions,
  EmailAttachment,
  BulkEmailResult,
} from "./interfaces/IEmailProvider";

// Template types
export type {
  RentReminderData,
  OverdueNoticeData,
  InvoiceData,
  WelcomeEmailData,
  LeaseExpirationData,
} from "./templates/emailTemplates";

// Providers
export { NodemailerProvider } from "./providers/NodemailerProvider";

// Templates
export { emailTemplates } from "./templates/emailTemplates";

// Service
export { EmailService, emailService } from "./emailService";
