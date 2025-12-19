"use client";
import React from "react";
import AuthForm from "~/components/auth/AuthForm";
import { loginUser } from "~/lib/actions/auth";
import { LoginSchema } from "~/schemas/auth";

const page = () => {
  return (
    <main className="font-outfit flex h-screen w-full items-center justify-center overflow-hidden bg-background">
      <div className="flex flex-col items-center justify-center gap-10 p-4 sm:p-6 lg:w-1/2 lg:p-14 xl:p-20 animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter your email and password to access your account.
          </p>
        </div>
        <AuthForm
          type="SIGN_IN"
          schema={LoginSchema}
          defaultValues={{ email: "", password: "" }}
          onSubmit={loginUser}
        />
      </div>
      <div className="relative h-full w-1/2 bg-muted hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-3xl" />
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Placeholder for a hero image or abstract pattern */}
          <div className="h-96 w-96 bg-gradient-to-tr from-primary/30 to-purple-500/30 rounded-full blur-3xl animate-pulse" />
        </div>
      </div>
    </main>
  );
};

export default page;
