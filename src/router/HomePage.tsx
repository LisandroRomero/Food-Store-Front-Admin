import { Link } from "react-router-dom";
import { useAuthStore } from "../features/users/store/useAuthStore";
import type { UserRole } from "../features/users/types/users.types";

export default function HomePage() {
  const hasRole = useAuthStore((state) => state.hasRole);

  const routes: { title: string; path: string; description: string; allowedRoles: UserRole[] }[] = [
    {
      title: "Productos",
      path: "/productos",
      description: "Gestionar productos",
      allowedRoles: ["ADMIN", "STOCK"],
    },
    {
      title: "Categorías",
      path: "/categorias",
      description: "Gestionar categorías",
      allowedRoles: ["ADMIN", "STOCK"],
    },
    {
      title: "Ingredientes",
      path: "/ingredientes",
      description: "Gestionar ingredientes",
      allowedRoles: ["ADMIN", "STOCK"],
    },
    {
      title: "Pedidos",
      path: "/pedidos",
      description: "Gestionar pedidos",
      allowedRoles: ["ADMIN", "PEDIDOS"],
    },
    {
      title: "Usuarios",
      path: "/usuarios",
      description: "Gestionar usuarios del sistema",
      allowedRoles: ["ADMIN"],
    },
    {
      title: "Cocina",
      path: "/cocina",
      description: "Gestionar pedidos en cocina",
      allowedRoles: ["ADMIN", "PEDIDOS"],
    },
  ];

  const visibleRoutes = routes.filter((r) => hasRole(...r.allowedRoles));

  return (
    <section className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">
            Panel principal
          </h1>
          <p className="text-gray-500">
            Seleccioná una sección
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleRoutes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="
                bg-white rounded-2xl shadow-sm border border-gray-200 p-6
                hover:shadow-md hover:-translate-y-1 transition
              "
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-900">
                {route.title}
              </h2>
              <p className="text-gray-500">{route.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
