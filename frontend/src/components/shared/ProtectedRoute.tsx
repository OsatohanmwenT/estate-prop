"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "~/contexts/AuthContext";
import { LoaderCircle } from "lucide-react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        console.log("[ProtectedRoute] No user, redirecting to sign-in");
        router.replace("/sign-in");
      } else if (!user.organizationId) {
        console.log("[ProtectedRoute] No organization, redirecting to setup");
        router.replace("/setup-organization");
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

  // Only render children if user exists and has organization
  if (!user || !user.organizationId) {
    return null;
  }

  return <>{children}</>;
}
