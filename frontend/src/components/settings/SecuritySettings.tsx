"use client";

import { Lock, Shield, Key } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export function SecuritySettings() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
          Security
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account security settings
        </p>
      </div>

      <Separator className="bg-slate-100" />

      {/* Password Section */}
      <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
          <Key className="h-5 w-5 text-slate-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900">Password</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Change your password to keep your account secure.
          </p>
          <Button variant="outline" size="sm" className="mt-3" disabled>
            Change Password
          </Button>
        </div>
      </div>

      {/* 2FA Section */}
      <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
          <Shield className="h-5 w-5 text-slate-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900">
            Two-Factor Authentication
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Add an extra layer of security to your account.
          </p>
          <Button variant="outline" size="sm" className="mt-3" disabled>
            Enable 2FA
          </Button>
        </div>
      </div>

      {/* Sessions Section */}
      <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
          <Lock className="h-5 w-5 text-slate-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900">
            Active Sessions
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage devices where you&apos;re currently signed in.
          </p>
          <Button variant="outline" size="sm" className="mt-3" disabled>
            View Sessions
          </Button>
        </div>
      </div>

      <p className="text-xs text-slate-400 italic">
        Security features are coming soon.
      </p>
    </div>
  );
}
