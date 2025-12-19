"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { organizationService } from "~/services/organizationService";
import { toast } from "sonner";
import { Building2, LoaderCircle, LogOut } from "lucide-react";
import { useAuth } from "~/contexts/AuthContext";

export default function SetupOrganizationPage() {
  const [organizationName, setOrganizationName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { refreshUser, user, logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!organizationName.trim() || organizationName.trim().length < 2) {
      setError("Organization name must be at least 2 characters");
      return;
    }

    setIsLoading(true);

    try {
      await organizationService.createOrganization({
        name: organizationName.trim(),
      });

      toast.success("Organization created successfully!");
      await refreshUser();
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create organization");
      toast.error(err.message || "Failed to create organization");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen font-mono items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 p-4">

      <Card className="w-full max-w-md border-neutral-200 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 shadow-sm">
            <Building2 className="h-6 w-6 text-white" />
          </div>

          <CardTitle className="text-xl font-bold tracking-tight text-neutral-900">
            Setup Organization
          </CardTitle>
          <CardDescription className="text-neutral-500">
            Create your agency workspace to start managing properties
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Field className="space-y-1.5">
              <FieldLabel
                htmlFor="organizationName"
                className="text-neutral-800"
              >
                Organization Name
              </FieldLabel>
              <Input
                id="organizationName"
                type="text"
                placeholder="e.g., Acme Estates"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                disabled={isLoading}
                className="h-10 w-full rounded-md border-input py-2"
              />
              {error && <FieldError errors={[{ message: error }]} />}
            </Field>

            <Button
              type="submit"
              className="h-10 rounded-md py-2 w-full"
              disabled={isLoading || !organizationName.trim()}
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                  Creating Workspace...
                </>
              ) : (
                "Create Organization"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="absolute bottom-6 text-xs text-neutral-400">
        &copy; {new Date().getFullYear()} Estate Project. All rights reserved.
      </div>
    </div>
  );
}
