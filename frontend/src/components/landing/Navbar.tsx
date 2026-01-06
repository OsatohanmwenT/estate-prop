"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { LayoutDashboard } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link className="mr-6 flex items-center space-x-2" href="/">
          <span className="font-bold sm:inline-block">EstateProject</span>
        </Link>
        <div className="mr-4 hidden md:flex">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="#features"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Optional search input could go here */}
          </div>
          <nav className="flex items-center">
            <Link href="/dashboard">
              <Button variant="ghost" className="h-8 w-8 px-0">
                <LayoutDashboard className="h-4 w-4" />
                <span className="sr-only">Dashboard</span>
              </Button>
            </Link>
            <Link href="/dashboard" className="ml-2">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </div>
    </nav>
  );
}
