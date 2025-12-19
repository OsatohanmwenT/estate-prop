"use client";

import React, { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { cn } from "~/lib/utils";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./RenderState";

interface FileUploaderProps extends FieldValues {
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (file: { url: string; fileId?: string }) => void;
  resetAfterUpload?: boolean;
}

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  fileId?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

const FileUploader: React.FC<FileUploaderProps> = ({
  value,
  onChange,
  onComplete,
  resetAfterUpload = false,
}) => {
  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    objectUrl: value || undefined,
    uploading: false,
    progress: 0,
    isDeleting: false,
    fileType: "image",
    fileId: value,
  });

  async function uploadFile(file: File) {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      // Prepare form data for backend upload
      const formData = new FormData();
      formData.append("file", file);

      // Upload through backend proxy
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentageCompleted = (event.loaded / event.total) * 100;
            setFileState((prev) => ({
              ...prev,
              progress: Math.round(percentageCompleted),
            }));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            setFileState((prev) => ({
              ...prev,
              progress: 100,
              uploading: false,
              fileId: response.fileId,
            }));
            toast.success("File uploaded successfully");
            onChange?.(response.url);
            onComplete?.({ url: response.url, fileId: response.fileId });

            // Reset uploader if configured for multiple uploads
            if (resetAfterUpload) {
              setTimeout(() => {
                setFileState({
                  file: null,
                  uploading: false,
                  objectUrl: undefined,
                  isDeleting: false,
                  progress: 0,
                  error: false,
                  fileType: "image",
                  id: null,
                });
              }, 500);
            }

            resolve();
          } else {
            const errorData = JSON.parse(xhr.responseText);
            const errorMsg =
              errorData.details || errorData.error || "Upload failed";
            reject(new Error(errorMsg));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Upload failed"));
        };

        // Upload through backend proxy to avoid CORS issues
        xhr.open("POST", "/api/imagekit/upload");
        xhr.send(formData);
      });
    } catch (error) {
      console.log(error)
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Upload error:", errorMessage);
      toast.error(`Upload failed: ${errorMessage}`);
      setFileState((prev) => ({
        ...prev,
        uploading: false,
        progress: 0,
        error: true,
      }));
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }

        setFileState({
          file: file,
          uploading: false,
          progress: 0,
          objectUrl: URL.createObjectURL(file),
          error: false,
          id: uuidv4(),
          isDeleting: false,
          fileType: "image",
        });
        uploadFile(file);
      }
    },
    [fileState.objectUrl]
  );

  const handleRemoveFile = async () => {
    if (fileState.isDeleting || !fileState.fileId) return;

    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      const response = await fetch("/api/imagekit/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId: fileState.fileId,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to remove file from storage");
        setFileState((prev) => ({
          ...prev,
          isDeleting: false,
          error: true,
        }));
        return;
      }

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      onChange?.("");

      setFileState({
        file: null,
        uploading: false,
        objectUrl: undefined,
        isDeleting: false,
        progress: 0,
        error: false,
        fileType: "image",
        id: null,
      });

      toast.success("File removed successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error removing file. Please try again");

      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }));
    }
  };

  function rejectedFiles(fileRejection: FileRejection[]) {
    if (fileRejection.length > 0) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );

      const fileSizeToBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );

      if (fileSizeToBig) {
        toast.error("File is too large, max size is 5MB");
      }

      if (tooManyFiles) {
        toast.error("Too many files selected, max is 1");
      }
    }
  }

  function renderContent() {
    if (fileState.uploading) {
      return (
        <RenderUploadingState
          progress={fileState.progress}
          file={fileState.file as File}
        />
      );
    }

    if (fileState.error) {
      return (
        <RenderErrorState
          onRetry={() => {
            setFileState({
              file: null,
              uploading: false,
              objectUrl: undefined,
              isDeleting: false,
              progress: 0,
              error: false,
              fileType: "image",
              id: null,
            });
          }}
        />
      );
    }

    if (fileState.objectUrl) {
      return (
        <RenderUploadedState
          previewUrl={fileState.objectUrl}
          isDeleting={fileState.isDeleting}
          handleRemoveFile={handleRemoveFile}
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
  }

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: rejectedFiles,
    disabled:
      fileState.uploading ||
      (!!fileState.objectUrl && !fileState.error && !resetAfterUpload),
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "border-dashed border-2 relative rounded-xs transition-colors ease-in-out p-4",
        isDragActive
          ? "border-light-green border-solid bg-neutral-50"
          : "border-gray-300 hover:border-light-green"
      )}
    >
      <CardContent className="flex items-center justify-center h-full w-full p-4">
        <Input type="file" {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default FileUploader;
