import { useEffect, useRef, useState } from "react";

const options: IntersectionObserverInit = {
  root: null,
  rootMargin: "0px 0px -8% 0px",
  threshold: 0.1,
};

/**
 * Uses Intersection Observer (with requestAnimationFrame for class toggling)
 * to detect when element enters viewport. Use with .animate-in-view / .is-visible.
 */
export function useInView(once = true) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (!entry) return;
      requestAnimationFrame(() => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else if (!once) {
          setIsVisible(false);
        }
      });
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return { ref, isVisible };
}
