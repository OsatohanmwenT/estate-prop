"use client";

import * as React from "react";
import {
  Building2,
  Users,
  Mail,
  Plug,
  User,
  Shield,
  ArrowLeft,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";

const ACCOUNT_ITEMS = [
  {
    id: "profile",
    label: "Profile Info",
    href: "/settings/account",
    icon: User,
  },
  {
    id: "security",
    label: "Security",
    href: "/settings/account/security",
    icon: Shield,
  },
];

const ORG_ITEMS = [
  {
    id: "organization",
    label: "Organization",
    href: "/settings/organization",
    icon: Building2,
  },
  {
    id: "team",
    label: "Team Members",
    href: "/settings/organization/team",
    icon: Users,
  },
  {
    id: "email",
    label: "Email Templates",
    href: "/settings/organization/email",
    icon: Mail,
  },
  {
    id: "integrations",
    label: "Integrations",
    href: "/settings/organization/integrations",
    icon: Plug,
  },
];

export function SettingsAppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Use exact matching for active state
  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <Sidebar
      className="font-sans border-r border-slate-200 bg-white text-slate-900"
      collapsible="icon"
      aria-label="Settings navigation sidebar"
    >
      <SidebarHeader className="border-b border-slate-100 p-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="Back to Dashboard"
              className="hover:bg-slate-50 border border-transparent hover:border-slate-200"
            >
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                  <ArrowLeft className="size-4 text-slate-500" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-slate-900">Settings</span>
                  <span className="truncate text-xs text-slate-500">
                    Back to dashboard
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Account Section */}
        <SidebarGroup className="px-0">
          <SidebarGroupLabel className="px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {ACCOUNT_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                      className={cn(
                        "h-9 rounded-md transition-all",
                        active
                          ? "bg-emerald-50 text-emerald-700 font-medium"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3 w-full">
                        <Icon
                          className={cn(
                            "size-5 shrink-0",
                            active ? "text-emerald-600" : "text-slate-400"
                          )}
                          strokeWidth={active ? 2 : 1.5}
                        />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Organization Section */}
        <SidebarGroup className="px-0 mt-4">
          <SidebarGroupLabel className="px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Organization
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {ORG_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                      className={cn(
                        "h-9 rounded-md transition-all",
                        active
                          ? "bg-emerald-50 text-emerald-700 font-medium"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3 w-full">
                        <Icon
                          className={cn(
                            "size-5 shrink-0",
                            active ? "text-emerald-600" : "text-slate-400"
                          )}
                          strokeWidth={active ? 2 : 1.5}
                        />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
