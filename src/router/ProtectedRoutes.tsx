import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuthStore } from "../features/users/store/useAuthStore";

export default function ProtectedRoute() {
  const isAuthenticated =
    useAuthStore(
      (state) => state.isAuthenticated
    );

  const isLoading = useAuthStore(
    (state) => state.isLoading
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

  return <Outlet />;
}