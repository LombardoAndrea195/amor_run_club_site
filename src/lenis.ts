import { createContext, useContext, type RefObject } from "react";
import type { LenisRef } from "lenis/react";

export const LenisContext = createContext<RefObject<LenisRef | null> | null>(null);
export const useLenisRef = () => useContext(LenisContext);
