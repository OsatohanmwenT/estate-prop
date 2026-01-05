/**
 * Email Service
 * High-level email service that uses a provider abstraction.
 * Business logic is decoupled from the email sending implementation.
 */

import { IEmailProvider, EmailOptions } from "./interfaces/IEmailProvider";
import { NodemailerProvider } from "./providers/NodemailerProvider";
import {
  emailTemplates,
  RentReminderData,
  OverdueNoticeData,
  InvoiceData,
  WelcomeEmailData,
  LeaseExpirationData,
} from "./templates/emailTemplates";
import { logger } from "../utils/logger";

export class EmailService {
  private provider: IEmailProvider;

  /**
   * Create EmailService with a specific provider
   * @param provider - Email provider implementation (defaults to NodemailerProvider)
   */
  constructor(provider?: IEmailProvider) {
    this.provider = provider || new NodemailerProvider();
    logger.info(`📧 EmailService initialized with ${this.provider.name}`);
  }

  /**
   * Verify provider connection
   */
  async verify(): Promise<boolean> {
    return this.provider.verify();
  }

  /**
   * Send a raw email (for custom templates)
   */
  async send(options: EmailOptions): Promise<boolean> {
    return this.provider.sendEmail(options);
  }

  /**
   * Send rent reminder email
   */
  async sendRentReminder(to: string, data: RentReminderData): Promise<boolean> {
    const template = emailTemplates.rentReminder(data);
    return this.provider.sendEmail({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send overdue payment notice
   */
  async sendOverdueNotice(
    to: string,
    data: OverdueNoticeData
  ): Promise<boolean> {
    const template = emailTemplates.overdueNotice(data);
    return this.provider.sendEmail({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send invoice notification
   */
  async sendInvoice(to: string, data: InvoiceData): Promise<boolean> {
    const template = emailTemplates.invoiceGenerated(data);
    return this.provider.sendEmail({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send welcome email to new tenant
   */
  async sendWelcome(to: string, data: WelcomeEmailData): Promise<boolean> {
    const template = emailTemplates.welcomeTenant(data);
    return this.provider.sendEmail({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send lease expiration notice
   */
  async sendLeaseExpiration(
    to: string,
    data: LeaseExpirationData
  ): Promise<boolean> {
    const template = emailTemplates.leaseExpiration(data);
    return this.provider.sendEmail({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send bulk rent reminders
   */
  async sendBulkRentReminders(
    recipients: Array<{ email: string; data: RentReminderData }>
  ) {
    const emails: EmailOptions[] = recipients.map(({ email, data }) => {
      const template = emailTemplates.rentReminder(data);
      return {
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      };
    });

    return this.provider.sendBulkEmails(emails);
  }

  /**
   * Send bulk overdue notices
   */
  async sendBulkOverdueNotices(
    recipients: Array<{ email: string; data: OverdueNoticeData }>
  ) {
    const emails: EmailOptions[] = recipients.map(({ email, data }) => {
      const template = emailTemplates.overdueNotice(data);
      return {
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      };
    });

    return this.provider.sendBulkEmails(emails);
  }
}

// Default instance using NodemailerProvider
export const emailService = new EmailService();
