import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Leaf } from "lucide-react";

const INTRO_KEY = "esta-intro-seen";

export function hasSeenIntro(): boolean {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  return sessionStorage.getItem(INTRO_KEY) === "1";
}

export function markIntroSeen(): void {
  sessionStorage.setItem(INTRO_KEY, "1");
}

type Props = { onComplete: () => void };

export default function IntroAnimation({ onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const estaRef = useRef<HTMLDivElement>(null);
  const fullRef = useRef<HTMLDivElement>(null);
  const leafRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          markIntroSeen();
          // Blur/fade transition out
          gsap.to(containerRef.current, {
            duration: 0.6,
            opacity: 0,
            filter: "blur(12px)",
            ease: "power2.inOut",
            onComplete,
          });
        },
      });

      // 1. "ESTA" revealed (clip from left to right) — ~1s
      tl.fromTo(
        estaRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.1,
          ease: "power2.inOut",
        },
        0
      );

      // 2. "ESTA Landscaping" fades in below — starts after ESTA is mostly done
      tl.fromTo(
        fullRef.current,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        0.85
      );

      // 3. Leaf appears briefly
      tl.fromTo(
        leafRef.current,
        { opacity: 0, scale: 0.6, rotate: -15 },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.4,
          ease: "back.out(1.2)",
        },
        1.2
      );

      tl.to(leafRef.current, {
        opacity: 0.7,
        scale: 1.05,
        duration: 0.3,
        ease: "power1.inOut",
      }, 1.6);

      // Hold then transition out starts at ~2.4s
      tl.to({}, { duration: 0.5 }, 2.2);
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-off-white"
      aria-hidden="true"
    >
      <div ref={overlayRef} className="absolute inset-0" />
      <div className="relative flex flex-col items-center justify-center">
        {/* ESTA — revealed with clip-path */}
        <div
          ref={estaRef}
          className="overflow-hidden font-serif text-5xl font-bold tracking-tight text-forest sm:text-6xl md:text-7xl"
          style={{ clipPath: "inset(0 100% 0 0)" }}
        >
          ESTA
        </div>
        {/* ESTA Landscaping — fades in below */}
        <div
          ref={fullRef}
          className="mt-1 font-serif text-2xl font-medium tracking-wide text-forest/80 sm:text-3xl"
          style={{ opacity: 0 }}
        >
          Landscaping
        </div>
        {/* Leaf / nature element */}
        <div
          ref={leafRef}
          className="absolute -right-4 top-1/2 mt-2 -translate-y-1/2 text-forest/60 sm:-right-6"
          style={{ opacity: 0 }}
          aria-hidden="true"
        >
          <Leaf className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
