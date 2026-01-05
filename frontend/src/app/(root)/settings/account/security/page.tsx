"use client";

import { Shield } from "lucide-react";
import { SettingsLayout } from "~/components/settings/SettingsLayout";
import { SecuritySettings } from "~/components/settings/SecuritySettings";

export default function SecurityPage() {
  return (
    <SettingsLayout
      icon={Shield}
      title="Security"
      description="Manage your password and authentication"
    >
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <SecuritySettings />
      </div>
    </SettingsLayout>
  );
}
