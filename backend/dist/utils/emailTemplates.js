"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplates = void 0;
exports.emailTemplates = {
    rentReminder: (data) => ({
        subject: "Rent Payment Reminder",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Rent Payment Reminder</h2>
        <p>Dear ${data.tenantName},</p>
        <p>This is a friendly reminder that your rent payment is due soon.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Property:</strong> ${data.propertyAddress}</p>
          <p><strong>Amount Due:</strong> ₦${data.amount.toLocaleString()}</p>
          <p><strong>Due Date:</strong> ${data.dueDate}</p>
        </div>
        <p>Please ensure payment is made on or before the due date.</p>
        <p>Thank you!</p>
      </div>
    `,
        text: `Rent Payment Reminder\n\nDear ${data.tenantName},\n\nYour rent payment of ₦${data.amount} is due on ${data.dueDate} for ${data.propertyAddress}.`,
    }),
    overdueNotice: (data) => ({
        subject: "URGENT: Overdue Rent Payment",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Overdue Payment Notice</h2>
        <p>Dear ${data.tenantName},</p>
        <p style="color: #dc2626; font-weight: bold;">Your rent payment is now ${data.daysOverdue} days overdue.</p>
        <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <p><strong>Property:</strong> ${data.propertyAddress}</p>
          <p><strong>Amount Overdue:</strong> ₦${data.amount.toLocaleString()}</p>
          <p><strong>Days Overdue:</strong> ${data.daysOverdue}</p>
        </div>
        <p>Please make payment immediately to avoid further action.</p>
        <p>Contact us if you need assistance.</p>
      </div>
    `,
        text: `OVERDUE: Your rent payment of ₦${data.amount} is ${data.daysOverdue} days overdue for ${data.propertyAddress}.`,
    }),
    invoiceGenerated: (data) => ({
        subject: `Invoice ${data.invoiceNumber} Generated`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Invoice Generated</h2>
        <p>Dear ${data.tenantName},</p>
        <p>A new invoice has been generated for your property.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
          <p><strong>Amount:</strong> ₦${data.amount.toLocaleString()}</p>
          <p><strong>Due Date:</strong> ${data.dueDate}</p>
        </div>
        <a href="${data.downloadLink}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">
          Download Invoice
        </a>
      </div>
    `,
    }),
};
//# sourceMappingURL=emailTemplates.js.map