/**
 * Email Provider Interface
 * Abstracts the email sending implementation to allow easy provider swapping.
 * Any email provider (Nodemailer, Resend, SendGrid, etc.) should implement this interface.
 */

export interface EmailAttachment {
  filename: string;
  path?: string;
  content?: string | Buffer;
  contentType?: string;
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: EmailAttachment[];
  replyTo?: string;
}

export interface BulkEmailResult {
  sent: number;
  failed: number;
  failedEmails: string[];
}

export interface IEmailProvider {
  /**
   * Provider name for logging and identification
   */
  readonly name: string;

  /**
   * Send a single email
   * @param options - Email configuration
   * @returns Promise resolving to true if successful, false otherwise
   */
  sendEmail(options: EmailOptions): Promise<boolean>;

  /**
   * Send multiple emails in batches
   * @param emails - Array of email configurations
   * @param batchSize - Number of emails per batch (default: 10)
   * @param delayMs - Delay between batches in ms (default: 1000)
   * @returns Promise with send statistics
   */
  sendBulkEmails(
    emails: EmailOptions[],
    batchSize?: number,
    delayMs?: number
  ): Promise<BulkEmailResult>;

  /**
   * Verify the provider connection is working
   * @returns Promise resolving to true if connection is valid
   */
  verify(): Promise<boolean>;
}
