import { useMemo } from "react";
import { Chart } from "react-charts";
import type { AxisOptions } from "react-charts";
import { useQuery } from "@tanstack/react-query";
import { getVentasPeriodo } from "../services/estadisticas.service";

type VentasDatum = {
  fecha_grupo: string;
  valor: number;
};

export default function VentasChart() {
  const { data: rawData, isLoading, isError } = useQuery({
    queryKey: ["estadisticas", "ventas"],
    queryFn: () => getVentasPeriodo(),
  });

  const data = useMemo(
    () =>
      rawData
        ? [
            {
              label: "Total Ventas ($)",
              data: rawData.map(
                (d): VentasDatum => ({
                  fecha_grupo: d.fecha_grupo,
                  valor: d.ventas_totales,
                })
              ),
            },
            {
              label: "Cant. Pedidos",
              data: rawData.map(
                (d): VentasDatum => ({
                  fecha_grupo: d.fecha_grupo,
                  valor: d.cantidad_pedidos,
                })
              ),
            },
          ]
        : [],
    [rawData]
  );

  const primaryAxis = useMemo(
    (): AxisOptions<VentasDatum> => ({
      getValue: (datum) => datum.fecha_grupo,
      scaleType: "band",
    }),
    []
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<VentasDatum>[] => [
      { getValue: (datum) => datum.valor, elementType: "line" },
    ],
    []
  );

  if (isLoading) {
    return (
      <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Ventas por período</h3>
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          Cargando...
        </div>
      </article>
    );
  }

  if (isError) {
    return (
      <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Ventas por período</h3>
        <div className="h-[300px] flex items-center justify-center text-red-500">
          Error al cargar
        </div>
      </article>
    );
  }

  if (!rawData || rawData.length === 0) {
    return (
      <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Ventas por período</h3>
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          Sin datos disponibles
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Ventas por período</h3>
      <div style={{ width: "100%", height: 300 }}>
        <Chart options={{ data, primaryAxis, secondaryAxes }} />
      </div>
    </article>
  );
}
