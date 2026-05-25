import { Link } from "react-router-dom";

export default function HomePage() {
  const routes = [
    {
      title: "Productos",
      path: "/productos",
      description:
        "Gestionar productos",
    },

    {
      title: "Categorías",
      path: "/categorias",
      description:
        "Gestionar categorías",
    },

    {
      title: "Ingredientes",
      path: "/ingredientes",
      description:
        "Gestionar ingredientes",
    },
  ];

  return (
    <div
      className="
        min-h-screen
        bg-slate-950
        text-slate-100
        p-8
      "
    >
      {/* HEADER */}
      <div className="mb-10">
        <h1
          className="
            text-4xl
            font-bold
            mb-2
          "
        >
          Panel principal
        </h1>

        <p className="text-slate-400">
          Seleccioná una sección
        </p>
      </div>

      {/* CARDS */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-6
        "
      >
        {routes.map((route) => (
          <Link
            key={route.path}
            to={route.path}
            className="
              bg-slate-900
              rounded-2xl
              shadow
              p-6
              hover:shadow-xl
              hover:-translate-y-1
              transition
              border
              border-slate-800
            "
          >
            <h2
              className="
                text-2xl
                font-semibold
                mb-2
              "
            >
              {route.title}
            </h2>

            <p className="text-slate-400">
              {route.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
