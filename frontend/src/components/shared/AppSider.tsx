"use client";

import {
  BarChart3,
  Building2,
  Command,
  FileBadge,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Receipt,
  Settings,
  Users,
  Wallet
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";
import { TeamSwitcher } from "~/components/ui/team-switcher";
import { cn } from "~/lib/utils";

// Mock Data for Team Switcher
const teams = [
  {
    name: "PropEstate Inc.",
    logo: Command,
    plan: "Enterprise",
  },
  {
    name: "Acme Corp.",
    logo: Building2,
    plan: "Startup",
  },
];

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        title: "Portfolio",
        url: "/portfolio",
        icon: Building2,
      },
      {
        title: "People",
        url: "/people",
        icon: Users,
      },
      {
        title: "Leases",
        url: "/leases",
        icon: FileBadge,
      },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        title: "Invoices",
        url: "/invoices",
        icon: Receipt,
      },
      {
        title: "Accounting",
        url: "/accounting",
        icon: Wallet,
      },
      {
        title: "Reports",
        url: "/reports",
        icon: BarChart3,
      },
    ],
  },
  {
    label: "Resources",
    items: [
      {
        title: "Documents",
        url: "/documents",
        icon: FileText,
      },
    ],
  },
];

const SECONDARY_ITEMS = [
  {
    title: "Help & Support",
    url: "/support",
    icon: HelpCircle,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      className="font-sans border-r border-slate-200 bg-slate-50/30 text-slate-900"
      collapsible="icon"
    >
      {/* Header with Team Switcher */}
      <SidebarHeader className="border-b border-transparent">
        <TeamSwitcher teams={teams} />
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {NAV_GROUPS.map((group, index) => (
          <SidebarGroup key={group.label} className="px-0">
            <SidebarGroupLabel className="px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={isActive}
                        className={cn(
                          "h-9 transition-all duration-200 group relative rounded-md border text-sm font-medium",
                          isActive
                            ? "!bg-white border-slate-200 text-slate-900 shadow-sm"
                            : "border-transparent text-slate-600 hover:bg-white hover:border-slate-100 hover:text-slate-900"
                        )}
                      >
                        <Link
                          href={item.url}
                          className="flex items-center gap-3 w-full"
                        >
                          <item.icon
                            strokeWidth={isActive ? 2 : 1.5}
                            className={cn(
                              "size-5 transition-colors shrink-0",
                              isActive
                                ? "text-slate-900"
                                : "text-slate-600 group-hover:text-slate-600"
                            )}
                          />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-slate-100">
        <SidebarMenu>
          {SECONDARY_ITEMS.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={cn(
                  "h-9 text-slate-500 hover:bg-white hover:border-slate-200 hover:text-slate-900 rounded-md border border-transparent transition-all"
                )}
              >
                <Link
                  href={item.url}
                  className="flex items-center gap-3 w-full"
                >
                  <item.icon
                    className="size-5 text-slate-400 group-hover:text-slate-600 shrink-0"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm font-medium truncate">
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
