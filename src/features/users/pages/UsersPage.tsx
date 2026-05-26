import UsersTable from "../components/UsersTable";

export default function UsersPage() {
  return (
    <section className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Usuarios</h1>
        <UsersTable />
      </div>
    </section>
  );
}
