import { useCallback } from "react";
import { useLenisRef } from "@/contexts/lenis-context";

export function useScrollToSection() {
  const lenisRef = useLenisRef();

  return useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    if (lenisRef?.current) {
      lenisRef.current.scrollTo(element, { offset: -80 });
    } else {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [lenisRef]);
}
