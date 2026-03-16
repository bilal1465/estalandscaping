import { useEffect, useRef, useState } from "react";

type HoverState = "default" | "link" | "nav" | "button";

const CLICKABLE_SELECTOR =
  'a, button, [role="button"], input[type="submit"], input[type="button"]';
const NAV_SELECTOR = "header nav button, header .nav-link-underline, .nav-link-underline";
const FORM_CONTROL_SELECTOR = "input, textarea, select, [contenteditable=\"true\"]";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hoverState, setHoverState] = useState<HoverState>("default");
  const [isVisible, setIsVisible] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const currentScaleRef = useRef(1);
  const opacityRef = useRef(0.22);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const isDesktop = finePointer.matches;
    setIsVisible(isDesktop);
  }, []);

  useEffect(() => {
    scaleRef.current =
      hoverState === "nav" ? 2.1 : hoverState === "button" ? 1.75 : hoverState === "link" ? 1.5 : 1;
    opacityRef.current = hoverState === "default" ? 0.22 : 0.32;
  }, [hoverState]);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || !isVisible) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const targetEl = e.target as HTMLElement;
      if (targetEl.closest(FORM_CONTROL_SELECTOR)) {
        setHoverState("default");
        return;
      }
      if (targetEl.closest(NAV_SELECTOR)) {
        setHoverState("nav");
        return;
      }
      const clickable = targetEl.closest(CLICKABLE_SELECTOR);
      if (clickable) {
        const isCta =
          clickable.classList.contains("bg-forest") ||
          clickable.classList.contains("bg-brown");
        setHoverState(isCta ? "button" : "link");
        return;
      }
      setHoverState("default");
    };

    const onLeave = () => setHoverState("default");

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onLeave);

    let running = true;
    let frameCount = 0;
    const tick = () => {
      if (!running) return;
      frameCount += 1;
      if (frameCount % 2 === 0) {
        pos.current.x += (target.current.x - pos.current.x) * 0.22;
        pos.current.y += (target.current.y - pos.current.y) * 0.22;
        currentScaleRef.current += (scaleRef.current - currentScaleRef.current) * 0.18;
        const s = currentScaleRef.current;
        const o = opacityRef.current;
        cursor.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%) scale(${s})`;
        cursor.style.opacity = String(o);
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    const onVisibilityChange = () => {
      running = document.visibilityState === "visible";
      if (running) rafId.current = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      running = false;
      cancelAnimationFrame(rafId.current);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-6 w-6 rounded-full border-2 border-forest bg-transparent will-change-transform"
      style={{ opacity: 0.22, transition: "opacity 0.2s ease-out" }}
      aria-hidden="true"
    />
  );
}
