import invoiceService from "../services/invoice.service";
import { emailTemplates } from "../utils/emailTemplates";
import { logger } from "../utils/logger";
import { sendBulkEmails } from "../utils/sendEmail";

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

    const emails = overdueInvoices
      .filter((invoice) => invoice.tenant_email)
      .map((invoice) => {
        const daysOverdue = Math.floor(
          (Date.now() - new Date(invoice.dueDate).getTime()) /
            (1000 * 60 * 60 * 24)
        );

        const emailContent = emailTemplates.overdueNotice({
          tenantName: invoice.tenant_name || "Tenant",
          propertyAddress:
            invoice.property_address || invoice.property_name || "Property",
          amount: invoice.amount,
          daysOverdue,
        });

        return {
          to: invoice.tenant_email!,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        };
      });

    const emailResult = await sendBulkEmails(emails, 10, 2000);

    result.emailsSent = emailResult.sent;
    result.emailsFailed = emailResult.failed;

    logger.info(
      `✅ Overdue reminders completed: ${emailResult.sent} sent, ${emailResult.failed} failed`
    );

    if (emailResult.failedEmails.length > 0) {
      logger.warn("Failed to send emails to:", emailResult.failedEmails);
    }
  } catch (error: any) {
    throw new Error(`Failed to send overdue reminders: ${error.message}`);
  }

  return result;
}
