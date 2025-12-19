"use client";

import { useEffect, useState, useCallback } from "react";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Check, ChevronsUpDown, Plus, AlertCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import { CreateOwnerDialog } from "~/components/owners/CreateOwnerDialog";
import { usePropertyFormStore } from "~/stores/usePropertyFormStore";
import { useOwnersStore } from "~/stores/useOwnersStore";
import { useOwners } from "~/lib/query";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";

interface Owner {
  id: string;
  fullName: string;
  email: string;
}

interface OwnerComboBoxProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function OwnerComboBox({ value, onChange, error }: OwnerComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [showCreateOwnerDialog, setShowCreateOwnerDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { owners, setOwners } = useOwnersStore();
  const {
    data: ownersData,
    error: fetchError,
    isLoading,
  } = useOwners(searchQuery);

  useEffect(() => {
    if (ownersData?.owners) {
      setOwners(ownersData.owners);
    }
  }, [ownersData, setOwners]);

  const { formData, setFormData } = usePropertyFormStore();
  const ownersList: Owner[] = Array.isArray(owners) ? owners : [];

  const handleOwnerSelect = useCallback(
    (ownerId: string) => {
      // Update both the form (React Hook Form) and the store (Zustand)
      if (onChange) {
        onChange(ownerId);
      }
      setFormData({ ...formData, ownerId });
      setOpen(false);
    },
    [formData, setFormData, onChange]
  );

  const handleCreateOwnerSuccess = useCallback(
    (ownerId: string) => {
      // Update both the form (React Hook Form) and the store (Zustand)
      if (onChange) {
        onChange(ownerId);
      }
      setFormData({ ...formData, ownerId });
    },
    [formData, setFormData, onChange]
  );

  const handleOpenCreateDialog = useCallback(() => {
    setOpen(false);
    setShowCreateOwnerDialog(true);
  }, []);

  // Use the value prop from React Hook Form if provided, otherwise fall back to store
  const currentOwnerId = value || formData.ownerId;
  const selectedOwner = ownersList.find((owner) => owner.id === currentOwnerId);

  return (
    <div className="space-y-2">
      <Label htmlFor="ownerId">
        Property Owner <span className="text-destructive">*</span>
      </Label>
      {fetchError && (
        <Alert variant="destructive" className="mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load owners. Please try again.
          </AlertDescription>
        </Alert>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select property owner"
            aria-invalid={!!error}
            className={cn(
              "w-full justify-between",
              error && "border-destructive focus:ring-destructive"
            )}
          >
            {selectedOwner ? selectedOwner.fullName : "Select owner..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search owner..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {isLoading ? (
                <div className="py-6 px-2 space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-2">
                      <Skeleton className="h-4 w-4 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <CommandEmpty>
                    <div className="text-center py-6">
                      <p className="text-sm text-muted-foreground mb-3">
                        No owner found.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handleOpenCreateDialog}
                      >
                        <Plus className="h-4 w-4" />
                        Add New Owner
                      </Button>
                    </div>
                  </CommandEmpty>
                  <CommandGroup>
                    {ownersList.map((owner) => (
                      <CommandItem
                        key={owner.id}
                        value={`${owner.fullName} ${owner.email}`}
                        keywords={[owner.fullName, owner.email]}
                        onSelect={() => handleOwnerSelect(owner.id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.ownerId === owner.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{owner.fullName}</span>
                          <span className="text-xs text-muted-foreground">
                            {owner.email}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
          {ownersList.length > 0 && !isLoading && (
            <>
              <Separator />
              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={handleOpenCreateDialog}
                >
                  <Plus className="h-4 w-4" />
                  Add New Owner
                </Button>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>

      <CreateOwnerDialog
        open={showCreateOwnerDialog}
        onOpenChange={setShowCreateOwnerDialog}
        onSuccess={handleCreateOwnerSuccess}
      />
    </div>
  );
}
