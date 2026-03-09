import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Stagger index 1-6 for delay (0 = no stagger) */
  stagger?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  as?: keyof JSX.IntrinsicElements;
};

function AnimateInView({ children, className, stagger = 0, as: Tag = "div" }: Props) {
  const { ref, isVisible } = useInView(true);
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        "animate-in-view",
        isVisible && "is-visible",
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
