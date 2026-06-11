import {
  Navigate,
  Outlet,
} from "react-router-dom";
import { type UserRole } from "../features/users/types/users.types";
import { useAuthStore } from "../features/users/store/useAuthStore";

type Props = {
  allowedRoles: UserRole[];
};

export default function ProtectedRoute({allowedRoles}:Props) {
  const isAuthenticated =
    useAuthStore(
      (state) => state.isAuthenticated
    );

  const isLoading = useAuthStore(
    (state) => state.isLoading
  );
  const hasRole = useAuthStore(
    (state) => state.hasRole
  );

  if (isLoading) {
    return (
      <div>
        Verificando sesión...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }
  if (!hasRole(...allowedRoles)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}