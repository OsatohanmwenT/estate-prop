"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const lease_service_1 = __importDefault(require("../services/lease.service"));
const invoice_service_1 = __importDefault(require("../services/invoice.service"));
const logger_1 = require("../utils/logger");
class JobScheduler {
    async generateRecurringInvoices() {
        logger_1.logger.info("🔄 Running recurring invoice generation job...");
        try {
            const activeLeases = await lease_service_1.default.getAllLeases({
                status: "active",
                limit: 1000,
            });
            let generatedCount = 0;
            let skippedCount = 0;
            for (const lease of activeLeases) {
                try {
                    const invoice = await invoice_service_1.default.generateRecurringInvoice(lease.id);
                    if (invoice) {
                        generatedCount++;
                        logger_1.logger.info(`✅ Generated invoice for lease ${lease.id}`);
                    }
                    else {
                        skippedCount++;
                    }
                }
                catch (error) {
                    logger_1.logger.error(`❌ Failed to generate invoice for lease ${lease.id}: ${error.message}`);
                }
            }
            logger_1.logger.info(`✅ Invoice generation completed: ${generatedCount} generated, ${skippedCount} skipped`);
        }
        catch (error) {
            logger_1.logger.error("❌ Error in recurring invoice generation job:", error);
        }
    }
    async updateOverdueInvoices() {
        logger_1.logger.info("🔄 Running overdue invoice update job...");
        try {
            const overdueInvoices = await invoice_service_1.default.updateOverdueInvoices();
            logger_1.logger.info(`✅ Updated ${overdueInvoices.length} invoices to overdue status`);
        }
        catch (error) {
            logger_1.logger.error("❌ Error in overdue invoice update job:", error);
        }
    }
    async updateExpiredLeases() {
        logger_1.logger.info("🔄 Running expired lease update job...");
        try {
            const expiredLeases = await lease_service_1.default.updateExpiredLeases();
            logger_1.logger.info(`✅ Updated ${expiredLeases.length} leases to expired status`);
        }
        catch (error) {
            logger_1.logger.error("❌ Error in expired lease update job:", error);
        }
    }
    async sendRentDueReminders() {
        logger_1.logger.info("🔄 Running rent due reminders job...");
        try {
            const upcomingInvoices = await invoice_service_1.default.getUpcomingInvoices(7);
            const sevenDayReminders = upcomingInvoices.filter((invoice) => {
                const dueDate = new Date(invoice.dueDate);
                const today = new Date();
                const diffTime = dueDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays === 7;
            });
            const oneDayReminders = upcomingInvoices.filter((invoice) => {
                const dueDate = new Date(invoice.dueDate);
                const today = new Date();
                const diffTime = dueDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays === 1;
            });
            logger_1.logger.info(`📧 Would send ${sevenDayReminders.length} 7-day reminders`);
            logger_1.logger.info(`📧 Would send ${oneDayReminders.length} 1-day reminders`);
            if (sevenDayReminders.length > 0) {
                logger_1.logger.info(`7-day reminders needed for invoices: ${sevenDayReminders
                    .map((i) => i.id)
                    .join(", ")}`);
            }
            if (oneDayReminders.length > 0) {
                logger_1.logger.info(`1-day reminders needed for invoices: ${oneDayReminders
                    .map((i) => i.id)
                    .join(", ")}`);
            }
        }
        catch (error) {
            logger_1.logger.error("❌ Error in rent due reminders job:", error);
        }
    }
    async sendOverdueReminders() {
        logger_1.logger.info("🔄 Running overdue reminders job...");
        try {
            const overdueInvoices = await invoice_service_1.default.getOverdueInvoices();
            logger_1.logger.info(`📧 Would send ${overdueInvoices.length} overdue reminders`);
            if (overdueInvoices.length > 0) {
                logger_1.logger.info(`Overdue reminders needed for invoices: ${overdueInvoices
                    .map((i) => i.id)
                    .join(", ")}`);
            }
        }
        catch (error) {
            logger_1.logger.error("❌ Error in overdue reminders job:", error);
        }
    }
    initializeJobs() {
        logger_1.logger.info("⏰ Initializing scheduled jobs...");
        node_cron_1.default.schedule("0 1 * * *", async () => {
            await this.generateRecurringInvoices();
        });
        logger_1.logger.info("✅ Scheduled: Generate recurring invoices (daily at 1:00 AM)");
        node_cron_1.default.schedule("0 2 * * *", async () => {
            await this.updateOverdueInvoices();
        });
        logger_1.logger.info("✅ Scheduled: Update overdue invoices (daily at 2:00 AM)");
        node_cron_1.default.schedule("0 3 * * *", async () => {
            await this.updateExpiredLeases();
        });
        logger_1.logger.info("✅ Scheduled: Update expired leases (daily at 3:00 AM)");
        node_cron_1.default.schedule("0 9 * * *", async () => {
            await this.sendRentDueReminders();
        });
        logger_1.logger.info("✅ Scheduled: Send rent due reminders (daily at 9:00 AM)");
        node_cron_1.default.schedule("0 10 * * *", async () => {
            await this.sendOverdueReminders();
        });
        logger_1.logger.info("✅ Scheduled: Send overdue reminders (daily at 10:00 AM)");
        logger_1.logger.info("✅ All scheduled jobs initialized successfully!");
    }
    async manualGenerateInvoices() {
        await this.generateRecurringInvoices();
    }
    async manualUpdateOverdue() {
        await this.updateOverdueInvoices();
    }
    async manualUpdateExpired() {
        await this.updateExpiredLeases();
    }
    async manualSendReminders() {
        await this.sendRentDueReminders();
        await this.sendOverdueReminders();
    }
}
exports.default = new JobScheduler();
//# sourceMappingURL=job.scheduler.js.map