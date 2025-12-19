"use client";

import React from "react";
import { AppSidebar } from "~/components/shared/AppSider";
import { Header } from "~/components/shared/Header";
import ProtectedRoute from "~/components/shared/ProtectedRoute";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute>
      <AppSidebar />
      <div className="font-sans w-full min-h-screen bg-muted/5 flex flex-col">
        <Header />
        <main className="flex-1 w-full">{children}</main>
      </div>
    </ProtectedRoute>
  );
};

export default RootLayout;
