"use client";

import PropertiesTable from "../properties/PropertiesTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import UnitsTable from "../units/UnitsTable";

const PortfolioTabs = () => {
  return (
    <Tabs defaultValue="properties" className="w-full">
      <TabsList className="bg-slate-50/50 p-1 h-10 gap-1 justify-start border border-slate-100 rounded-md w-fit">
        <TabsTrigger
          value="properties"
          className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-500 rounded-sm px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all"
        >
          Properties
        </TabsTrigger>
        <TabsTrigger
          value="units"
          className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-500 rounded-sm px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all"
        >
          Units
        </TabsTrigger>
      </TabsList>
      <TabsContent value="properties" className="mt-3">
        <PropertiesTable />
      </TabsContent>
      <TabsContent value="units" className="mt-3">
        <UnitsTable />
      </TabsContent>
    </Tabs>
  );
};

export default PortfolioTabs;
