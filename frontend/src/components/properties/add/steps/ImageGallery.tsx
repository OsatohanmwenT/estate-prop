"use client";

import { Loader2, X } from "lucide-react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  deletingIndexes?: Set<number>;
  onRemoveImage: (index: number, url: string) => void;
}

export function ImageGallery({
  images,
  onRemoveImage,
  deletingIndexes = new Set(),
}: ImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/30">
        <p className="text-muted-foreground">
          No images yet. Upload or add images to showcase your property.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {images.map((imageUrl, index) => {
        const isDeleting = deletingIndexes.has(index);

        return (
          <div
            key={`${imageUrl}-${index}`}
            className="relative aspect-square border border-border rounded-lg overflow-hidden bg-muted group"
          >
            <Image
              fill
              src={imageUrl}
              alt={`Property image ${index + 1}`}
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemoveImage(index, imageUrl);
              }}
              disabled={isDeleting}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center disabled:opacity-100 disabled:cursor-not-allowed"
              type="button"
              aria-label={`Remove image ${index + 1}`}
            >
              {isDeleting ? (
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              ) : (
                <X className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}