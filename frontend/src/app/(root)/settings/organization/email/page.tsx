"use client";

import { Mail } from "lucide-react";
import { SettingsLayout } from "~/components/settings/SettingsLayout";
import { EmailTemplates } from "~/components/settings/EmailTemplates";

export default function EmailTemplatesPage() {
  return (
    <SettingsLayout
      icon={Mail}
      title="Email Templates"
      description="Customize notification emails sent to users"
    >
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <EmailTemplates />
      </div>
    </SettingsLayout>
  );
}
