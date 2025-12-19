"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Mail, Phone, Calendar, FileText, Plus } from "lucide-react";
import { Unit } from "~/types/property";
import Link from "next/link";

interface UnitTenantInfoProps {
  unit: Unit;
}

export function UnitTenantInfo({ unit }: UnitTenantInfoProps) {
  // This would typically come from a separate tenant relation or API call
  // For now, we'll use placeholder data if the unit is occupied
  const tenant =
    unit.status === "occupied"
      ? {
          id: "1", // Placeholder ID
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 (555) 123-4567",
          leaseStart: "Jan 1, 2024",
          leaseEnd: "Dec 31, 2024",
          avatar: "/placeholder-avatar.jpg",
          leaseId: "101", // Placeholder Lease ID
        }
      : null;

  if (!tenant) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Current Tenant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">
              No Active Tenant
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mt-1 mb-4">
              This unit is currently vacant. Add a tenant or create a new lease
              to get started.
            </p>
            <Button asChild>
              <Link
                href={`/properties/${unit.propertyId}/units/${unit.id}/tenants/add`}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Tenant
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Current Tenant</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/leases/${tenant.leaseId}`}>View Lease</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border border-border">
            <AvatarImage src={tenant.avatar} />
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {tenant.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              {tenant.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {tenant.email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {tenant.phone}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Lease Start
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {tenant.leaseStart}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Lease End
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {tenant.leaseEnd}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
