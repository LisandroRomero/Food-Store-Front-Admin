import { Link, useLocation, useNavigate } from "react-router-dom";
import type { UserRole } from "../features/users/types/users.types";
import { useAuthStore } from "../features/users/store/useAuthStore";

interface SidebarLink {
  label: string;
  path: string;
  allowedRoles: UserRole[];
}

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const hasRole = useAuthStore((state) => state.hasRole);

  const links: SidebarLink[] = [
    {
      label: "Home",
      path: "/",
      allowedRoles: ["ADMIN", "PEDIDOS", "STOCK"],
    },

    {
      label: "Productos",
      path: "/productos",
      allowedRoles: ["ADMIN", "STOCK"],
    },

    {
      label: "Categorías",
      path: "/categorias",
      allowedRoles: ["ADMIN", "STOCK"],
    },

    {
      label: "Ingredientes",
      path: "/ingredientes",
      allowedRoles: ["ADMIN", "STOCK"],
    },
    {
      label: "Pedidos",
      path: "/pedidos",
      allowedRoles: ["ADMIN", "PEDIDOS"],
    },
    {
      label: "Cocina",
      path: "/cocina",
      allowedRoles: ["ADMIN", "PEDIDOS"],
    },
    {
      label: "Usuarios",
      path: "/usuarios",
      allowedRoles: ["ADMIN"],
    },
  ];

  const visibleLinks = links.filter((link) =>
    hasRole(...link.allowedRoles)
  );

  return (
    <aside
      className="
        w-64
        min-h-screen
        bg-gray-900
        text-gray-100
        border-r
        border-gray-800
        p-6
        flex
        flex-col
      "
    >
      {/* LOGO / TITLE */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold">Food Admin</h1>

        <p className="text-sm text-gray-400">
          Panel de gestión
        </p>
      </div>

      {/* NAV */}
      <nav className="flex flex-col gap-2">
        {visibleLinks.map((link) => {
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`
                px-4 py-3 rounded-xl transition text-sm font-medium
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }
              `}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* SPACER */}
      <div className="flex-1" />

      {/* BOTTOM: user info + logout */}
      <div className="border-t border-gray-800 pt-4 space-y-3">
        {user && (
          <p className="text-sm text-gray-400 px-4 truncate">
            {user.nombre} {user.apellido}
          </p>
        )}

        <button
          onClick={async () => {
            await logout();
            navigate("/login");
          }}
          className="w-full px-4 py-3 rounded-xl transition text-left text-sm text-red-400 hover:bg-gray-800 hover:text-red-300"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
