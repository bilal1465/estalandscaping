import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import CustomCursor from "@/components/custom-cursor";
import { LenisProvider } from "@/contexts/lenis-context";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const lenisRef = useSmoothScroll();
  useScrollReveal();
  return (
    <LenisProvider lenisRef={lenisRef}>
      <CustomCursor />
      {children}
    </LenisProvider>
  );
}
