"use client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { MoreHorizontal, User } from "lucide-react";
import Link from "next/link";

interface PersonCardProps {
  id: string;
  name: string;
  role: "tenant" | "owner";
  email: string;
  phone: string;
  avatarUrl?: string | null;
  propertiesCount?: number;
  unitsCount?: number;
  status?: "active" | "inactive" | "pending";
  leaseType?: string;
  subText?: string;
}

export function PersonCard({
  id,
  name,
  role,
  email,
  phone,
  avatarUrl,
  propertiesCount = 0,
  unitsCount = 0,
  status = "active",
  leaseType,
  subText,
}: PersonCardProps) {
  return (
    <div className="group flex flex-col bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Header Section */}
      <div className="p-5 pb-0">
        <div className="flex justify-between items-start mb-3">
          <Avatar className="h-16 w-16 rounded-full border-2 border-slate-50 shadow-sm">
            <AvatarImage
              src={avatarUrl || ""}
              alt={name}
              className="object-cover"
            />
            <AvatarFallback className="bg-slate-100 text-slate-400">
              <User className="h-7 w-7" strokeWidth={1.5} />
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        <div className="mb-5">
          <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1 tracking-tight">
            {name}
          </h3>
          <p className="text-sm text-slate-500 font-medium tracking-wide">
            {phone}
          </p>
        </div>
      </div>

      {/* Info/Stats Section */}
      <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/30 space-y-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-500 font-medium min-w-[70px]">
              Properties
            </span>
            <span className="text-slate-400">:</span>
            <span className="font-bold text-slate-900">{propertiesCount}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-500 font-medium">Unit</span>
            <span className="text-slate-400">:</span>
            <span className="font-bold text-slate-900">{unitsCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-500 font-medium min-w-[70px]">
            {role === "owner" ? "Status" : "Lease"}
          </span>
          <span className="text-slate-400">:</span>
          <span className="font-semibold text-slate-900 truncate">
            {role === "owner"
              ? subText || "Active"
              : leaseType || "Not Specified"}
          </span>
        </div>
      </div>

      {/* Actions Section */}
      <div className="p-4 pt-4 border-t border-slate-100 flex gap-3 mt-auto bg-white">
        <Button
          variant="outline"
          className="flex-1 h-10 rounded-md border-emerald-100 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 hover:border-emerald-200 font-semibold text-xs transition-colors"
          size="sm"
        >
          Message
        </Button>
        <Link
          href={role === "tenant" ? `/tenants/${id}` : `/owners/${id}`}
          className="flex-1"
        >
          <Button
            variant="outline"
            className="w-full h-10 rounded-md border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 font-semibold text-xs transition-colors"
            size="sm"
          >
            View Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
