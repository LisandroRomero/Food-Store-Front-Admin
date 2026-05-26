import ProductosTable from "../components/ProductoTable";

export default function ProductosPage() {
  return (
    <section className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Productos</h1>
        <ProductosTable />
      </div>
    </section>
  );
}
