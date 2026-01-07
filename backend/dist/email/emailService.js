"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = exports.EmailService = void 0;
const NodemailerProvider_1 = require("./providers/NodemailerProvider");
const emailTemplates_1 = require("./templates/emailTemplates");
const logger_1 = require("../utils/logger");
class EmailService {
    provider;
    constructor(provider) {
        this.provider = provider || new NodemailerProvider_1.NodemailerProvider();
        logger_1.logger.info(`📧 EmailService initialized with ${this.provider.name}`);
    }
    async verify() {
        return this.provider.verify();
    }
    async send(options) {
        return this.provider.sendEmail(options);
    }
    async sendRentReminder(to, data) {
        const template = emailTemplates_1.emailTemplates.rentReminder(data);
        return this.provider.sendEmail({
            to,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });
    }
    async sendOverdueNotice(to, data) {
        const template = emailTemplates_1.emailTemplates.overdueNotice(data);
        return this.provider.sendEmail({
            to,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });
    }
    async sendInvoice(to, data) {
        const template = emailTemplates_1.emailTemplates.invoiceGenerated(data);
        return this.provider.sendEmail({
            to,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });
    }
    async sendWelcome(to, data) {
        const template = emailTemplates_1.emailTemplates.welcomeTenant(data);
        return this.provider.sendEmail({
            to,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });
    }
    async sendLeaseExpiration(to, data) {
        const template = emailTemplates_1.emailTemplates.leaseExpiration(data);
        return this.provider.sendEmail({
            to,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });
    }
    async sendBulkRentReminders(recipients) {
        const emails = recipients.map(({ email, data }) => {
            const template = emailTemplates_1.emailTemplates.rentReminder(data);
            return {
                to: email,
                subject: template.subject,
                html: template.html,
                text: template.text,
            };
        });
        return this.provider.sendBulkEmails(emails);
    }
    async sendBulkOverdueNotices(recipients) {
        const emails = recipients.map(({ email, data }) => {
            const template = emailTemplates_1.emailTemplates.overdueNotice(data);
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
exports.EmailService = EmailService;
exports.emailService = new EmailService();
//# sourceMappingURL=emailService.js.map