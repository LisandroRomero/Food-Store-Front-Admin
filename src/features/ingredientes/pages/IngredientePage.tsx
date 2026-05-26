import IngredientesTable from "../components/IngredientesTable";

export default function IngredientesPage() {
  return (
    <section className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Ingredientes</h1>
        <IngredientesTable />
      </div>
    </section>
  );
}
