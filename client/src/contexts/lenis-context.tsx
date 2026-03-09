import { createContext, useContext, useRef, type ReactNode } from "react";
import type Lenis from "lenis";

type LenisContextValue = { lenisRef: React.RefObject<Lenis | null> };

const LenisContext = createContext<LenisContextValue | null>(null);

export function LenisProvider({ children, lenisRef }: { children: ReactNode; lenisRef: React.RefObject<Lenis | null> }) {
  return (
    <LenisContext.Provider value={{ lenisRef }}>
      {children}
    </LenisContext.Provider>
  );
}

export function useLenisRef() {
  const ctx = useContext(LenisContext);
  return ctx?.lenisRef ?? null;
}
