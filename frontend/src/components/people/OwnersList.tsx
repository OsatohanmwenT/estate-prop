"use client";

import { useQuery } from "@tanstack/react-query";
import { ownerService } from "~/services/ownerService";
import { PersonCard } from "./PersonCard";
import { Skeleton } from "~/components/ui/skeleton";
import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export function OwnersList() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: ownersData, isLoading } = useQuery({
    queryKey: ["owners", searchQuery],
    queryFn: () => ownerService.getAllOwners({ search: searchQuery }),
  });

  const owners = ownersData?.owners || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full rounded-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Simple Header for Owners Tab similar to Tenants mobile view or just a clean toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search owners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-white border-slate-200 rounded-sm focus:border-slate-900"
          />
        </div>
        <Link href="/owners/add">
          <Button
            size="sm"
            className="h-9 rounded-sm bg-slate-900 text-white hover:bg-slate-800 gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Owner</span>
          </Button>
        </Link>
      </div>

      {owners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-sm border border-dashed border-slate-200">
          <p className="text-slate-500 font-medium">
            No owners found matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in duration-500">
          {owners.map((owner: any) => (
            <PersonCard
              key={owner.id}
              id={owner.id}
              name={owner.fullName}
              role="owner"
              email={owner.email}
              phone={owner.phone}
              avatarUrl={owner.avatarUrl}
              propertiesCount={owner.propertiesCount || 5}
              unitsCount={owner.unitsCount || 10}
              subText={owner.email}
            />
          ))}
        </div>
      )}
    </div>
  );
}
