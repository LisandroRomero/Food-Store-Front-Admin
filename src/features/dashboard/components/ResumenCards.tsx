import { useQuery } from "@tanstack/react-query";
import { getResumen } from "../services/estadisticas.service";

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-6 bg-gray-200 rounded w-32" />
        </div>
      </div>
    </div>
  );
}

function ErrorCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <p className="text-red-500 text-sm">Error al cargar</p>
    </div>
  );
}

export default function ResumenCards() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["estadisticas", "resumen"],
    queryFn: getResumen,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <ErrorCard />
        <ErrorCard />
        <ErrorCard />
        <ErrorCard />
      </div>
    );
  }

  const cards = [
    {
      title: "Ventas hoy",
      value: `${data.ventas_hoy.toLocaleString("es-AR")}`,
    },
    {
      title: "Ticket promedio",
      value: `$${data.ticket_promedio.toLocaleString("es-AR")}`,
    },
    {
      title: "Pedidos activos",
      value: data.pedidos_activos.toLocaleString("es-AR"),
    },
    {
      title: "Mes actual",
      value: `${data.mes_actual.toLocaleString("es-AR")}`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
        >
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">{card.title}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
