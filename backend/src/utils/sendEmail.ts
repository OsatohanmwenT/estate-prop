import nodemailer from "nodemailer";
import { logger } from "./logger";
import { config } from "../config";

interface EmailInput {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: string | Buffer;
  }>;
}

export const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: Number(config.email.port) || 587,
  secure: config.email.secure === "true", // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
  logger: false,
  debug: process.env.NODE_ENV === "development",
});

transporter.verify((error, success) => {
  if (error) {
    logger.error("❌ Email configuration error:", error);
  } else {
    logger.info("✅ Email server is ready to send messages");
  }
});

export async function sendEmail(
  emailData: EmailInput,
  retries: number = 3
): Promise<boolean> {
  const { to, subject, html, text, cc, bcc, attachments } = emailData;

  if (process.env.NODE_ENV === "test") {
    logger.info(`[TEST MODE] Would send email to: ${to}, Subject: ${subject}`);
    return true;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const info = await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || "Estate Management"}" <${
          process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER
        }>`,
        to,
        cc,
        bcc,
        subject,
        text,
        html,
        attachments,
      });

      logger.info(`✅ Email sent successfully: ${info.messageId}`);
      logger.info(`   To: ${to}`);
      logger.info(`   Subject: ${subject}`);

      return true;
    } catch (error: any) {
      logger.error(
        `❌ Email send failed (attempt ${attempt}/${retries}):`,
        error.message
      );

      if (attempt === retries) {
        logger.error(`❌ Failed to send email after ${retries} attempts`);
        logger.error(`   To: ${to}`);
        logger.error(`   Subject: ${subject}`);
        return false;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }

  return false;
}

export async function sendBulkEmails(
  emails: EmailInput[],
  batchSize: number = 10,
  delayBetweenBatches: number = 1000
): Promise<{ sent: number; failed: number; failedEmails: string[] }> {
  const result = {
    sent: 0,
    failed: 0,
    failedEmails: [] as string[],
  };

  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);

    logger.info(
      `📧 Sending email batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
        emails.length / batchSize
      )}`
    );

    const promises = batch.map(async (email) => {
      const success = await sendEmail(email);
      if (success) {
        result.sent++;
      } else {
        result.failed++;
        result.failedEmails.push(
          Array.isArray(email.to) ? email.to[0] : email.to
        );
      }
    });

    await Promise.all(promises);

    if (i + batchSize < emails.length) {
      await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches));
    }
  }

  logger.info(
    `📊 Bulk email completed: ${result.sent} sent, ${result.failed} failed`
  );

  return result;
}

export default { sendEmail, sendBulkEmails, transporter };
