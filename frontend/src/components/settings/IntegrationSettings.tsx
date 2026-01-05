"use client";

import { Plug, Zap, CreditCard, MessageSquare, Globe } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";

const integrations = [
  {
    id: "paystack",
    name: "Paystack",
    description: "Accept payments from tenants",
    icon: CreditCard,
    status: "available",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Send notifications via WhatsApp",
    icon: MessageSquare,
    status: "coming_soon",
  },
  {
    id: "sms",
    name: "SMS Gateway",
    description: "Send SMS notifications",
    icon: Zap,
    status: "coming_soon",
  },
  {
    id: "webhook",
    name: "Webhooks",
    description: "Connect to external services",
    icon: Globe,
    status: "coming_soon",
  },
];

const statusStyles: Record<string, string> = {
  connected: "bg-green-50 text-green-700 border-green-200",
  available: "bg-blue-50 text-blue-700 border-blue-200",
  coming_soon: "bg-slate-50 text-slate-500 border-slate-200",
};

const statusLabels: Record<string, string> = {
  connected: "Connected",
  available: "Available",
  coming_soon: "Coming Soon",
};

export function IntegrationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Integrations</h2>
        <p className="text-sm text-slate-500 mt-1">
          Connect third-party services to enhance your workflow
        </p>
      </div>

      <Separator />

      <div className="border border-dashed border-amber-200 bg-amber-50/50 rounded-lg p-4">
        <p className="text-sm text-amber-700">
          <span className="font-semibold">Coming Soon:</span> Integration
          settings are currently in development. Stay tuned!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration) => {
          const Icon = integration.icon;

          return (
            <div
              key={integration.id}
              className="p-4 border border-slate-200 rounded-lg bg-white"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {integration.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {integration.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm border ${
                    statusStyles[integration.status]
                  }`}
                >
                  {statusLabels[integration.status]}
                </Badge>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={integration.status !== "available"}
                  className="h-7 text-xs"
                >
                  {integration.status === "connected" ? "Configure" : "Connect"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
