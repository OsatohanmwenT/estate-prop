"use client";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { LucideIcon } from "lucide-react";

interface SettingsNavItem {
  id: string;
  label: string;
  description: string;
  icon?: LucideIcon;
}

interface SettingsNavProps {
  items: SettingsNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function SettingsNav({ items, activeId, onSelect }: SettingsNavProps) {
  return (
    <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-8 h-fit">
      <nav
        className={cn(
          "flex lg:flex-col gap-2 overflow-x-auto scrollbar-hide",
          "pb-4 lg:pb-0",
          "-mx-4 px-4 sm:mx-0 sm:px-0",
          "sticky top-0 pt-2 lg:static lg:bg-transparent lg:pt-0"
        )}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;

          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onSelect(item.id)}
              className={cn(
                "justify-start transition-all shrink-0 group relative whitespace-nowrap",
                "lg:w-full lg:h-auto lg:py-3 lg:px-4 lg:rounded-md",
                "h-10 px-4 rounded-full border",
                isActive
                  ? "bg-slate-900 max-lg:hover:bg-slate-800 text-white border-slate-900 lg:bg-white lg:text-slate-900 lg:shadow-sm lg:border-slate-200 lg:shadow"
                  : "text-slate-600 border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 lg:border-transparent lg:text-slate-500 lg:hover:bg-slate-50 lg:hover:text-slate-900"
              )}
            >
              {Icon && (
                <Icon
                  className={cn(
                    "h-4 w-4 mr-2 lg:mr-3 shrink-0 transition-colors",
                    isActive
                      ? "text-white lg:text-slate-900"
                      : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
              )}
              <div className="text-left">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive
                      ? "text-white lg:text-slate-900"
                      : "text-slate-600 group-hover:text-slate-900"
                  )}
                >
                  {item.label}
                </p>
                <p className="hidden lg:block text-[11px] text-slate-400 mt-0.5 line-clamp-1 group-hover:text-slate-500 transition-colors">
                  {item.description}
                </p>
              </div>
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}
