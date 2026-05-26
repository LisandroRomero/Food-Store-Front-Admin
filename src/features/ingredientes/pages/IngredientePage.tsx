import IngredientesTable from "../components/IngredientesTable";

export default function IngredientesPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-2xl font-bold mb-6">Ingredientes</h1>
      <IngredientesTable />
    </main>
  );
}
