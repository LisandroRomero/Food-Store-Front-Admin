import {
  Routes,
  Route,
} from "react-router-dom";

import IngredientePage from "../features/ingredientes/pages/IngredientePage";

import CategoriaPage from "../features/categorias/pages/CategoriaPage";

import ProductoPage from "../features/productos/pages/ProductoPage";

import HomePage from "./HomePage";

import LoginPage from "../features/users/pages/LoginPage";

import AdminLayout from "../shared/AdminLayout";

import ProtectedRoute from "../router/ProtectedRoutes";

const AppRouter = () => {
  return (
    <Routes>
      {/* PUBLICAS */}

      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      {/* PRIVADAS */}

      <Route element={<ProtectedRoute />}>
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
    </Routes>
  );
};

export default AppRouter;