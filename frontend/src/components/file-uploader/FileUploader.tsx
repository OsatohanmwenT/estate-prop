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
  onComplete?: (file: { url: string; fileId?: string, size: number }) => void;
  resetAfterUpload?: boolean;
  acceptedFileTypes?: "image" | "document" | "all"; // New prop to control file types
  maxFileSize?: number; // in MB, default 5MB
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
  fileType: "image" | "video" | "document";
}

// Helper function to determine file type
const getFileType = (file: File): "image" | "video" | "document" => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "document";
};

const FileUploader: React.FC<FileUploaderProps> = ({
  value,
  onChange,
  onComplete,
  resetAfterUpload = false,
  acceptedFileTypes = "all",
  maxFileSize = 5, // Default 5MB
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
            onComplete?.({ url: response.url, fileId: response.fileId, size: file.size });
            
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
            console.log("Uploading file:", file);

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
      console.log(error);
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
        const detectedFileType = getFileType(file);

        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }

        // Create object URL only for images and videos
        const objectUrl =
          detectedFileType === "image" || detectedFileType === "video"
            ? URL.createObjectURL(file)
            : undefined;

        setFileState({
          file: file,
          uploading: false,
          progress: 0,
          objectUrl: objectUrl,
          error: false,
          id: uuidv4(),
          isDeleting: false,
          fileType: detectedFileType,
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

      const fileTypeInvalid = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-invalid-type"
      );

      if (fileSizeToBig) {
        toast.error(`File is too large, max size is ${maxFileSize}MB`);
      }

      if (tooManyFiles) {
        toast.error("Too many files selected, max is 1");
      }

      if (fileTypeInvalid) {
        toast.error("Invalid file type");
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

    if (fileState.objectUrl || fileState.file) {
      return (
        <RenderUploadedState
          previewUrl={fileState.objectUrl || ""}
          isDeleting={fileState.isDeleting}
          handleRemoveFile={handleRemoveFile}
          file={fileState.file}
          fileType={fileState.fileType}
        />
      );
    }

    return (
      <RenderEmptyState
        isDragActive={isDragActive}
        acceptedFileTypes={acceptedFileTypes}
      />
    );
  }

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  // Define accepted file types based on prop
  const getAcceptedTypes = (): Record<string, string[]> => {
    if (acceptedFileTypes === "image") {
      return { "image/*": [] };
    }

    if (acceptedFileTypes === "document") {
      return {
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
        "application/vnd.ms-excel": [".xls"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
          ".xlsx",
        ],
        "text/plain": [".txt"],
        "text/csv": [".csv"],
      };
    }

    // "all" - both images and documents
    return {
      "image/*": [],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/plain": [".txt"],
      "text/csv": [".csv"],
    };
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getAcceptedTypes(),
    maxFiles: 1,
    multiple: false,
    maxSize: maxFileSize * 1024 * 1024, // Convert MB to bytes
    onDropRejected: rejectedFiles,
    disabled:
      fileState.uploading ||
      (!!fileState.objectUrl && !fileState.error && !resetAfterUpload) ||
      (!!fileState.file && !fileState.error && !resetAfterUpload),
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
