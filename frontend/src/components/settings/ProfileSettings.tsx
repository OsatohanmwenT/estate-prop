"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Save, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "~/components/ui/field";
import { Separator } from "~/components/ui/separator";
import { useAuth } from "~/contexts/AuthContext";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileSettings() {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    // TODO: Implement profile update API
    console.log("Update profile:", data);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center mb-4">
          <User className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
          Not Logged In
        </h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">
          Please log in to view your profile settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
          Profile
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal information
        </p>
      </div>

      <Separator className="bg-slate-100" />

      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-600 border border-slate-200">
          {user.fullName?.charAt(0) || "?"}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-900">{user.fullName}</p>
          <p className="text-xs text-slate-500">{user.email}</p>
          <Button variant="outline" size="sm" className="mt-2" disabled>
            Change Avatar
          </Button>
        </div>
      </div>

      <Separator className="bg-slate-100" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FieldGroup className="gap-6">
          <Field className="gap-2" data-invalid={!!errors.fullName}>
            <FieldLabel>Full Name</FieldLabel>
            <Input
              {...register("fullName")}
              placeholder="Your name"
              className="max-w-md"
            />
            {errors.fullName && <FieldError errors={[errors.fullName]} />}
          </Field>

          <Field className="gap-2" data-invalid={!!errors.email}>
            <FieldLabel>Email Address</FieldLabel>
            <Input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className="max-w-md"
              disabled
            />
            <p className="text-[11px] text-slate-400">
              Email cannot be changed. Contact support if needed.
            </p>
            {errors.email && <FieldError errors={[errors.email]} />}
          </Field>
        </FieldGroup>

        <div className="flex pt-2">
          <Button
            type="submit"
            disabled={!isDirty}
            className="bg-slate-900 hover:bg-slate-800 text-white min-w-[120px]"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
