import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getIngresos } from "../services/estadisticas.service";

const BAR_COLORS = ["#3B82F6", "#22C55E", "#A855F7", "#F59E0B"];

const SVG_W = 500;
const SVG_H = 300;
const BAR_H = 24;
const BAR_GAP = 12;
const TOP = 40;
const LABEL_X = 95;
const BAR_X = 105;
const MAX_BAR_W = SVG_W - BAR_X - 85;

function formatMoney(n: number): string {
  return `$ ${n.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function IngresosChart() {
  const { data: rawData, isLoading, isError } = useQuery({
    queryKey: ["estadisticas", "ingresos"],
    queryFn: () => getIngresos(),
  });

  const maxCantidad = useMemo(
    () => (rawData ? Math.max(...rawData.map((d) => d.cantidad)) : 0),
    [rawData]
  );

  if (isLoading) {
    return (
      <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Ingresos por forma de pago</h3>
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          Cargando...
        </div>
      </article>
    );
  }

  if (isError) {
    return (
      <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Ingresos por forma de pago</h3>
        <div className="h-[300px] flex items-center justify-center text-red-500">
          Error al cargar
        </div>
      </article>
    );
  }

  if (!rawData || rawData.length === 0) {
    return (
      <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Ingresos por forma de pago</h3>
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          Sin datos disponibles
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Ingresos por forma de pago</h3>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto"
        style={{ maxHeight: SVG_H }}
      >
        {rawData.map((item, i) => {
          const y = TOP + i * (BAR_H + BAR_GAP);
          const barW = maxCantidad > 0
            ? (item.cantidad / maxCantidad) * MAX_BAR_W
            : 0;

          return (
            <g key={item.forma_pago_codigo}>
              <text
                x={LABEL_X}
                y={y + BAR_H / 2}
                textAnchor="end"
                dominantBaseline="middle"
                fill="#374151"
                fontSize={12}
              >
                {item.forma_pago_codigo}
              </text>
              <rect
                x={BAR_X}
                y={y}
                width={Math.max(barW, 0)}
                height={BAR_H}
                rx={4}
                fill={BAR_COLORS[i % BAR_COLORS.length]}
              />
              <text
                x={BAR_X + Math.max(barW, 0) + 6}
                y={y + BAR_H / 2}
                dominantBaseline="middle"
                fill="#4B5563"
                fontSize={12}
              >
                {formatMoney(item.cantidad)}
              </text>
            </g>
          );
        })}
      </svg>
    </article>
  );
}
