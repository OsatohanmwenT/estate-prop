import { CloudUploadIcon, FileIcon, ImageIcon, Loader2, XIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";

export const RenderEmptyState = ({
  isDragActive,
  acceptedFileTypes = "all",
}: {
  isDragActive: boolean;
  acceptedFileTypes?: "image" | "document" | "all";
}) => {
  const getMessage = () => {
    switch (acceptedFileTypes) {
      case "image":
        return "Drop your images here or";
      case "document":
        return "Drop your documents here or";
      default:
        return "Drop your files here or";
    }
  };

  const getAcceptedFormats = () => {
    switch (acceptedFileTypes) {
      case "image":
        return "Supported: JPG, PNG, GIF, WebP";
      case "document":
        return "Supported: PDF, DOC, DOCX, XLS, XLSX, TXT, CSV";
      case "all":
        return "Supported: Images and Documents";
      default:
        return "";
    }
  };

  return (
    <div className="text-center font-poppins flex flex-col items-center justify-center gap-2 h-full">
      <div className="flex items-center justify-center mx-auto size-12 rounded-full bg-muted">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-light-green"
          )}
        />
      </div>
      <p className="text-sm font-medium text-foreground">
        {getMessage()}{" "}
        <span className="font-semibold cursor-pointer text-light-green">
          click to upload
        </span>
      </p>
      <p className="text-xs text-muted-foreground">{getAcceptedFormats()}</p>
      <Button type="button" className="mt-3">
        Select File
      </Button>
    </div>
  );
};

export const RenderErrorState = ({ onRetry }: { onRetry?: () => void }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center gap-2 h-full">
      <div className="flex items-center justify-center mx-auto bg-destructive/10 size-12 rounded-full">
        <ImageIcon className={cn("size-6 text-destructive")} />
      </div>
      <p className="text-sm mt-2 font-poppins text-destructive">
        Upload failed. Please try again.
      </p>
      <Button
        variant="destructive"
        type="button"
        className="font-poppins mt-3"
        onClick={onRetry}
      >
        Retry File Selection
      </Button>
    </div>
  );
};

export const RenderUploadedState = ({
  previewUrl,
  isDeleting,
  handleRemoveFile,
  file,
  fileType,
}: {
  previewUrl: string;
  isDeleting: boolean;
  handleRemoveFile: () => void;
  file?: File | null;
  fileType?: "image" | "video" | "document";
}) => {
  console.log("RenderUploadedState called with previewUrl:", previewUrl);

  // Render document preview
  if (fileType === "document" && file) {
    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
    };

    const getFileExtension = (filename: string) => {
      return filename.split(".").pop()?.toUpperCase() || "FILE";
    };

    return (
      <div className="relative h-full flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 max-w-sm w-full">
          {/* Document Icon */}
          <div className="flex items-center justify-center size-16 rounded-lg bg-muted">
            <FileIcon className="size-8 text-muted-foreground" />
          </div>

          {/* File Info */}
          <div className="text-center w-full">
            <p className="text-sm font-medium text-foreground truncate max-w-xs mx-auto">
              {file.name}
            </p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                {getFileExtension(file.name)}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </span>
            </div>
          </div>

          {/* Success Badge */}
          <div className="flex items-center gap-1 text-green-600">
            <svg
              className="size-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-xs font-medium">Uploaded successfully</span>
          </div>
        </div>

        {/* Remove Button */}
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className={cn("absolute top-2 right-2")}
          onClick={handleRemoveFile}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <XIcon className="size-4" />
          )}
        </Button>
      </div>
    );
  }

  // Render image/video preview
  return (
    <div className="h-[300px] relative">
      <Image
        src={previewUrl}
        alt="Uploaded file"
        fill
        className="object-contain p-2"
      />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className={cn("absolute top-2 right-2")}
        onClick={handleRemoveFile}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <XIcon className="size-4" />
        )}
      </Button>
    </div>
  );
};

export const RenderUploadingState = ({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) => {
  return (
    <div className="text-center font-hanken flex items-center justify-center flex-col">
      <p>{progress}%</p>
      <p className="mt-2 text-sm font-medium text-foreground">Uploading...</p>
      <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">
        {file.name}
      </p>
    </div>
  );
};