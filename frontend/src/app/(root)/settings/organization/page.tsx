"use client";

import { Building2, Loader2 } from "lucide-react";
import { SettingsLayout } from "~/components/settings/SettingsLayout";
import { OrganizationSettings } from "~/components/settings/OrganizationSettings";
import { useOrganization } from "~/lib/query/settings";

export default function OrganizationSettingsPage() {
  const { data: organization, isLoading } = useOrganization();

  if (isLoading) {
    return (
      <div className="h-full bg-slate-50/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <SettingsLayout
      icon={Building2}
      title="Organization"
      description="Manage your organization profile and branding"
    >
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <OrganizationSettings organization={organization} />
      </div>
    </SettingsLayout>
  );
}
