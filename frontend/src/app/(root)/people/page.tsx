"use client";

import { Download, Users } from "lucide-react";
import { useState } from "react";
import { OwnersList } from "~/components/people/OwnersList";
import { TenantsList } from "~/components/people/TenantsList";
import MaxContainer from "~/components/shared/MaxContainer";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function PeoplePage() {
  const [activeTab, setActiveTab] = useState("tenants");

  return (
    <div className="min-h-screen bg-slate-50/30">
      {/* Linear Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wide text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
              People
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage your tenants, owners, and service professionals
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="h-9 rounded-sm border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
            >
              <Download className="size-4 mr-2" strokeWidth={1.5} />
              Import Data
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <MaxContainer className="py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-50/50 p-1 h-10 gap-1 justify-start border border-slate-100 rounded-md w-fit mb-4">
            <TabsTrigger
              value="tenants"
              className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-500 rounded-sm px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all"
            >
              Tenants
            </TabsTrigger>
            <TabsTrigger
              value="owners"
              className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-500 rounded-sm px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all"
            >
              Owners
            </TabsTrigger>
            <TabsTrigger
              value="service_pros"
              disabled
              className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-300 rounded-sm px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-not-allowed"
            >
              Service Pros
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tenants" className="mt-0">
            <TenantsList />
          </TabsContent>

          <TabsContent value="owners" className="mt-0">
            <OwnersList />
          </TabsContent>

          <TabsContent value="service_pros" className="mt-0">
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white border border-dashed border-slate-200 rounded-sm">
              <p>Service Pros module coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </MaxContainer>
    </div>
  );
}
