"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Upload } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import FileUploader from "~/components/file-uploader/FileUploader";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { DOCUMENT_CATEGORIES } from "~/constants/document";
import { useCreateDocument } from "~/lib/query/documents";
import { documentSchema, type DocumentFormData } from "~/schemas/document";

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ownerId?: string;
  propertyId?: string;
  folderId?: string;
}

export function DocumentUploadDialog({
  open,
  onOpenChange,
  ownerId,
  propertyId,
  folderId,
}: DocumentUploadDialogProps) {
  const queryClient = useQueryClient();
  const [uploadedFile, setUploadedFile] = useState<{
    url: string;
    fileName: string;
    fileType: string;
    fileSize?: number;
  } | null>(null);

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      fileName: "",
      fileUrl: "",
      fileType: "",
      category: undefined,
      description: "",
      tags: [],
      ownerId,
      propertyId,
      folderId,
    },
  });

  const { mutate: createDocument, isPending } = useCreateDocument();

  const handleSuccess = () => {
    toast.success("Document uploaded successfully");
    form.reset();
    setUploadedFile(null);
    onOpenChange(false);
  };

  const handleError = (error: any) => {
    toast.error(error?.message || "Failed to upload document");
  };

  const handleFileUpload = (file: {
    url: string;
    fileId?: string;
    size: number;
  }) => {
    // Extract file details from the uploaded file
    const fileName = file.url.split("/").pop() || "document";
    const fileType = fileName.split(".").pop() || "unknown";

    setUploadedFile({
      url: file.url,
      fileName,
      fileType: `application/${fileType}`,
      fileSize: file.size,
    });

    form.setValue("fileUrl", file.url);
    form.setValue("fileName", fileName);
    form.setValue("fileType", `application/${fileType}`);
  };

  const onSubmit = (data: DocumentFormData) => {
    if (!uploadedFile) {
      toast.error("Please upload a file first");
      return;
    }

    createDocument(
      {
        ...data,
        fileName: data.fileName || uploadedFile.fileName,
        fileUrl: uploadedFile.url,
        fileType: uploadedFile.fileType,
        fileSize: uploadedFile.fileSize,
        ownerId,
        propertyId,
        folderId,
      },
      {
        onSuccess: handleSuccess,
        onError: handleError,
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">
            Upload Document
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Upload a new document for this owner. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* File Uploader */}
          <div className="space-y-2">
            <FieldLabel htmlFor="file">
              File <span className="text-red-500">*</span>
            </FieldLabel>
            <FileUploader
              onComplete={handleFileUpload}
              resetAfterUpload={false}
            />
            {uploadedFile && (
              <p className="text-xs text-slate-500 mt-2">
                ✓ File uploaded: {uploadedFile.fileName}
              </p>
            )}
          </div>

          {/* File Name */}
          <Controller
            name="fileName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Document Name <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="fileName"
                  placeholder="e.g., Owner ID Card, Contract"
                  className="rounded-sm"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Category */}
          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Category <span className="text-red-500">*</span>
                </FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="rounded-sm">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Description */}
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Description (Optional)
                </FieldLabel>
                <Textarea
                  {...field}
                  id="description"
                  placeholder="Add any notes or description..."
                  className="rounded-sm resize-none"
                  rows={3}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="rounded-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !uploadedFile}
              className="rounded-sm"
            >
              {isPending ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
