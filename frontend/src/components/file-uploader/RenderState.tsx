import { cn } from "~/lib/utils";
import { CloudUploadIcon, ImageIcon, Loader2, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

export const RenderEmptyState = ({
  isDragActive,
}: {
  isDragActive: boolean;
}) => {
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
        Drop your files here or{" "}
        <span className="font-semibold cursor-pointer text-light-green">
          click to upload
        </span>
      </p>
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
}: {
  previewUrl: string;
  isDeleting: boolean;
  handleRemoveFile: () => void;
}) => {
  console.log("RenderUploadedState called with previewUrl:", previewUrl);
  return (
    <div className="h-[300px]">
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
      <p>{progress}</p>
      <p className="mt-2 text-sm font-medium text-foreground">Uploading...</p>
      <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">
        {file.name}
      </p>
    </div>
  );
};
