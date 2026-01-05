"use client";

import { User } from "lucide-react";
import { SettingsLayout } from "~/components/settings/SettingsLayout";
import { ProfileSettings } from "~/components/settings/ProfileSettings";

export default function AccountSettingsPage() {
  return (
    <SettingsLayout
      icon={User}
      title="Profile"
      description="Manage your personal information"
    >
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <ProfileSettings />
      </div>
    </SettingsLayout>
  );
}
