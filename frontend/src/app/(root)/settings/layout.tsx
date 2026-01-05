"use client";

import React from "react";
import { SettingsAppSidebar } from "~/components/settings/SettingsAppSidebar";
import { Header } from "~/components/shared/Header";
import ProtectedRoute from "~/components/shared/ProtectedRoute";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SettingsAppSidebar />
      <div className="font-sans w-full min-h-screen bg-muted/5 flex flex-col">
        <main className="flex-1 w-full">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
