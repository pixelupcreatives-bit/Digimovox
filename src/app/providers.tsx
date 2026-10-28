import { type ReactNode } from "react";
import { StoreProvider } from "@/store/StoreProvider";

export function Providers({ children }: { children: ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}
