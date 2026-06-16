import {
  Routes,
  Route,
} from "react-router-dom";
import  ForbiddenPage  from "./ForbiddenPage";
import IngredientePage from "../features/ingredientes/pages/IngredientePage";
import CategoriaPage from "../features/categorias/pages/CategoriaPage";
import ProductoPage from "../features/productos/pages/ProductoPage";
import HomePage from "./HomePage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import LoginPage from "../features/users/pages/LoginPage";
import AdminLayout from "../shared/AdminLayout";
import PedidosKanbanPage from "../features/ordenes/pages/PedidosKanbanPage";
import UsersPage from "../features/users/pages/UsersPage";
import ProtectedRoute from "../router/ProtectedRoutes";
import CocinaKanbanPage from "../features/cocina/pages/CocinaKanbanPage";

const AppRouter = () => {
  return (
    
      <Routes>

        {/* PÚBLICAS */}
        <Route
          path="/login"
          element={<LoginPage />}
        />
        <Route path="/forbidden" element={<ForbiddenPage />} />

        {/* HOME — landing page para ADMIN, STOCK y PEDIDOS */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN", "STOCK", "PEDIDOS"]}
            />
          }
        >
          <Route
            path="/"
            element={
              <AdminLayout>
                <HomePage />
              </AdminLayout>
            }
          />
        </Route>

        {/* SOLO ADMIN */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            />
          }
        >
          <Route
            path="/dashboard"
            element={
              <AdminLayout>
                <DashboardPage />
              </AdminLayout>
            }
          />
          <Route
            path="/usuarios"
            element={
              <AdminLayout>
                <UsersPage />
              </AdminLayout>
            }
          />
        </Route>

        {/* ADMIN Y STOCK */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "ADMIN",
                "STOCK",
              ]}
            />
          }
        >
          <Route
            path="/productos"
            element={
              <AdminLayout>
                <ProductoPage />
              </AdminLayout>
            }
          />

          <Route
            path="/categorias"
            element={
              <AdminLayout>
                <CategoriaPage />
              </AdminLayout>
            }
          />

          <Route
            path="/ingredientes"
            element={
              <AdminLayout>
                <IngredientePage />
              </AdminLayout>
            }
          />
        </Route>

        {/* ADMIN Y PEDIDOS */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "ADMIN",
                "PEDIDOS",
              ]}
            />
          }
        >
          <Route
            path="/pedidos"
            element={
              <AdminLayout>
                <PedidosKanbanPage />
              </AdminLayout>
            }
          />

          <Route
            path="/cocina"
            element={
              <AdminLayout>
                <CocinaKanbanPage />
              </AdminLayout>
            }
          />
        </Route>

      </Routes>
    
  );
};

export default AppRouter;