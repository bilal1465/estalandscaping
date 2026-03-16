import { useCallback } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

const VISIBLE_CLASS = "is-visible";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Stagger index 1-6 for delay (0 = no stagger) */
  stagger?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  as?: keyof JSX.IntrinsicElements;
};

/**
 * Reveal animation on scroll. Uses DOM class toggle instead of React state
 * so fast scrolling through many instances (Services, Our Work) does not
 * cause rerenders and scroll jank.
 */
function AnimateInView({ children, className, stagger = 0, as: Tag = "div" }: Props) {
  const onVisible = useCallback((el: Element) => {
    el.classList.add(VISIBLE_CLASS);
  }, []);

  const { ref } = useInView(true, onVisible);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        "animate-in-view",
        stagger > 0 && `stagger-${stagger}`,
        className
      )}
    >
      {children}
    </Tag>
  );
}

export { AnimateInView };
export default AnimateInView;
