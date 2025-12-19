"use client";

import { useState } from "react";
import { ZodType } from "zod";
import {
  Controller,
  DefaultValues,
  FieldValues,
  Path,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import PasswordInput from "./PasswordInput";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { useAuth } from "~/contexts/AuthContext";

interface AuthFormProps<T extends FieldValues> {
  type: "SIGN_IN" | "SIGN_UP";
  schema: ZodType<T, any>;
  onSubmit?: (data: T) => Promise<{
    success: boolean;
    message?: string;
    error?: string;
    user?: any;
    tokens?: { accessToken: string; refreshToken: string };
  }>;
  defaultValues: DefaultValues<T>;
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  onSubmit,
  defaultValues,
}: AuthFormProps<T>) => {
  const [isLoading, setIsLoading] = useState(false);
  const isSignIn = type === "SIGN_IN";
  const router = useRouter();
  const { refreshUser } = useAuth();

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const handleSubmit = async (data: T) => {
    if (!onSubmit) return;
    setIsLoading(true);
    try {
      const result = await onSubmit(data);
      if (result.success) {
        // Cookies are set automatically by backend
        toast.success(
          isSignIn ? "Signed in successfully!" : "Account created successfully!"
        );

        // Update AuthContext with the new user state
        await refreshUser();

        if (result.user && !result.user.organizationId) {
          router.push("/setup-organization");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      } else {
        toast.error(result.error || "Authentication failed");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "font-outfit mx-auto flex w-full max-w-md flex-col",
        isSignIn ? "space-y-4" : "space-y-8"
      )}
    >
      <form
        id="auth-form"
        className=""
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FieldGroup className="gap-4">
          {!isSignIn && (
            <Controller
              name={"fullName" as Path<T>}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-neutral-800" htmlFor={field.name}>
                    Full name
                  </FieldLabel>
                  <Input
                    {...field}
                    className="h-10 w-full rounded-md border-input py-2"
                    id="auth-form-fullname"
                    aria-invalid={fieldState.invalid}
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}
          <Controller
            name={"email" as Path<T>}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel className="text-neutral-800" htmlFor={field.name}>
                  Email
                </FieldLabel>
                <Input
                  {...field}
                  id="auth-form-email"
                  className="h-10 w-full rounded-md border-input py-2"
                  aria-invalid={fieldState.invalid}
                  placeholder="example@mail.com"
                  autoComplete="email"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {!isSignIn && (
            <Controller
              name={"phone" as Path<T>}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-neutral-800" htmlFor={field.name}>
                    Phone number (optional)
                  </FieldLabel>
                  <Input
                    {...field}
                    className="h-10 w-full rounded-md border-input py-2"
                    id="auth-form-phone"
                    aria-invalid={fieldState.invalid}
                    placeholder="+1234567890"
                    autoComplete="tel"
                    type="tel"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}
          <Controller
            name={"password" as Path<T>}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel className="text-neutral-800" htmlFor={field.name}>
                  Password
                </FieldLabel>
                <PasswordInput field={field} fieldState={fieldState} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
      {isSignIn && (
        <p className="font-outfit text-right">
          <Link
            href="/forgot-password"
            className="text-neutral-800 hover:underline"
          >
            Forgot Password
          </Link>
        </p>
      )}
      <Field className="gap-6" orientation="vertical">
        <Button
          className="h-10 rounded-md py-2 w-full"
          type="submit"
          disabled={isLoading}
          form="auth-form"
        >
          {isLoading ? (
            <LoaderCircle className="size-5 animate-spin" />
          ) : isSignIn ? (
            "Sign In"
          ) : (
            "Sign Up"
          )}
        </Button>
        <p className="font-outfit mb-3 text-center text-neutral-500">
          {isSignIn ? "New to Devspace? " : "Already have an account? "}
          <Link
            className="font-medium text-neutral-800 hover:underline"
            href={isSignIn ? "/sign-up" : "/sign-in"}
          >
            {isSignIn ? "Create an account" : "Sign in"}
          </Link>
        </p>
      </Field>
    </div>
  );
};

export default AuthForm;
