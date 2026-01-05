"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRentDueReminders = sendRentDueReminders;
const invoice_service_1 = __importDefault(require("../services/invoice.service"));
const email_1 = require("../email");
const logger_1 = require("../utils/logger");
async function sendRentDueReminders() {
    const result = {
        sevenDayReminders: 0,
        oneDayReminders: 0,
        invoiceIds: [],
        emailsSent: 0,
        emailsFailed: 0,
    };
    try {
        const upcomingInvoices = await invoice_service_1.default.getUpcomingInvoices(7);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const sevenDayReminders = upcomingInvoices.filter((invoice) => {
            const dueDate = new Date(invoice.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays === 7;
        });
        const oneDayReminders = upcomingInvoices.filter((invoice) => {
            const dueDate = new Date(invoice.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays === 1;
        });
        result.sevenDayReminders = sevenDayReminders.length;
        result.oneDayReminders = oneDayReminders.length;
        result.invoiceIds = [
            ...sevenDayReminders.map((i) => i.id),
            ...oneDayReminders.map((i) => i.id),
        ];
        logger_1.logger.info(`📧 ${sevenDayReminders.length} 7-day reminders to send`);
        logger_1.logger.info(`📧 ${oneDayReminders.length} 1-day reminders to send`);
        const recipients = upcomingInvoices
            .filter((invoice) => invoice.tenant_email)
            .map((invoice) => ({
            email: invoice.tenant_email,
            data: {
                tenantName: invoice.tenant_name || "Tenant",
                propertyAddress: invoice.property_address || invoice.property_name || "Property",
                amount: invoice.amount,
                dueDate: new Date(invoice.dueDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
            },
        }));
        const emailResult = await email_1.emailService.sendBulkRentReminders(recipients);
        result.emailsSent = emailResult.sent;
        result.emailsFailed = emailResult.failed;
        logger_1.logger.info(`✅ Rent reminders completed: ${emailResult.sent} sent, ${emailResult.failed} failed`);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to send rent due reminders: ${message}`);
    }
    return result;
}
//# sourceMappingURL=sendRentDueReminders.js.map