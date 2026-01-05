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
  Wallet,
  type LucideIcon,
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
import { cn } from "~/lib/utils";
import { OrganizationSwitcher } from "../ui/organization-switcher";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  exactMatch?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

// Mock Data for Team Switcher

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        exactMatch: true,
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

const SECONDARY_ITEMS: NavItem[] = [
  {
    title: "Help & Support",
    url: "/support",
    icon: HelpCircle,
  },
  {
    title: "Settings",
    url: "/settings/account",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActiveRoute = (item: NavItem): boolean => {
    if (item.exactMatch) {
      return pathname === item.url;
    }
    return pathname.startsWith(item.url);
  };

  return (
    <Sidebar
      className="font-sans border-r border-slate-200 bg-slate-50/30 text-slate-900"
      collapsible="icon"
      aria-label="Main navigation sidebar"
    >
      {/* Header with Team Switcher */}
      <SidebarHeader className="border-b border-transparent">
        <OrganizationSwitcher />
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label} className="px-0">
            <SidebarGroupLabel className="px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = isActiveRoute(item);
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
                          aria-current={isActive ? "page" : undefined}
                        >
                          <item.icon
                            strokeWidth={isActive ? 2 : 1.5}
                            className={cn(
                              "size-5 transition-colors shrink-0",
                              isActive
                                ? "text-slate-900"
                                : "text-slate-600 group-hover:text-slate-900"
                            )}
                            aria-hidden="true"
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
          {SECONDARY_ITEMS.map((item) => {
            const isActive = isActiveRoute(item);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                  className={cn(
                    "h-9 rounded-md border transition-all",
                    isActive
                      ? "bg-white border-slate-200 text-slate-900"
                      : "border-transparent text-slate-500 hover:bg-white hover:border-slate-200 hover:text-slate-900"
                  )}
                >
                  <Link
                    href={item.url}
                    className="flex items-center gap-3 w-full"
                    aria-current={isActive ? "page" : undefined}
                  >
                    <item.icon
                      className={cn(
                        "size-5 shrink-0 transition-colors",
                        isActive ? "text-slate-900" : "text-slate-400"
                      )}
                      strokeWidth={isActive ? 2 : 1.5}
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium truncate">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}