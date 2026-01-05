"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
exports.sendEmail = sendEmail;
exports.sendBulkEmails = sendBulkEmails;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = require("./logger");
const config_1 = require("../config");
exports.transporter = nodemailer_1.default.createTransport({
    host: config_1.config.email.host,
    port: Number(config_1.config.email.port) || 587,
    secure: config_1.config.email.secure === "true",
    auth: {
        user: config_1.config.email.user,
        pass: config_1.config.email.pass,
    },
    logger: false,
    debug: process.env.NODE_ENV === "development",
});
exports.transporter.verify((error, success) => {
    if (error) {
        logger_1.logger.error("❌ Email configuration error:", error);
    }
    else {
        logger_1.logger.info("✅ Email server is ready to send messages");
    }
});
async function sendEmail(emailData, retries = 3) {
    const { to, subject, html, text, cc, bcc, attachments } = emailData;
    if (process.env.NODE_ENV === "test") {
        logger_1.logger.info(`[TEST MODE] Would send email to: ${to}, Subject: ${subject}`);
        return true;
    }
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const info = await exports.transporter.sendMail({
                from: `"${process.env.SMTP_FROM_NAME || "Estate Management"}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
                to,
                cc,
                bcc,
                subject,
                text,
                html,
                attachments,
            });
            logger_1.logger.info(`✅ Email sent successfully: ${info.messageId}`);
            logger_1.logger.info(`   To: ${to}`);
            logger_1.logger.info(`   Subject: ${subject}`);
            return true;
        }
        catch (error) {
            logger_1.logger.error(`❌ Email send failed (attempt ${attempt}/${retries}):`, error.message);
            if (attempt === retries) {
                logger_1.logger.error(`❌ Failed to send email after ${retries} attempts`);
                logger_1.logger.error(`   To: ${to}`);
                logger_1.logger.error(`   Subject: ${subject}`);
                return false;
            }
            await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
    }
    return false;
}
async function sendBulkEmails(emails, batchSize = 10, delayBetweenBatches = 1000) {
    const result = {
        sent: 0,
        failed: 0,
        failedEmails: [],
    };
    for (let i = 0; i < emails.length; i += batchSize) {
        const batch = emails.slice(i, i + batchSize);
        logger_1.logger.info(`📧 Sending email batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(emails.length / batchSize)}`);
        const promises = batch.map(async (email) => {
            const success = await sendEmail(email);
            if (success) {
                result.sent++;
            }
            else {
                result.failed++;
                result.failedEmails.push(Array.isArray(email.to) ? email.to[0] : email.to);
            }
        });
        await Promise.all(promises);
        if (i + batchSize < emails.length) {
            await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches));
        }
    }
    logger_1.logger.info(`📊 Bulk email completed: ${result.sent} sent, ${result.failed} failed`);
    return result;
}
exports.default = { sendEmail, sendBulkEmails, transporter: exports.transporter };
//# sourceMappingURL=sendEmail.js.map