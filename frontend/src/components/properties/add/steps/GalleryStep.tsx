"use client";

import { Plus } from "lucide-react";
import { Controller, Control, FieldValues } from "react-hook-form";
import { useRef, useState } from "react";
import FileUploader from "~/components/file-uploader/FileUploader";
import {
  Field,
  FieldLegend,
  FieldDescription,
  FieldError,
} from "~/components/ui/field";
import { Button } from "~/components/ui/button";
import { ImageGalleryEnhanced } from "./ImageGalleryEnhanced";
import { toast } from "sonner";

export function GalleryStep({
  control,
  watch,
  setValue,
}: {
  control: Control<FieldValues>;
  watch: any;
  setValue: any;
}) {
  const images: string[] = watch("images") || [];
  const fileIdByUrlRef = useRef<Map<string, string>>(new Map());
  const [deletingIndexes, setDeletingIndexes] = useState<Set<number>>(
    new Set()
  );
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

  const handleUploadComplete = (file: { url: string; fileId?: string }) => {
    if (file.fileId) {
      fileIdByUrlRef.current.set(file.url, file.fileId);
    }
    const newImages = [...images, file.url];
    console.log("📸 Image uploaded, setting form value:", newImages);
    setValue("images", newImages);
  };

  const handleImageUrlAdd = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      setValue("images", [...images, url]);
    }
  };

  const handleRemoveImage = async (index: number, url: string) => {
    const fileId = fileIdByUrlRef.current.get(url);

    // If we don't have a fileId (manual URL entry or missing map), just remove locally
    if (!fileId) {
      setValue(
        "images",
        images.filter((_, i) => i !== index)
      );
      return;
    }

    setDeletingIndexes((prev) => new Set([...prev, index]));

    try {
      const response = await fetch("/api/imagekit/delete-file", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });

      if (!response.ok) {
        toast.error("Failed to delete image from storage");
        setDeletingIndexes((prev) => {
          const next = new Set(prev);
          next.delete(index);
          return next;
        });
        return;
      }

      fileIdByUrlRef.current.delete(url);
      setValue(
        "images",
        images.filter((_, i) => i !== index)
      );
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting image");
      setDeletingIndexes((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }
  };

  const handleReorderImages = (newImages: string[]) => {
    setValue("images", newImages);
    toast.success("Images reordered");
  };

  const handleSetPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index);
    // Optionally move primary image to first position
    if (index !== 0) {
      const newImages = [...images];
      const [primaryImage] = newImages.splice(index, 1);
      newImages.unshift(primaryImage);
      setValue("images", newImages);
      setPrimaryImageIndex(0);
      toast.success("Primary image updated");
    }
  };

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Controller
        name="images"
        control={control}
        render={({ field, fieldState }) => (
          <Field className="gap-1.5" data-invalid={fieldState.invalid}>
            <FieldLegend className="!text-2xl mb-0">Gallery</FieldLegend>
            <FieldDescription className="mb-0">
              Upload images of your property.
            </FieldDescription>

            <div className="mt-4 space-y-4">
              <ImageGalleryEnhanced
                images={images}
                onRemoveImage={handleRemoveImage}
                onReorderImages={handleReorderImages}
                deletingIndexes={deletingIndexes}
                primaryImageIndex={primaryImageIndex}
                onSetPrimaryImage={handleSetPrimaryImage}
              />

              <div className="border-2 border-dashed border-border rounded-lg p-6 bg-muted/30">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="w-full">
                    <FileUploader
                      onComplete={handleUploadComplete}
                      resetAfterUpload={true}
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex-1 h-px bg-border"></div>
                    <span className="text-sm text-muted-foreground">or</span>
                    <div className="flex-1 h-px bg-border"></div>
                  </div>
                  <Button
                    onClick={handleImageUrlAdd}
                    className="w-full"
                    variant="outline"
                    type="button"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Image by URL
                  </Button>
                </div>
              </div>
            </div>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
}
