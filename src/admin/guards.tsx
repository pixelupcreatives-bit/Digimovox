import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/store/StoreProvider";
import type { Permission } from "@/store/types";
import { Card } from "./ui/Primitives";
import { ShieldAlert } from "lucide-react";

/** Redirects to login when there is no active session. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const db = useAuth();
  const location = useLocation();
  if (!db.user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}

/** Renders a "not permitted" screen when the role lacks a permission. */
export function RequirePermission({
  permission,
  children,
}: {
  permission: Permission;
  children: ReactNode;
}) {
  const { can } = useAuth();
  if (!can(permission)) {
    return (
      <Card className="p-10">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-button bg-error-bg flex items-center justify-center text-error mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-text-primary">Not permitted</h2>
          <p className="text-sm text-text-muted mt-1.5 max-w-sm">
            Your role doesn't include access to this module. If you need it,
            ask an Admin to grant the relevant permission.
          </p>
        </div>
      </Card>
    );
  }
  return <>{children}</>;
}
