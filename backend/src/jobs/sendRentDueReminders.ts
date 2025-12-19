import invoiceService from "../services/invoice.service";
import { emailTemplates } from "../utils/emailTemplates";
import { logger } from "../utils/logger";
import { sendBulkEmails } from "../utils/sendEmail";

export interface RentRemindersResult {
  sevenDayReminders: number;
  oneDayReminders: number;
  invoiceIds: string[];
  emailsSent: number;
  emailsFailed: number;
}

export async function sendRentDueReminders(): Promise<RentRemindersResult> {
  const result: RentRemindersResult = {
    sevenDayReminders: 0,
    oneDayReminders: 0,
    invoiceIds: [],
    emailsSent: 0,
    emailsFailed: 0,
  };

  try {
    const upcomingInvoices = await invoiceService.getUpcomingInvoices(7);
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

    logger.info(`📧 ${sevenDayReminders.length} 7-day reminders to send`);
    logger.info(`📧 ${oneDayReminders.length} 1-day reminders to send`);

    const emails = upcomingInvoices
      .filter((invoice) => invoice.tenant_email)
      .map((invoice) => {
        const emailContent = emailTemplates.rentReminder({
          tenantName: invoice.tenant_name || "Tenant",
          propertyAddress:
            invoice.property_address || invoice.property_name || "Property",
          amount: invoice.amount,
          dueDate: new Date(invoice.dueDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
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
      `✅ Rent reminders completed: ${emailResult.sent} sent, ${emailResult.failed} failed`
    );

    if (emailResult.failedEmails.length > 0) {
      logger.warn("Failed to send emails to:", emailResult.failedEmails);
    }
  } catch (error: any) {
    throw new Error(`Failed to send rent due reminders: ${error.message}`);
  }

  return result;
}
