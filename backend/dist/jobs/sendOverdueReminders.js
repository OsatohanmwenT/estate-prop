"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOverdueReminders = sendOverdueReminders;
const invoice_service_1 = __importDefault(require("../services/invoice.service"));
const email_1 = require("../email");
const logger_1 = require("../utils/logger");
async function sendOverdueReminders() {
    const result = {
        reminders: 0,
        invoiceIds: [],
        emailsSent: 0,
        emailsFailed: 0,
    };
    try {
        const overdueInvoices = await invoice_service_1.default.getOverdueInvoices();
        result.reminders = overdueInvoices.length;
        result.invoiceIds = overdueInvoices.map((i) => i.id);
        logger_1.logger.info(`📧 ${overdueInvoices.length} overdue reminders to send`);
        if (overdueInvoices.length === 0) {
            logger_1.logger.info("No overdue invoices found");
            return result;
        }
        const recipients = overdueInvoices
            .filter((invoice) => invoice.tenant_email)
            .map((invoice) => {
            const daysOverdue = Math.floor((Date.now() - new Date(invoice.dueDate).getTime()) /
                (1000 * 60 * 60 * 24));
            return {
                email: invoice.tenant_email,
                data: {
                    tenantName: invoice.tenant_name || "Tenant",
                    propertyAddress: invoice.property_address || invoice.property_name || "Property",
                    amount: invoice.amount,
                    daysOverdue,
                },
            };
        });
        const emailResult = await email_1.emailService.sendBulkOverdueNotices(recipients);
        result.emailsSent = emailResult.sent;
        result.emailsFailed = emailResult.failed;
        logger_1.logger.info(`✅ Overdue reminders completed: ${emailResult.sent} sent, ${emailResult.failed} failed`);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to send overdue reminders: ${message}`);
    }
    return result;
}
//# sourceMappingURL=sendOverdueReminders.js.map