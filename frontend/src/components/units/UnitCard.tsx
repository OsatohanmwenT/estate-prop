"use client";

import { Copy, Edit, Eye, Home, MapPin, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn, formatCurrency } from "~/lib/utils";
import { Unit } from "~/types/property";

interface UnitCardProps {
  unit: Unit;
}

export function UnitCard({ unit }: UnitCardProps) {
  const router = useRouter();
  const [showDuplicateSheet, setShowDuplicateSheet] = useState(false);
  const typeMap: Record<
    string,
    { label: string; variant: "default" | "secondary" | "outline" }
  > = {
    apartment: { label: "Apartment", variant: "secondary" },
    studio: { label: "Studio", variant: "default" },
    penthouse: { label: "Penthouse", variant: "outline" },
    duplex: { label: "Duplex", variant: "secondary" },
    shop: { label: "Shop", variant: "default" },
    office: { label: "Office", variant: "outline" },
    warehouse: { label: "Warehouse", variant: "secondary" },
    townhouse: { label: "Townhouse", variant: "default" },
  };

  const typeConfig = typeMap[unit.type] || {
    label: unit.type,
    variant: "default" as const,
  };

  const isOccupied = unit.status === "occupied";

  const handleViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/properties/${unit.propertyId}/units/${unit.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/properties/${unit.propertyId}/units/${unit.id}/edit`);
  };

  const handleDuplicateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDuplicateSheet(true);
  };

  return (
    <>
      <Link href={`/properties/${unit.propertyId}/units/${unit.id}`}>
        <div className="group relative flex items-start gap-4 rounded-sm border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-sm">
          {/* Icon */}
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm bg-slate-50 border border-slate-100 text-slate-400">
            <Home className="h-5 w-5" strokeWidth={1.5} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-slate-900 truncate tracking-tight">
                  {unit.code}
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">
                  <span className="truncate max-w-[120px]">
                    {unit.property?.name || "N/A"}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>{typeConfig.label}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-sm px-2 py-0 text-[10px] uppercase font-bold tracking-wider h-5 border-0",
                    isOccupied
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  )}
                >
                  {isOccupied ? "Occupied" : "Vacant"}
                </Badge>
              </div>
            </div>

            <div className="h-px w-full bg-slate-50" />

            {/* Stats */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4 text-slate-600">
                <div className="flex items-baseline gap-1">
                  <span className="font-semibold text-slate-900">
                    {unit.bedrooms}
                  </span>
                  <span className="text-[10px] uppercase text-slate-400 tracking-wider">
                    Bed
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-semibold text-slate-900">
                    {unit.bathrooms}
                  </span>
                  <span className="text-[10px] uppercase text-slate-400 tracking-wider">
                    Bath
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-semibold text-slate-900">
                    {unit.unitSize}
                  </span>
                  <span className="text-[10px] uppercase text-slate-400 tracking-wider">
                    m²
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="block text-sm font-medium text-slate-900">
                  {formatCurrency(parseFloat(unit.rentAmount))}
                </span>
              </div>
            </div>
          </div>

          {/* Actions Absolute */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Could add quick actions here if needed, keeping it clean for now */}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 text-slate-300 hover:text-slate-600"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleViewClick}>
                <Eye className="mr-2 h-3.5 w-3.5" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEditClick}>
                <Edit className="mr-2 h-3.5 w-3.5" />
                Edit Unit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDuplicateClick}>
                <Copy className="mr-2 h-3.5 w-3.5" />
                Duplicate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Link>
    </>
  );
}
