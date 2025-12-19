import cron from "node-cron";
import leaseService from "../services/lease.service";
import invoiceService from "../services/invoice.service";
import { logger } from "../utils/logger";

class JobScheduler {
  private async generateRecurringInvoices() {
    logger.info("🔄 Running recurring invoice generation job...");

    try {
      const activeLeases = await leaseService.getAllLeases({
        status: "active",
        limit: 1000,
      });

      let generatedCount = 0;
      let skippedCount = 0;

      for (const lease of activeLeases) {
        try {
          const invoice = await invoiceService.generateRecurringInvoice(
            lease.id
          );
          if (invoice) {
            generatedCount++;
            logger.info(`✅ Generated invoice for lease ${lease.id}`);
          } else {
            skippedCount++;
          }
        } catch (error: any) {
          logger.error(
            `❌ Failed to generate invoice for lease ${lease.id}: ${error.message}`
          );
        }
      }

      logger.info(
        `✅ Invoice generation completed: ${generatedCount} generated, ${skippedCount} skipped`
      );
    } catch (error) {
      logger.error("❌ Error in recurring invoice generation job:", error);
    }
  }

  private async updateOverdueInvoices() {
    logger.info("🔄 Running overdue invoice update job...");

    try {
      const overdueInvoices = await invoiceService.updateOverdueInvoices();
      logger.info(
        `✅ Updated ${overdueInvoices.length} invoices to overdue status`
      );
    } catch (error) {
      logger.error("❌ Error in overdue invoice update job:", error);
    }
  }

  private async updateExpiredLeases() {
    logger.info("🔄 Running expired lease update job...");

    try {
      const expiredLeases = await leaseService.updateExpiredLeases();
      logger.info(
        `✅ Updated ${expiredLeases.length} leases to expired status`
      );
    } catch (error) {
      logger.error("❌ Error in expired lease update job:", error);
    }
  }

  private async sendRentDueReminders() {
    logger.info("🔄 Running rent due reminders job...");

    try {
      // Get invoices due in 7 days
      const upcomingInvoices = await invoiceService.getUpcomingInvoices(7);

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

      logger.info(`📧 Would send ${sevenDayReminders.length} 7-day reminders`);
      logger.info(`📧 Would send ${oneDayReminders.length} 1-day reminders`);

      // TODO: Implement email sending when email service is integrated
      // For now, just log the invoices that need reminders
      if (sevenDayReminders.length > 0) {
        logger.info(
          `7-day reminders needed for invoices: ${sevenDayReminders
            .map((i) => i.id)
            .join(", ")}`
        );
      }
      if (oneDayReminders.length > 0) {
        logger.info(
          `1-day reminders needed for invoices: ${oneDayReminders
            .map((i) => i.id)
            .join(", ")}`
        );
      }
    } catch (error) {
      logger.error("❌ Error in rent due reminders job:", error);
    }
  }

  private async sendOverdueReminders() {
    logger.info("🔄 Running overdue reminders job...");

    try {
      const overdueInvoices = await invoiceService.getOverdueInvoices();

      logger.info(`📧 Would send ${overdueInvoices.length} overdue reminders`);

      // TODO: Implement email sending when email service is integrated
      if (overdueInvoices.length > 0) {
        logger.info(
          `Overdue reminders needed for invoices: ${overdueInvoices
            .map((i) => i.id)
            .join(", ")}`
        );
      }
    } catch (error) {
      logger.error("❌ Error in overdue reminders job:", error);
    }
  }

  public initializeJobs() {
    logger.info("⏰ Initializing scheduled jobs...");

    // Generate recurring invoices - Run daily at 1:00 AM
    cron.schedule("0 1 * * *", async () => {
      await this.generateRecurringInvoices();
    });
    logger.info("✅ Scheduled: Generate recurring invoices (daily at 1:00 AM)");

    // Update overdue invoices - Run daily at 2:00 AM
    cron.schedule("0 2 * * *", async () => {
      await this.updateOverdueInvoices();
    });
    logger.info("✅ Scheduled: Update overdue invoices (daily at 2:00 AM)");

    // Update expired leases - Run daily at 3:00 AM
    cron.schedule("0 3 * * *", async () => {
      await this.updateExpiredLeases();
    });
    logger.info("✅ Scheduled: Update expired leases (daily at 3:00 AM)");

    // Send rent due reminders - Run daily at 9:00 AM
    cron.schedule("0 9 * * *", async () => {
      await this.sendRentDueReminders();
    });
    logger.info("✅ Scheduled: Send rent due reminders (daily at 9:00 AM)");

    // Send overdue reminders - Run daily at 10:00 AM
    cron.schedule("0 10 * * *", async () => {
      await this.sendOverdueReminders();
    });
    logger.info("✅ Scheduled: Send overdue reminders (daily at 10:00 AM)");

    logger.info("✅ All scheduled jobs initialized successfully!");
  }

  // Manual trigger methods for testing
  public async manualGenerateInvoices() {
    await this.generateRecurringInvoices();
  }

  public async manualUpdateOverdue() {
    await this.updateOverdueInvoices();
  }

  public async manualUpdateExpired() {
    await this.updateExpiredLeases();
  }

  public async manualSendReminders() {
    await this.sendRentDueReminders();
    await this.sendOverdueReminders();
  }
}

export default new JobScheduler();
