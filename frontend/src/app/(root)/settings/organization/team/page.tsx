"use client";

import { Users, Loader2 } from "lucide-react";
import { SettingsLayout } from "~/components/settings/SettingsLayout";
import { TeamSettings } from "~/components/settings/TeamSettings";
import { useOrganization } from "~/lib/query/settings";

export default function TeamPage() {
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
      icon={Users}
      title="Team Members"
      description="Manage your team and their roles"
    >
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <TeamSettings organizationId={organization?.id} />
      </div>
    </SettingsLayout>
  );
}
