import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import CustomCursor from "@/components/custom-cursor";
import { LenisProvider } from "@/contexts/lenis-context";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const lenisRef = useSmoothScroll();
  return (
    <LenisProvider lenisRef={lenisRef}>
      <CustomCursor />
      {children}
    </LenisProvider>
  );
}
