"use client";

import React from "react";
import AuthForm from "~/components/auth/AuthForm";
import { registerUser } from "~/lib/actions/auth";
import { RegisterSchema } from "~/schemas/auth";

const page = () => {
  return (
    <main className="font-outfit flex h-screen w-full items-center justify-center overflow-hidden">
      <div className="flex w-full flex-col items-center justify-center gap-10 p-6 lg:w-1/2 lg:p-14 xl:p-20">
        <div>
          <h1 className="mb-3 text-center text-4xl font-semibold">
            Sign Up Account
          </h1>
          <p className="text-neutral-600">
            Enter your credentials to create your account.
          </p>
        </div>
        <AuthForm
          type="SIGN_UP"
          schema={RegisterSchema}
          defaultValues={{ email: "", password: "", fullName: "", phone: "" }}
          onSubmit={registerUser}
        />
      </div>
      <div className="h-full w-1/2 bg-black max-lg:hidden"></div>
    </main>
  );
};

export default page;
