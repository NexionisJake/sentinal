import type { ReactNode } from "react";
import { useAppContext } from "../../context/AppContext";
import { GovLoginPage } from "../../pages/GovLoginPage";

export function GovProtectedRoute({ children }: { children: ReactNode }) {
  const { isGovAuthenticated } = useAppContext();

  if (!isGovAuthenticated) {
    return <GovLoginPage />;
  }

  return <>{children}</>;
}
