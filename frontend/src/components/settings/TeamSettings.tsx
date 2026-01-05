"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  MoreVertical,
  Shield,
  UserMinus,
  Loader2,
  Mail,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { cn } from "~/lib/utils";
import {
  useMembers,
  useRemoveMember,
  useUpdateMemberRole,
} from "~/lib/query/settings";
import { InviteMemberDialog } from "./InviteMemberDialog";

interface TeamSettingsProps {
  organizationId: string | undefined;
}

const roleColors: Record<string, string> = {
  owner: "bg-slate-900 text-white border-slate-900",
  manager: "bg-blue-50 text-blue-700 border-blue-200",
  surveyor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  agent: "bg-indigo-50 text-indigo-700 border-indigo-200",
  staff: "bg-white text-slate-700 border-slate-200",
};

export function TeamSettings({ organizationId }: TeamSettingsProps) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  const { data: members = [], isLoading } = useMembers(organizationId);
  const removeMutation = useRemoveMember();
  const updateRoleMutation = useUpdateMemberRole();

  const handleRemove = async () => {
    if (!memberToRemove) return;
    await removeMutation.mutateAsync(memberToRemove);
    setMemberToRemove(null);
  };

  const handleRoleChange = (memberId: string, role: string) => {
    updateRoleMutation.mutate({ memberId, role });
  };

  if (!organizationId) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center mb-4">
          <Users className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
          No Organization
        </h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">
          Create an organization to manage team members.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
            Team Members
            <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-[10px] font-bold border border-slate-200">
              {members.length}
            </span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage access and roles for your organization
          </p>
        </div>
        <Button
          onClick={() => setIsInviteOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <Separator className="bg-slate-100" />

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg bg-slate-50" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
          <div className="h-12 w-12 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Users className="h-5 w-5 text-slate-400" />
          </div>
          <h3 className="text-sm font-medium text-slate-900">
            No team members yet
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto mb-6">
            Invite your team members to collaborate on documents and properties.
          </p>
          <Button
            variant="outline"
            onClick={() => setIsInviteOpen(true)}
            size="sm"
          >
            Invite a member
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:shadow-sm hover:border-slate-300 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 border border-slate-200 shrink-0">
                  {member.user.fullName?.charAt(0) || "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {member.user.fullName}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                    <Mail className="h-3 w-3" />
                    {member.user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border shadow-sm",
                    roleColors[member.role] || roleColors.staff
                  )}
                >
                  {member.role}
                </Badge>

                {member.role !== "owner" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => handleRoleChange(member.id, "manager")}
                        className="text-xs font-medium"
                      >
                        <Shield className="h-3.5 w-3.5 mr-2 text-blue-500" />
                        Make Manager
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRoleChange(member.id, "agent")}
                        className="text-xs font-medium"
                      >
                        <Users className="h-3.5 w-3.5 mr-2 text-indigo-500" />
                        Make Agent
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRoleChange(member.id, "staff")}
                        className="text-xs font-medium"
                      >
                        <Users className="h-3.5 w-3.5 mr-2 text-slate-500" />
                        Make Staff
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setMemberToRemove(member.id)}
                        className="text-xs text-red-600 focus:text-red-600 font-medium"
                      >
                        <UserMinus className="h-3.5 w-3.5 mr-2" />
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <InviteMemberDialog
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        organizationId={organizationId}
      />

      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={(open) => !open && setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the member&apos;s access to your organization.
              They can be re-invited later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-red-600 hover:bg-red-700"
            >
              {removeMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove Member"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
