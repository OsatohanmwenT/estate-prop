"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "~/components/ui/field";
import { Loader2, Upload, FileSpreadsheet, FileText } from "lucide-react";
import { importService } from "~/services";
import { importSchema, type ImportFormValues } from "~/schemas/import";

interface MasterImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function MasterImportDialog({
  open,
  onOpenChange,
  onSuccess,
}: MasterImportDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<ImportFormValues>({
    resolver: zodResolver(importSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const importMutation = useMutation({
    mutationFn: (file: File) => importService.importMasterSheet(file),
    onSuccess: (data) => {
      toast.success(data.message || "Import completed successfully");
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["owners"] });
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      onSuccess?.();
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to import data");
    },
  });

  const onSubmit = (data: ImportFormValues) => {
    importMutation.mutate(data.file);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Data (Master Sheet)</DialogTitle>
          <DialogDescription>
            Upload your Excel or Word record sheet. The system will
            automatically create properties, owners, tenants, and leases.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          <Controller
            control={form.control}
            name="file"
            render={({
              field: { value, onChange, ...fieldState },
              fieldState: { error },
            }) => (
              <Field>
                <FieldLabel>Select File (.xlsx, .docx)</FieldLabel>
                <FieldContent>
                  <Input
                    {...fieldState}
                    type="file"
                    accept=".xlsx, .xls, .docx, .doc"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                      }
                    }}
                    className="cursor-pointer"
                    disabled={importMutation.isPending}
                  />
                  {value && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md mt-2">
                      {value.name.endsWith(".docx") ||
                      value.name.endsWith(".doc") ? (
                        <FileText className="h-4 w-4" />
                      ) : (
                        <FileSpreadsheet className="h-4 w-4" />
                      )}
                      <span>
                        {value.name} ({(value.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  )}
                </FieldContent>
                <FieldError errors={[error]} />
              </Field>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={importMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isValid || importMutation.isPending}
            >
              {importMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Start Import
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
