"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodemailerProvider = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = require("../../utils/logger");
const config_1 = require("../../config");
class NodemailerProvider {
    name = "Nodemailer";
    transporter;
    fromName;
    fromEmail;
    constructor(customConfig) {
        const smtpConfig = {
            host: customConfig?.host || config_1.config.email.host,
            port: customConfig?.port || Number(config_1.config.email.port) || 587,
            secure: customConfig?.secure ?? config_1.config.email.secure === "true",
            auth: {
                user: customConfig?.auth?.user || config_1.config.email.user,
                pass: customConfig?.auth?.pass || config_1.config.email.pass,
            },
            fromName: customConfig?.fromName ||
                process.env.SMTP_FROM_NAME ||
                "Estate Management",
            fromEmail: customConfig?.fromEmail ||
                process.env.SMTP_FROM_EMAIL ||
                config_1.config.email.user,
        };
        this.fromName = smtpConfig.fromName;
        this.fromEmail = smtpConfig.fromEmail;
        this.transporter = nodemailer_1.default.createTransport({
            host: smtpConfig.host,
            port: smtpConfig.port,
            secure: smtpConfig.secure,
            auth: smtpConfig.auth,
            logger: false,
            debug: process.env.NODE_ENV === "development",
        });
    }
    async verify() {
        try {
            await this.transporter.verify();
            logger_1.logger.info(`✅ ${this.name}: Email server connection verified`);
            return true;
        }
        catch (error) {
            logger_1.logger.error(`❌ ${this.name}: Email configuration error:`, error);
            return false;
        }
    }
    async sendEmail(options, retries = 3) {
        const { to, subject, html, text, cc, bcc, attachments, replyTo } = options;
        if (process.env.NODE_ENV === "test") {
            logger_1.logger.info(`[TEST MODE] Would send email to: ${to}, Subject: ${subject}`);
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
                logger_1.logger.info(`✅ Email sent: ${info.messageId} to ${Array.isArray(to) ? to.join(", ") : to}`);
                return true;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                logger_1.logger.error(`❌ Email send failed (attempt ${attempt}/${retries}): ${errorMessage}`);
                if (attempt === retries) {
                    logger_1.logger.error(`❌ Failed to send email after ${retries} attempts to: ${to}`);
                    return false;
                }
                await this.delay(Math.pow(2, attempt) * 1000);
            }
        }
        return false;
    }
    async sendBulkEmails(emails, batchSize = 10, delayMs = 1000) {
        const result = {
            sent: 0,
            failed: 0,
            failedEmails: [],
        };
        const totalBatches = Math.ceil(emails.length / batchSize);
        for (let i = 0; i < emails.length; i += batchSize) {
            const batch = emails.slice(i, i + batchSize);
            const currentBatch = Math.floor(i / batchSize) + 1;
            logger_1.logger.info(`📧 Sending batch ${currentBatch}/${totalBatches}`);
            const results = await Promise.all(batch.map(async (email) => {
                const success = await this.sendEmail(email);
                return { email, success };
            }));
            for (const { email, success } of results) {
                if (success) {
                    result.sent++;
                }
                else {
                    result.failed++;
                    const recipient = Array.isArray(email.to) ? email.to[0] : email.to;
                    result.failedEmails.push(recipient);
                }
            }
            if (i + batchSize < emails.length) {
                await this.delay(delayMs);
            }
        }
        logger_1.logger.info(`📊 Bulk email complete: ${result.sent} sent, ${result.failed} failed`);
        return result;
    }
    htmlToText(html) {
        return html
            .replace(/<[^>]*>/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
exports.NodemailerProvider = NodemailerProvider;
//# sourceMappingURL=NodemailerProvider.js.map