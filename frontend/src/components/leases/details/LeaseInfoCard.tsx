"use client";

import { ChevronRight, LucideIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

interface LeaseInfoCardProps {
  title: string;
  icon: LucideIcon;
  type: "tenant" | "property";
  data: {
    name: string;
    subtitle?: string;
    id?: string;
    avatar?: string;
  };
  links?: Array<{
    label: string;
    href: string;
  }>;
}

export function LeaseInfoCard({
  title,
  icon: Icon,
  type,
  data,
  links,
}: LeaseInfoCardProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-400" />
        {title}
      </h3>
      <div className="bg-white border border-slate-200 rounded-sm p-6 h-full flex flex-col">
        {type === "tenant" ? (
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-10 w-10 border border-slate-100">
              <AvatarFallback className="bg-slate-50 text-slate-600 font-bold">
                {data.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-slate-900 text-sm">{data.name}</p>
              {data.subtitle && (
                <p className="text-xs text-slate-500">{data.subtitle}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-4 space-y-1">
            <p className="font-bold text-slate-900 text-sm">{data.name}</p>
            {data.subtitle && (
              <p className="text-xs text-slate-500 line-clamp-2">
                {data.subtitle}
              </p>
            )}
          </div>
        )}

        {links && links.length > 0 && (
          <div className="mt-auto pt-4 border-t border-slate-50 flex gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-semibold text-slate-900 hover:text-emerald-600 transition-colors uppercase tracking-wider flex items-center gap-1"
              >
                {link.label} <ChevronRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
