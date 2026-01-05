import invoiceService from "../services/invoice.service";
import { emailService, emailTemplates } from "../email";
import { logger } from "../utils/logger";

export interface OverdueRemindersResult {
  reminders: number;
  invoiceIds: string[];
  emailsSent: number;
  emailsFailed: number;
}

export async function sendOverdueReminders(): Promise<OverdueRemindersResult> {
  const result: OverdueRemindersResult = {
    reminders: 0,
    invoiceIds: [],
    emailsSent: 0,
    emailsFailed: 0,
  };

  try {
    const overdueInvoices = await invoiceService.getOverdueInvoices();
    result.reminders = overdueInvoices.length;
    result.invoiceIds = overdueInvoices.map((i) => i.id);

    logger.info(`📧 ${overdueInvoices.length} overdue reminders to send`);

    if (overdueInvoices.length === 0) {
      logger.info("No overdue invoices found");
      return result;
    }

    // Prepare bulk email data
    const recipients = overdueInvoices
      .filter((invoice) => invoice.tenant_email)
      .map((invoice) => {
        const daysOverdue = Math.floor(
          (Date.now() - new Date(invoice.dueDate).getTime()) /
            (1000 * 60 * 60 * 24)
        );

        return {
          email: invoice.tenant_email!,
          data: {
            tenantName: invoice.tenant_name || "Tenant",
            propertyAddress:
              invoice.property_address || invoice.property_name || "Property",
            amount: invoice.amount,
            daysOverdue,
          },
        };
      });

    // Use new EmailService for bulk sending
    const emailResult = await emailService.sendBulkOverdueNotices(recipients);

    result.emailsSent = emailResult.sent;
    result.emailsFailed = emailResult.failed;

    logger.info(
      `✅ Overdue reminders completed: ${emailResult.sent} sent, ${emailResult.failed} failed`
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to send overdue reminders: ${message}`);
  }

  return result;
}
