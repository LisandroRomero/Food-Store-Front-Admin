import ResumenCards from "../components/ResumenCards";
import VentasChart from "../components/VentasChart";
import TopProductosChart from "../components/TopProductosChart";
import PedidosEstadoChart from "../components/PedidosEstadoChart";
import IngresosChart from "../components/IngresosChart";

export default function DashboardPage() {
  return (
    <section className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Panel de administración</p>
        </div>
        <ResumenCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <VentasChart />
          <TopProductosChart />
          <PedidosEstadoChart />
          <IngresosChart />
        </div>
      </div>
    </section>
  );
}
