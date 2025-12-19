"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { LoaderCircle } from "lucide-react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      // User is logged in
      if (user.organizationId) {
        // Has organization, redirect to dashboard
        router.replace("/dashboard");
      } else {
        // No organization, redirect to setup (unless already there)
        const pathname = window.location.pathname;
        if (!pathname.includes("/setup-organization")) {
          router.replace("/setup-organization");
        }
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex w-full min-h-screen items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render auth pages if user has an organization
  if (user?.organizationId) {
    return null;
  }

  return <div className="font-mono w-full">{children}</div>;
};

export default AuthLayout;
