"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border border-transparent hover:border-slate-200 data-[state=open]:border-slate-300 transition-all duration-200"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-950 text-slate-200 shadow-sm">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold tracking-tight text-slate-900">
                  {activeTeam.name}
                </span>
                <span className="truncate text-[10px] uppercase tracking-wider text-slate-500">
                  {activeTeam.plan}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto opacity-50 size-4 text-slate-400" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg border-slate-200 shadow-xl"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2 focus:bg-slate-50"
              >
                <div className="flex size-6 items-center justify-center rounded-md border border-slate-200 bg-white">
                  <team.logo className="size-3.5 shrink-0 text-slate-700" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900">
                    {team.name}
                  </span>
                </div>
                <DropdownMenuShortcut className="font-mono text-[10px] text-slate-400">
                  ⌘{index + 1}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem className="gap-2 p-2 focus:bg-slate-50">
              <div className="flex size-6 items-center justify-center rounded-md border border-slate-200 bg-white">
                <Plus className="size-4 text-slate-500" />
              </div>
              <div className="font-medium text-slate-500 uppercase tracking-wider text-[10px]">
                Add team
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
