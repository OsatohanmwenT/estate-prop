"use client";

import { Building2, ExternalLink, MapPin } from "lucide-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { formatDate } from "~/lib/utils";
import { OwnerProperty } from "~/types/tenant";

interface OwnerPropertiesProps {
  properties: OwnerProperty[];
}

export function OwnerProperties({ properties }: OwnerPropertiesProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <p className="text-sm text-slate-500">No properties found</p>
        <p className="text-xs text-slate-400 mt-1">
          This owner has not been assigned any properties yet.
        </p>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "residential":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "commercial":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "industrial":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "mixed-use":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-4">
      {properties.map((property) => (
        <div
          key={property.id}
          className="group flex items-start justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-sm border border-slate-200 hover:border-slate-300 transition-all duration-200"
        >
          <div className="flex gap-4 flex-1">
            <div className="mt-1 p-2.5 h-fit bg-white rounded-md border border-slate-200 group-hover:border-slate-300 transition-colors">
              <Building2 className="h-5 w-5 text-slate-600" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {property.name}
                </h4>
                <Badge
                  variant="outline"
                  className={`rounded-sm text-xs font-semibold ${getCategoryColor(
                    property.category
                  )}`}
                >
                  {property.category}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                <MapPin className="h-3 w-3" />
                <span className="truncate">
                  {property.address}, {property.city}, {property.state}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Added {formatDate(property.createdAt)}
              </p>
            </div>
          </div>
          <Link href={`/properties/${property.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 rounded-sm text-slate-600 hover:text-slate-900 hover:bg-white gap-1.5"
            >
              View
              <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      ))}
    </div>
  );
}
