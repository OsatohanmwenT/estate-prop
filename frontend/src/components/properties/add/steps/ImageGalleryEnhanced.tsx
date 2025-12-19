"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface SortableImageProps {
  id: string;
  url: string;
  index: number;
  isPrimary: boolean;
  isDeleting: boolean;
  onRemove: (index: number, url: string) => void;
  onSetPrimary: (index: number) => void;
}

function SortableImage({
  id,
  url,
  index,
  isPrimary,
  isDeleting,
  onRemove,
  onSetPrimary,
}: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative aspect-video rounded-lg overflow-hidden border-2 bg-muted",
        isPrimary && "border-primary",
        isDragging && "opacity-50 z-50",
        isDeleting && "opacity-50 pointer-events-none"
      )}
    >
      <Image
        src={url}
        alt={`Property image ${index + 1}`}
        fill
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            type="button"
            size="icon"
            variant={isPrimary ? "default" : "secondary"}
            className="h-8 w-8"
            onClick={() => onSetPrimary(index)}
            title={isPrimary ? "Primary image" : "Set as primary"}
          >
            <Star className={cn("h-4 w-4", isPrimary && "fill-current")} />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="h-8 w-8"
            onClick={() => onRemove(index, url)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="bg-background/80 p-1.5 rounded">
            <GripVertical className="h-4 w-4" />
          </div>
        </div>

        {isPrimary && (
          <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Primary
          </div>
        )}
      </div>

      {isDeleting && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-sm">Deleting...</div>
        </div>
      )}
    </div>
  );
}

interface ImageGalleryEnhancedProps {
  images: string[];
  onRemoveImage: (index: number, url: string) => void;
  onReorderImages: (newImages: string[]) => void;
  deletingIndexes: Set<number>;
  primaryImageIndex?: number;
  onSetPrimaryImage?: (index: number) => void;
}

export function ImageGalleryEnhanced({
  images,
  onRemoveImage,
  onReorderImages,
  deletingIndexes,
  primaryImageIndex = 0,
  onSetPrimaryImage,
}: ImageGalleryEnhancedProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((_, i) => `image-${i}` === active.id);
      const newIndex = images.findIndex((_, i) => `image-${i}` === over.id);

      const newImages = arrayMove(images, oldIndex, newIndex);
      onReorderImages(newImages);
    }
  };

  const handleSetPrimary = (index: number) => {
    if (onSetPrimaryImage) {
      onSetPrimaryImage(index);
    }
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={images.map((_, i) => `image-${i}`)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((url, index) => (
            <SortableImage
              key={`image-${index}`}
              id={`image-${index}`}
              url={url}
              index={index}
              isPrimary={index === primaryImageIndex}
              isDeleting={deletingIndexes.has(index)}
              onRemove={onRemoveImage}
              onSetPrimary={handleSetPrimary}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
