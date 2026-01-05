"use client";

import { Home, ArrowRight, Bed, Bath } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";

interface VacantUnit {
  id: string;
  name: string;
  type: string;
  rentAmount: string;
  bedrooms: number;
  bathrooms: number;
  property: {
    id: string;
    name: string;
    address: string;
  };
}

interface VacantUnitsCardProps {
  units: VacantUnit[];
  isLoading?: boolean;
}

export function VacantUnitsCard({ units, isLoading }: VacantUnitsCardProps) {
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(num);
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-slate-100 rounded w-1/3" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-50 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm font-semibold text-slate-900">Vacant Units</h3>
          {units.length > 0 && (
            <span className="text-xs font-medium bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
              {units.length}
            </span>
          )}
        </div>
        <Link
          href="/portfolio/units?status=vacant"
          className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="divide-y divide-slate-50">
        {units.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <Home className="h-8 w-8 text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No vacant units</p>
            <p className="text-xs text-slate-400 mt-1">
              All units are occupied
            </p>
          </div>
        ) : (
          units.slice(0, 5).map((unit) => (
            <div
              key={unit.id}
              className="px-5 py-3 hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {unit.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {unit.property.name}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {formatCurrency(unit.rentAmount)}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-0.5">
                      <Bed className="h-3 w-3" />
                      {unit.bedrooms}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Bath className="h-3 w-3" />
                      {unit.bathrooms}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {units.length > 5 && (
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
          <Link
            href="/portfolio/units?status=vacant"
            className="text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            +{units.length - 5} more vacant units
          </Link>
        </div>
      )}
    </div>
  );
}
