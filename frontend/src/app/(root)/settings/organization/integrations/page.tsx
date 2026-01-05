"use client";

import { Plug } from "lucide-react";
import { SettingsLayout } from "~/components/settings/SettingsLayout";
import { IntegrationSettings } from "~/components/settings/IntegrationSettings";

export default function IntegrationsPage() {
  return (
    <SettingsLayout
      icon={Plug}
      title="Integrations"
      description="Connect third-party services and tools"
    >
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <IntegrationSettings />
      </div>
    </SettingsLayout>
  );
}
