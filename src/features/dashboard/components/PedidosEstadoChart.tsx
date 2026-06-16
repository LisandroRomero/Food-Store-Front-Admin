import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPedidosPorEstado } from "../services/estadisticas.service";

type PieDatum = {
  name: string;
  value: number;
};

type TooltipState = {
  name: string;
  value: number;
  percentage: number;
  x: number;
  y: number;
};

const ESTADO_COLORS: Record<string, string> = {
  PENDIENTE: "#f59e0b",
  CONFIRMADO: "#3b82f6",
  EN_PREPARACION: "#8b5cf6",
  LISTO: "#10b981",
  ENTREGADO: "#06b6d4",
  CANCELADO: "#ef4444",
};

const CX = 200;
const CY = 145;
const R = 125;

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

export default function PedidosEstadoChart() {
  const { data: rawData, isLoading, isError } = useQuery({
    queryKey: ["estadisticas", "pedidos-estado"],
    queryFn: getPedidosPorEstado,
  });

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const pieData = useMemo<PieDatum[]>(
    () =>
      rawData
        ? rawData.map((d) => ({
            name: d.estado_codigo,
            value: d.cantidad,
          }))
        : [],
    [rawData]
  );

  const total = useMemo(
    () => pieData.reduce((sum, d) => sum + d.value, 0),
    [pieData]
  );

  const slices = useMemo(() => {
    let currentAngle = 0;
    return pieData.map((d) => {
      const percentage = total > 0 ? d.value / total : 0;
      const sliceAngle = percentage * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;
      return {
        ...d,
        percentage,
        path: describeArc(CX, CY, R, startAngle, endAngle),
        color: ESTADO_COLORS[d.name] ?? "#6b7280",
      };
    });
  }, [pieData, total]);

  if (isLoading) {
    return (
      <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Pedidos por estado</h3>
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          Cargando...
        </div>
      </article>
    );
  }

  if (isError) {
    return (
      <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Pedidos por estado</h3>
        <div className="h-[300px] flex items-center justify-center text-red-500">
          Error al cargar
        </div>
      </article>
    );
  }

  if (!rawData || rawData.length === 0) {
    return (
      <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Pedidos por estado</h3>
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          Sin datos disponibles
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative">
      <h3 className="text-lg font-semibold mb-4">Pedidos por estado</h3>

      <svg viewBox="0 0 400 280" className="w-full h-auto max-h-[280px]">
        {slices.map((s) => (
          <path
            key={s.name}
            d={s.path}
            fill={s.color}
            stroke="#fff"
            strokeWidth={2}
            className="cursor-pointer transition-opacity hover:opacity-80"
            onMouseEnter={(e) => {
              const rect = (e.target as SVGElement)
                .closest("article")
                ?.getBoundingClientRect();
              setTooltip({
                name: s.name,
                value: s.value,
                percentage: s.percentage,
                x: e.clientX - (rect?.left ?? 0),
                y: e.clientY - (rect?.top ?? 0),
              });
            }}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
      </svg>

      {tooltip && (
        <div
          className="absolute pointer-events-none bg-gray-900 text-white text-sm rounded px-2 py-1 shadow-lg z-10 whitespace-nowrap"
          style={{ left: tooltip.x + 12, top: tooltip.y - 32 }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
            style={{ backgroundColor: ESTADO_COLORS[tooltip.name] ?? "#6b7280" }}
          />
          {tooltip.name}: {tooltip.value} ({(tooltip.percentage * 100).toFixed(1)}%)
        </div>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 justify-center text-sm text-gray-600">
        {slices.map((s) => (
          <div key={s.name} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: s.color }}
            />
            <span>
              {s.name} — {(s.percentage * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}
