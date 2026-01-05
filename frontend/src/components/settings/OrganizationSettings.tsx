"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, Save, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "~/components/ui/field";
import { Separator } from "~/components/ui/separator";
import { useUpdateOrganization } from "~/lib/query/settings";
import { Organization } from "~/services/settingsService";

const orgSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
});

type OrgFormData = z.infer<typeof orgSchema>;

interface OrganizationSettingsProps {
  organization: Organization | null | undefined;
}

export function OrganizationSettings({
  organization,
}: OrganizationSettingsProps) {
  const updateMutation = useUpdateOrganization();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<OrgFormData>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: organization?.name || "",
      contactEmail: organization?.contactEmail || "",
      contactPhone: organization?.contactPhone || "",
      address: organization?.address || "",
    },
  });

  const onSubmit = (data: OrgFormData) => {
    if (!organization?.id) return;

    updateMutation.mutate({
      orgId: organization.id,
      data: {
        name: data.name,
        contactEmail: data.contactEmail || undefined,
        contactPhone: data.contactPhone || undefined,
        address: data.address || undefined,
      },
    });
  };

  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center mb-4">
          <Building2 className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
          No Organization
        </h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">
          You need to be part of an organization to see these settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
          Organization Profile
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage your organization&apos;s public profile and contact details.
        </p>
      </div>

      <Separator className="bg-slate-100" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FieldGroup className="gap-6">
          <Field className="gap-2" data-invalid={!!errors.name}>
            <FieldLabel>Organization Name</FieldLabel>
            <Input
              {...register("name")}
              placeholder="e.g. Acme Corp"
              className="max-w-md"
            />
            <p className="text-[11px] text-slate-400">
              The public name of your organization.
            </p>
            {errors.name && <FieldError errors={[errors.name]} />}
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field className="gap-2" data-invalid={!!errors.contactEmail}>
              <FieldLabel>Contact Email</FieldLabel>
              <Input
                {...register("contactEmail")}
                type="email"
                placeholder="contact@company.com"
              />
              {errors.contactEmail && (
                <FieldError errors={[errors.contactEmail]} />
              )}
            </Field>

            <Field className="gap-2">
              <FieldLabel>Contact Phone</FieldLabel>
              <Input
                {...register("contactPhone")}
                type="tel"
                placeholder="+1 234 567 890"
              />
            </Field>
          </div>

          <Field className="gap-2">
            <FieldLabel>Address</FieldLabel>
            <Input
              {...register("address")}
              placeholder="123 Business St, City, Country"
            />
          </Field>
        </FieldGroup>

        <div className="flex pt-2">
          <Button
            type="submit"
            disabled={!isDirty || updateMutation.isPending}
            className="bg-slate-900 hover:bg-slate-800 text-white min-w-[120px]"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
