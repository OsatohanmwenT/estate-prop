"use client";

import { LucideIcon } from "lucide-react";
import MaxContainer from "~/components/shared/MaxContainer";

interface SettingsLayoutProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function SettingsLayout({
  icon: Icon,
  title,
  description,
  children,
}: SettingsLayoutProps) {
  return (
    <div className="h-full bg-slate-50/30">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-[1600px] mx-auto">
          <h1 className="text-lg font-bold uppercase tracking-wide text-slate-900 flex items-center gap-2">
            <Icon className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
            {title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        </div>
      </div>

      <MaxContainer className="py-8">{children}</MaxContainer>
    </div>
  );
}
