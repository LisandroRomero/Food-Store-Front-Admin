import { Navigate } from "react-router-dom";

import LoginForm from "../components/Forms/LoginForm";

import { useAuthStore } from "../store/useAuthStore";

export default function LoginPage() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md border rounded-xl p-6 shadow">
        <h1 className="text-2xl font-bold mb-6">
          Iniciar sesión
        </h1>

        <LoginForm />
      </div>
    </main>
  );
}