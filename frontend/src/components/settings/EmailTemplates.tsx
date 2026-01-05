"use client";

import { Mail, FileText, Bell } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";

const emailTemplates = [
  {
    id: "invoice_reminder",
    name: "Invoice Reminder",
    description: "Sent when an invoice is due or overdue",
    icon: FileText,
  },
  {
    id: "lease_renewal",
    name: "Lease Renewal",
    description: "Sent before a lease expires",
    icon: FileText,
  },
  {
    id: "welcome_email",
    name: "Welcome Email",
    description: "Sent to new tenants",
    icon: Mail,
  },
  {
    id: "payment_received",
    name: "Payment Received",
    description: "Sent when a payment is recorded",
    icon: Bell,
  },
  {
    id: "maintenance_update",
    name: "Maintenance Update",
    description: "Sent for maintenance request updates",
    icon: Bell,
  },
];

export function EmailTemplates() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Email Templates
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Customize the emails sent to your tenants and owners
        </p>
      </div>

      <Separator />

      <div className="border border-dashed border-amber-200 bg-amber-50/50 rounded-lg p-4">
        <p className="text-sm text-amber-700">
          <span className="font-semibold">Coming Soon:</span> Email template
          customization is currently in development. Stay tuned!
        </p>
      </div>

      <div className="space-y-3">
        {emailTemplates.map((template) => {
          const Icon = template.icon;

          return (
            <div
              key={template.id}
              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50/50"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {template.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {template.description}
                  </p>
                </div>
              </div>

              <Badge
                variant="outline"
                className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm border bg-slate-100 text-slate-500 border-slate-200"
              >
                Default
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
