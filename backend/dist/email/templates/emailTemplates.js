"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplates = void 0;
exports.emailTemplates = {
    rentReminder: (data) => {
        const formattedAmount = formatCurrency(data.amount);
        return {
            subject: "Rent Payment Reminder",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Rent Payment Reminder</h2>
          <p>Dear ${data.tenantName},</p>
          <p>This is a friendly reminder that your rent payment is due soon.</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Property:</strong> ${data.propertyAddress}</p>
            <p><strong>Amount Due:</strong> ${formattedAmount}</p>
            <p><strong>Due Date:</strong> ${data.dueDate}</p>
          </div>
          <p>Please ensure payment is made on or before the due date.</p>
          <p>Thank you!</p>
        </div>
      `,
            text: `Rent Payment Reminder\n\nDear ${data.tenantName},\n\nYour rent payment of ${formattedAmount} is due on ${data.dueDate} for ${data.propertyAddress}.`,
        };
    },
    overdueNotice: (data) => {
        const formattedAmount = formatCurrency(data.amount);
        return {
            subject: "URGENT: Overdue Rent Payment",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Overdue Payment Notice</h2>
          <p>Dear ${data.tenantName},</p>
          <p style="color: #dc2626; font-weight: bold;">Your rent payment is now ${data.daysOverdue} days overdue.</p>
          <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <p><strong>Property:</strong> ${data.propertyAddress}</p>
            <p><strong>Amount Overdue:</strong> ${formattedAmount}</p>
            <p><strong>Days Overdue:</strong> ${data.daysOverdue}</p>
          </div>
          <p>Please make payment immediately to avoid further action.</p>
          <p>Contact us if you need assistance.</p>
        </div>
      `,
            text: `OVERDUE: Your rent payment of ${formattedAmount} is ${data.daysOverdue} days overdue for ${data.propertyAddress}.`,
        };
    },
    invoiceGenerated: (data) => {
        const formattedAmount = formatCurrency(data.amount);
        const downloadButton = data.downloadLink
            ? `<a href="${data.downloadLink}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">Download Invoice</a>`
            : "";
        return {
            subject: `Invoice ${data.invoiceNumber} Generated`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Invoice Generated</h2>
          <p>Dear ${data.tenantName},</p>
          <p>A new invoice has been generated for your property.</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
            <p><strong>Amount:</strong> ${formattedAmount}</p>
            <p><strong>Due Date:</strong> ${data.dueDate}</p>
          </div>
          ${downloadButton}
        </div>
      `,
            text: `Invoice ${data.invoiceNumber} for ${formattedAmount} generated. Due: ${data.dueDate}`,
        };
    },
    welcomeTenant: (data) => ({
        subject: "Welcome to Your New Home!",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Welcome, ${data.tenantName}!</h2>
        <p>We're excited to have you as our tenant.</p>
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
          <p><strong>Property:</strong> ${data.propertyAddress}</p>
          <p><strong>Lease Start:</strong> ${data.leaseStartDate}</p>
          <p><strong>Your Landlord:</strong> ${data.landlordName}</p>
        </div>
        <p>If you have any questions, feel free to reach out.</p>
        <p>Best regards,<br>${data.landlordName}</p>
      </div>
    `,
        text: `Welcome ${data.tenantName}! Your lease at ${data.propertyAddress} starts on ${data.leaseStartDate}.`,
    }),
    leaseExpiration: (data) => ({
        subject: "Lease Expiration Notice",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Lease Expiration Notice</h2>
        <p>Dear ${data.tenantName},</p>
        <p>This is to inform you that your lease is expiring soon.</p>
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <p><strong>Property:</strong> ${data.propertyAddress}</p>
          <p><strong>Expiry Date:</strong> ${data.expiryDate}</p>
          <p><strong>Days Remaining:</strong> ${data.daysUntilExpiry}</p>
        </div>
        <p>Please contact us to discuss renewal options.</p>
      </div>
    `,
        text: `Your lease at ${data.propertyAddress} expires on ${data.expiryDate} (${data.daysUntilExpiry} days remaining).`,
    }),
};
function formatCurrency(amount) {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
    }).format(num);
}
//# sourceMappingURL=emailTemplates.js.map