import { useEffect, useRef } from "react";

const defaultOptions: IntersectionObserverInit = {
  root: null,
  rootMargin: "0px 0px -6% 0px",
  threshold: 0.08,
};

/**
 * Uses IntersectionObserver and applies visibility by mutating the DOM (adding a class).
 * Does NOT use React state, so no rerenders when elements enter view — eliminates scroll jank
 * when many elements (e.g. Our Services, Our Work) cross the viewport during fast scroll.
 */
export function useInView(
  once = true,
  onVisible?: (el: Element) => void
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const target = entry.target;
        requestAnimationFrame(() => {
          if (onVisible) {
            onVisible(target);
          }
        });
        if (once) {
          observer.unobserve(target);
        }
      }
    }, defaultOptions);

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, onVisible]);

  return { ref };
}
