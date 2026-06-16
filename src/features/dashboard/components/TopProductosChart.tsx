import { useMemo } from "react";
import { Chart } from "react-charts";
import type { AxisOptions } from "react-charts";
import { useQuery } from "@tanstack/react-query";
import { getProductosTop } from "../services/estadisticas.service";

type ProductoDatum = {
  nombre: string;
  total_ingresos: number;
  cantidad_vendida: number;
};

export default function TopProductosChart() {
  const { data: rawData, isLoading, isError } = useQuery({
    queryKey: ["estadisticas", "productos-top"],
    queryFn: () => getProductosTop(5),
  });

  const data = useMemo(
    () =>
      rawData
        ? [
            {
              label: "Ingresos",
              data: rawData.map(
                (d): ProductoDatum => ({
                  nombre: d.nombre,
                  total_ingresos: d.total_ingresos,
                  cantidad_vendida: d.cantidad_vendida,
                })
              ),
            },
          ]
        : [],
    [rawData]
  );

  const primaryAxis = useMemo(
    (): AxisOptions<ProductoDatum> => ({
      getValue: (datum) => datum.nombre,
      scaleType: "band",
    }),
    []
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<ProductoDatum>[] => [
      { getValue: (datum) => datum.total_ingresos, elementType: "bar" },
    ],
    []
  );

  // react-charts tooltip render props shape can vary between versions; accept any to avoid type mismatch
  const tooltip = useMemo((): any => ({
    render: (props: any) => {
      // try common locations for the datum
      const datum: ProductoDatum = props?.datum ?? props?.primaryDatum?.datum ?? props?.data?.[0]?.original ?? null;
      if (!datum) return null;

      return (
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <p className="font-medium">{datum.nombre}</p>
          <p className="text-gray-500">
            {datum.cantidad_vendida} vendido(s) — ${datum.total_ingresos.toLocaleString("es-AR")}
          </p>
        </div>
      );
    },
  }), []);

  if (isLoading) {
    return (
      <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Productos top</h3>
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          Cargando...
        </div>
      </article>
    );
  }

  if (isError) {
    return (
      <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Productos top</h3>
        <div className="h-[300px] flex items-center justify-center text-red-500">
          Error al cargar
        </div>
      </article>
    );
  }

  if (!rawData || rawData.length === 0) {
    return (
      <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Productos top</h3>
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          Sin datos disponibles
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Productos top</h3>
      <div style={{ width: "100%", height: 300 }}>
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes,
            tooltip,
            primaryCursor: true,
          }}
        />
      </div>
    </article>
  );
}
