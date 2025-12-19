"use client";

import { useQuery } from "@tanstack/react-query";
import { Filter, LayoutGrid, List, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import MaxContainer from "~/components/shared/MaxContainer";
import { TenantsTable } from "~/components/tenants/TenantsTable";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { tenantService } from "~/services/tenantService";

export default function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const { data: tenants, isLoading } = useQuery({
    queryKey: ["tenants", searchQuery],
    queryFn: () =>
      tenantService.getAllTenants({ search: searchQuery, limit: 100 }),
  });

  return (
    <MaxContainer>
      <div className="flex items-center justify-between">
        <h1 className="font-sans text-2xl font-semibold text-foreground">
          Tenants
        </h1>
      </div>
      <div className="mt-6 w-full flex items-center justify-between gap-4">
        <div className="max-w-xs w-full relative">
          <Search className="size-5 ml-3 top-1/2 -translate-y-1/2 text-muted-foreground absolute" />
          <Input
            className="border-border pl-10 shadow-none w-full h-auto py-2.5 rounded-md bg-background"
            placeholder="Search tenants"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link href="/tenants/add">
            <Button className="h-auto py-2.5 px-4 rounded-sm shadow-sm">
              <Plus className="size-5" />
              Add Tenant
            </Button>
          </Link>

          <Button
            variant="outline"
            className="cursor-pointer border-border shadow-none h-auto py-2.5 px-4 rounded-sm hover:bg-accent hover:text-accent-foreground"
          >
            <Filter className="size-5" />
            Filter
          </Button>

          <div className="flex border border-border rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "table"
                  ? "bg-accent text-accent-foreground"
                  : "bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <List className="size-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 transition-colors border-l border-border",
                viewMode === "grid"
                  ? "bg-accent text-accent-foreground"
                  : "bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <LayoutGrid className="size-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <TenantsTable data={tenants || []} searchQuery={searchQuery} />
        )}
      </div>
    </MaxContainer>
  );
}
