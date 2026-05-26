import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../features/users/store/useAuthStore";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const links = [
    {
      label: "Home",
      path: "/",
    },

    {
      label: "Productos",
      path: "/productos",
    },

    {
      label: "Categorías",
      path: "/categorias",
    },

    {
      label: "Ingredientes",
      path: "/ingredientes",
    },
    {
      label: "Pedidos",
      path: "/pedidos",
    },
  ];

  return (
    <aside
      className="
        w-64
        min-h-screen
        bg-slate-950
        text-slate-100
        border-r
        border-slate-800
        p-6
        flex
        flex-col
      "
    >
      {/* LOGO / TITLE */}
      <div className="mb-10">
        <h1
          className="
            text-2xl
            font-bold
          "
        >
          Food Admin
        </h1>

        <p
          className="
            text-sm
            text-slate-400
          "
        >
          Panel de gestión
        </p>
      </div>

      {/* NAV */}
      <nav
        className="
          flex
          flex-col
          gap-2
        "
      >
        {links.map((link) => {
          const isActive =
            location.pathname ===
            link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`
                px-4
                py-3
                rounded-xl
                transition
                ${
                  isActive
                    ? `
                      bg-blue-600
                      text-slate-100
                    `
                    : `
                      hover:bg-slate-900
                      text-slate-300
                    `
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
      <div className="border-t border-slate-800 pt-4 space-y-3">
        {user && (
          <p className="text-sm text-slate-400 px-4 truncate">
            {user.nombre} {user.apellido}
          </p>
        )}

        <button
          onClick={async () => {
            await logout();
            navigate("/login");
          }}
          className="w-full px-4 py-3 rounded-xl transition text-left text-sm text-red-400 hover:bg-slate-900 hover:text-red-300"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
