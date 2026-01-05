/**
 * Nodemailer Email Provider
 * Implements IEmailProvider using Nodemailer for SMTP-based email sending.
 */

import nodemailer, { Transporter } from "nodemailer";
import { logger } from "../../utils/logger";
import { config } from "../../config";
import {
  IEmailProvider,
  EmailOptions,
  BulkEmailResult,
} from "../interfaces/IEmailProvider";

interface NodemailerConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  fromName?: string;
  fromEmail?: string;
}

export class NodemailerProvider implements IEmailProvider {
  readonly name = "Nodemailer";
  private transporter: Transporter;
  private fromName: string;
  private fromEmail: string;

  constructor(customConfig?: Partial<NodemailerConfig>) {
    const smtpConfig: NodemailerConfig = {
      host: customConfig?.host || config.email.host,
      port: customConfig?.port || Number(config.email.port) || 587,
      secure: customConfig?.secure ?? config.email.secure === "true",
      auth: {
        user: customConfig?.auth?.user || config.email.user,
        pass: customConfig?.auth?.pass || config.email.pass,
      },
      fromName:
        customConfig?.fromName ||
        process.env.SMTP_FROM_NAME ||
        "Estate Management",
      fromEmail:
        customConfig?.fromEmail ||
        process.env.SMTP_FROM_EMAIL ||
        config.email.user,
    };

    this.fromName = smtpConfig.fromName!;
    this.fromEmail = smtpConfig.fromEmail!;

    this.transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: smtpConfig.auth,
      logger: false,
      debug: process.env.NODE_ENV === "development",
    });
  }

  async verify(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info(`✅ ${this.name}: Email server connection verified`);
      return true;
    } catch (error) {
      logger.error(`❌ ${this.name}: Email configuration error:`, error);
      return false;
    }
  }

  async sendEmail(options: EmailOptions, retries = 3): Promise<boolean> {
    const { to, subject, html, text, cc, bcc, attachments, replyTo } = options;

    // Test mode - don't actually send
    if (process.env.NODE_ENV === "test") {
      logger.info(
        `[TEST MODE] Would send email to: ${to}, Subject: ${subject}`
      );
      return true;
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const info = await this.transporter.sendMail({
          from: `"${this.fromName}" <${this.fromEmail}>`,
          to,
          cc,
          bcc,
          subject,
          text: text || this.htmlToText(html),
          html,
          attachments,
          replyTo,
        });

        logger.info(
          `✅ Email sent: ${info.messageId} to ${
            Array.isArray(to) ? to.join(", ") : to
          }`
        );
        return true;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        logger.error(
          `❌ Email send failed (attempt ${attempt}/${retries}): ${errorMessage}`
        );

        if (attempt === retries) {
          logger.error(
            `❌ Failed to send email after ${retries} attempts to: ${to}`
          );
          return false;
        }

        // Exponential backoff
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }

    return false;
  }

  async sendBulkEmails(
    emails: EmailOptions[],
    batchSize = 10,
    delayMs = 1000
  ): Promise<BulkEmailResult> {
    const result: BulkEmailResult = {
      sent: 0,
      failed: 0,
      failedEmails: [],
    };

    const totalBatches = Math.ceil(emails.length / batchSize);

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      const currentBatch = Math.floor(i / batchSize) + 1;

      logger.info(`📧 Sending batch ${currentBatch}/${totalBatches}`);

      const results = await Promise.all(
        batch.map(async (email) => {
          const success = await this.sendEmail(email);
          return { email, success };
        })
      );

      for (const { email, success } of results) {
        if (success) {
          result.sent++;
        } else {
          result.failed++;
          const recipient = Array.isArray(email.to) ? email.to[0] : email.to;
          result.failedEmails.push(recipient);
        }
      }

      // Delay between batches (except for last batch)
      if (i + batchSize < emails.length) {
        await this.delay(delayMs);
      }
    }

    logger.info(
      `📊 Bulk email complete: ${result.sent} sent, ${result.failed} failed`
    );
    return result;
  }

  /**
   * Simple HTML to text conversion for fallback
   */
  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Promise-based delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
