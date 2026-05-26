import ProductosTable from "../components/ProductoTable";

export default function ProductosPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-2xl font-bold mb-6">Productos</h1>
      <ProductosTable />
    </main>
  );
}
