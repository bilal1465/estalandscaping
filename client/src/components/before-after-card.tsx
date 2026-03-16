import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AUTO_ADVANCE_MS = 2500;
const PAUSE_AFTER_MANUAL_MS = 4000;

type BeforeAfterCardProps = {
  before: string;
  after: string;
  title: string;
  subtitle: string;
};

export function BeforeAfterCard({ before, after, title, subtitle }: BeforeAfterCardProps) {
  const [index, setIndex] = useState(0);
  const [pausedUntil, setPausedUntil] = useState(0);
  const images = [before, after];
  const labels = ["Before", "After"];

  const goTo = useCallback(
    (direction: -1 | 1) => {
      setIndex((i) => (i + direction + 2) % 2);
      setPausedUntil(Date.now() + PAUSE_AFTER_MANUAL_MS);
    },
    []
  );

  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() < pausedUntil) return;
      setIndex((i) => (i + 1) % 2);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [pausedUntil]);

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden bg-white shadow-md transition-transform duration-200 ease-out hover:shadow-lg">
      {/* Image area with single visible image + fade */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={labels[i]}
            width={400}
            height={300}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            loading="lazy"
            decoding="async"
          />
        ))}
        {/* Label: Before / After */}
        <div className="absolute top-3 left-3 z-20">
          <span className="inline-block rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-white">
            {labels[index]}
          </span>
        </div>
        {/* Nav controls: previous / next */}
        <div className="absolute bottom-3 right-3 z-20 flex gap-1.5">
          <button
            type="button"
            onClick={() => goTo(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-forest shadow-sm transition-all duration-200 hover:bg-white hover:shadow"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => goTo(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-forest shadow-sm transition-all duration-200 hover:bg-white hover:shadow"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      {/* Caption */}
      <div className="flex flex-col gap-1 p-5">
        <p className="text-sm font-medium text-forest">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}
