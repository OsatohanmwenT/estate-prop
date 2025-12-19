"use client";

import { Building2, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import { Property } from "~/types/property";

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard = memo(function PropertyCard({ property }: PropertyCardProps) {
  const isOccupied = property.status === "occupied";

  const statusColors = isOccupied
    ? {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        indicator: "bg-emerald-500",
      }
    : {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        indicator: "bg-amber-500",
      };

  return (
    <Link href={`/properties/${property.id}`} className="block">
      <div className="group flex items-start gap-4 p-4 rounded-sm border border-slate-200 bg-white hover:border-slate-300 transition-all duration-200 hover:bg-slate-50/50">
        {/* Compact Image - Fixed Size */}
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-slate-100 border border-slate-200">
          {property.thumbnailImage ? (
            <Image
              src={property.thumbnailImage}
              alt={property.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Building2 className="h-8 w-8 text-slate-300" strokeWidth={1.5} />
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {/* Top Row: Name + Status */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm leading-tight truncate pr-2 text-slate-900">
                {property.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                <span className="truncate">
                  {property.city}, {property.state}
                </span>
              </div>
            </div>

            <Badge
              variant="outline"
              className={cn(
                "shrink-0 capitalize text-[10px] h-5 px-2 gap-1.5 font-medium rounded-sm shadow-none",
                statusColors.bg,
                statusColors.text,
                statusColors.border
              )}
            >
              <span
                className={cn("size-1.5 rounded-full", statusColors.indicator)}
              />
              {property.status}
            </Badge>
          </div>

          {/* Bottom Row: Stats grid */}
          <div className="grid grid-cols-3 gap-4 mt-auto pt-2 border-t border-slate-50">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Units
              </span>
              <span className="text-xs font-mono font-medium text-slate-700">
                {property.totalUnits}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Occ.
              </span>
              <span
                className={cn(
                  "text-xs font-mono font-bold",
                  isOccupied ? "text-emerald-600" : "text-amber-600"
                )}
              >
                {Math.round(property.occupancyRate)}%
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Type
              </span>
              <span className="text-xs font-medium capitalize truncate text-slate-700">
                {property.category}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});