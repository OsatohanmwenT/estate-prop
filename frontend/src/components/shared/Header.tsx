"use client";

import {
  Bell,
  Briefcase,
  ChevronRight,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { useAuth } from "~/contexts/AuthContext";
import { cn } from "~/lib/utils";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-6 gap-4">
        {/* Left: Navigation Context / Breadcrumbs */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <SidebarTrigger className="h-8 w-8 rounded-sm border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white hover:border-slate-300 transition-all" />

          <div className="hidden md:flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
            <Link
              href="/dashboard"
              className="hover:text-slate-900 transition-colors flex items-center gap-1"
            >
              <Home className="h-3 w-3" />
              <span className="sr-only">Home</span>
            </Link>
            {segments.map((segment, index) => (
              <div key={segment} className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3 text-slate-500" />
                <span
                  className={cn(
                    "hover:text-slate-900 transition-colors cursor-default",
                    index === segments.length - 1
                      ? "text-slate-900 font-semibold"
                      : "text-slate-500"
                  )}
                >
                  {segment}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Tools & Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 rounded-sm border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-900 transition-all"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </Button>

          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 rounded-sm pl-1 pr-3 gap-2 hover:bg-white border border-transparent hover:border-slate-200 transition-all ml-1"
                >
                  <Avatar className="h-6 w-6 rounded-sm border border-slate-200">
                    <AvatarImage src={user?.avatarUrl} />
                    <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-bold rounded-sm">
                      {user?.fullName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start text-xs">
                    <span className="font-semibold leading-none text-slate-700">
                      {user?.fullName?.split(" ")[0]}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-sm border-slate-200 shadow-sm"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-slate-900">
                      {user?.fullName}
                    </p>
                    <p className="text-xs leading-none text-slate-500">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    asChild
                    className="focus:bg-slate-50 cursor-pointer"
                  >
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4 text-slate-500" />
                      <span className="text-slate-700">Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="focus:bg-slate-50 cursor-pointer"
                  >
                    <Link href="/properties">
                      <Briefcase className="mr-2 h-4 w-4 text-slate-500" />
                      <span className="text-slate-700">Properties</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="focus:bg-slate-50 cursor-pointer"
                  >
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4 text-slate-500" />
                      <span className="text-slate-700">Settings</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-slate-500 hover:text-slate-900"
              >
                <Link href="/login">Sign In</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="rounded-sm bg-slate-900 text-white hover:bg-slate-800 shadow-none border border-transparent"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
