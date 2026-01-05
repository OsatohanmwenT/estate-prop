"use client";

import * as React from "react";
import {
  Building2,
  ChevronsUpDown,
  Settings,
  Loader2,
  Plus,
} from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { useOrganization } from "~/lib/query/settings";
import { Skeleton } from "~/components/ui/skeleton";
import { CreateOrganizationDialog } from "~/components/settings/CreateOrganizationDialog";

export function OrganizationSwitcher() {
  const { isMobile } = useSidebar();
  const { data: organization, isLoading } = useOrganization();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="cursor-default">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="grid flex-1 gap-1.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!organization) {
    return (
      <>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="border border-dashed border-slate-200 hover:border-slate-300"
              onClick={() => setIsCreateOpen(true)}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
                <Plus className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-slate-600">
                  Create Organization
                </span>
                <span className="truncate text-[10px] text-slate-400">
                  Get started
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <CreateOrganizationDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
        />
      </>
    );
  }

  // Get initials from organization name
  const initials = organization.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border border-transparent hover:border-slate-200 data-[state=open]:border-slate-300 transition-all duration-200"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-900 text-white text-xs font-bold shadow-sm">
                  {initials}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold tracking-tight text-slate-900">
                    {organization.name}
                  </span>
                  <span className="truncate text-[10px] uppercase tracking-wider text-slate-500">
                    {organization.slug}
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
                Organization
              </DropdownMenuLabel>
              <DropdownMenuItem className="gap-3 p-3 focus:bg-slate-50 cursor-default">
                <div className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-900 text-white text-xs font-bold">
                  {initials}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-semibold text-slate-900 truncate">
                    {organization.name}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {organization.contactEmail || organization.slug}
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem className="gap-2 p-2 focus:bg-slate-50" asChild>
                <Link href="/settings/organization">
                  <div className="flex size-6 items-center justify-center rounded-md border border-slate-200 bg-white">
                    <Settings className="size-3.5 text-slate-500" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    Organization Settings
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem
                className="gap-2 p-2 focus:bg-slate-50"
                onClick={() => setIsCreateOpen(true)}
              >
                <div className="flex size-6 items-center justify-center rounded-md border border-slate-200 bg-white">
                  <Plus className="size-3.5 text-slate-500" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Add Organization
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <CreateOrganizationDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </>
  );
}
