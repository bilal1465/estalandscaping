"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImageLightboxProps {
  /** List of image URLs */
  images: string[];
  /** Current image index (0-based) */
  currentIndex: number;
  /** Whether the lightbox is open */
  open: boolean;
  /** Called when the lightbox should close */
  onClose: () => void;
  /** Called when user navigates to a different image */
  onIndexChange: (index: number) => void;
  /** Alt text for each image (optional; falls back to "Gallery image N") */
  altTexts?: string[];
  className?: string;
}

export function ImageLightbox({
  images,
  currentIndex,
  open,
  onClose,
  onIndexChange,
  altTexts = [],
  className,
}: ImageLightboxProps) {
  const src = images[currentIndex] ?? "";
  const alt = altTexts[currentIndex] ?? `Gallery image ${currentIndex + 1}`;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  const goPrev = () => hasPrev && onIndexChange(currentIndex - 1);
  const goNext = () => hasNext && onIndexChange(currentIndex + 1);

  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, currentIndex, onClose, onIndexChange]);

  if (images.length === 0) return null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/80 modal-overlay-transition",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
          onClick={onClose}
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-[95vw] max-w-6xl translate-x-[-50%] translate-y-[-50%] modal-content-transition",
            "focus:outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            className
          )}
          onPointerDownOutside={onClose}
          onEscapeKeyDown={onClose}
          aria-label="Enlarged gallery image"
        >
          <DialogPrimitive.Title className="sr-only">
            {alt}
          </DialogPrimitive.Title>

          {/* Close button */}
          <DialogPrimitive.Close
            className={cn(
              "absolute right-2 top-2 z-10 rounded-full p-2 text-white/90 backdrop-blur-sm",
              "hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            )}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </DialogPrimitive.Close>

          {/* Prev / Next arrows */}
          {hasPrev && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className={cn(
                "absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-white/90 backdrop-blur-sm",
                "hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              )}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}
          {hasNext && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className={cn(
                "absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-white/90 backdrop-blur-sm",
                "hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              )}
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}

          {/* Image container: responsive, no stretch/crop */}
          <div className="flex max-h-[85vh] min-h-[200px] w-full items-center justify-center p-4 sm:p-6">
            <img
              src={src}
              alt={alt}
              className="max-h-[85vh] w-auto max-w-full object-contain"
              draggable={false}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Optional counter for many images */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white/90">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
