import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

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
    </aside>
  );
}
