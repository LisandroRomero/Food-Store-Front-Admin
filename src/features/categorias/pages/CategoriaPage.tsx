import { useState } from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import Swal from "sweetalert2";

import { ClipLoader } from "react-spinners";

import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../services/categorias.services";

import type {
  ICategoria,
  CreateCategoria,
} from "../types/categorias.types";

import CategoriasCreateModal from "../components/modal/CategoriasCreateModal";

import CategoriasUpdateModal from "../components/modal/CategoriasCreateModal";

interface UpdateCategoriaMutationVariables {
  id: number;
  categoria: CreateCategoria;
}

interface ApiError {
  message?: string;
}

export default function CategoriaPage() {
  const queryClient = useQueryClient();

  // CREATE MODAL
  const [openCreate, setOpenCreate] =
    useState(false);

  // UPDATE MODAL
  const [openUpdate, setOpenUpdate] =
    useState(false);

  // Categoria activa
  const [
    categoriaActiva,
    setCategoriaActiva,
  ] = useState<ICategoria | null>(
    null
  );

  // GET
  const {
    data: categorias = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categorias"],

    queryFn: getCategorias,

    staleTime: 1000 * 60 * 5,
  });

  // CREATE
  const createMutation = useMutation({
    mutationFn: createCategoria,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categorias"],
      });

      setOpenCreate(false);

      Swal.fire({
        icon: "success",
        title: "Categoría creada",
      });
    },

    onError: (error: ApiError) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.message ||
          "Ocurrió un error",
      });
    },
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      categoria,
    }: UpdateCategoriaMutationVariables) =>
      updateCategoria(
        id,
        categoria
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categorias"],
      });

      setOpenUpdate(false);

      Swal.fire({
        icon: "success",
        title:
          "Categoría actualizada",
      });
    },

    onError: (error: ApiError) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.message ||
          "Ocurrió un error",
      });
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteCategoria,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categorias"],
      });

      Swal.fire({
        icon: "success",
        title: "Categoría eliminada",
      });
    },
  });

  // HANDLERS

  const handleOpenEdit = (
    categoria: ICategoria
  ) => {
    setCategoriaActiva(categoria);

    setOpenUpdate(true);
  };

  const handleDelete = (
    id: number
  ) => {
    Swal.fire({
      title:
        "¿Eliminar categoría?",

      text:
        "No podrás revertir esta acción",

      icon: "warning",

      showCancelButton: true,

      confirmButtonText:
        "Sí, eliminar",

      cancelButtonText:
        "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  // LOADING
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <ClipLoader />
      </div>
    );
  }

  // ERROR
  if (isError) {
    return (
      <p className="text-center mt-10">
        Error cargando categorías
      </p>
    );
  }

  return (
    <div className="p-8 text-slate-100">
      {/* Header */}
      <div
        className="
          flex
          items-center
          justify-between
          mb-8
        "
      >
        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Categorías
        </h1>

        <button
          onClick={() =>
            setOpenCreate(true)
          }
          className="
            bg-blue-500
            hover:bg-blue-600
            text-white
            px-4
            py-2
            rounded-lg
            transition
          "
        >
          Nueva categoría
        </button>
      </div>

      {/* Tabla */}
      <div
        className="
          overflow-x-auto
          bg-slate-900
          rounded-2xl
          shadow
          border
          border-slate-800
        "
      >
        <table className="w-full">
          <thead className="bg-slate-800 text-slate-200">
            <tr>
              <th className="p-4 text-left">
                #
              </th>

              <th className="p-4 text-left">
                Nombre
              </th>

              <th className="p-4 text-left">
                Descripción
              </th>

              <th className="p-4 text-left">
                Parent ID
              </th>

              <th className="p-4 text-left">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {categorias.map(
              (categoria, index) => (
                <tr
                  key={categoria.id}
                  className="border-t border-slate-800"
                >
                  <td className="p-4">
                    {index + 1}
                  </td>

                  <td className="p-4">
                    {categoria.nombre}
                  </td>

                  <td className="p-4">
                    {
                      categoria.descripcion
                    }
                  </td>

                  <td className="p-4">
                    {categoria.parent_id ??
                      "-"}
                  </td>

                  <td
                    className="
                      p-4
                      flex
                      gap-2
                    "
                  >
                    <button
                      onClick={() =>
                        handleOpenEdit(
                          categoria
                        )
                      }
                      className="
                        bg-yellow-500
                        hover:bg-yellow-600
                        text-white
                        px-3
                        py-1
                        rounded-lg
                        transition
                      "
                    >
                      Editar
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          categoria.id
                        )
                      }
                      className="
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        px-3
                        py-1
                        rounded-lg
                        transition
                      "
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      <CategoriasCreateModal
        isOpen={openCreate}
        onClose={() =>
          setOpenCreate(false)
        }
        onCreate={(data: CreateCategoria) =>
          createMutation.mutate(data)
        }
      />

      {/* UPDATE MODAL */}
      {categoriaActiva && (
        <CategoriasUpdateModal
          isOpen={openUpdate}
          categoria={
            categoriaActiva
          }
          onClose={() => {
            setOpenUpdate(false);

            setCategoriaActiva(
              null
            );
          }}
          onUpdate={(
            id: number,
            data: CreateCategoria
          ) =>
            updateMutation.mutate({
              id,
              categoria: data,
            })
          }
        />
      )}

      {/* Loading overlay */}
      {(createMutation.isPending ||
        updateMutation.isPending) && (
        <div
          className="
            fixed
            inset-0
            bg-black/20
            flex
            items-center
            justify-center
            z-50
          "
        >
          <ClipLoader />
        </div>
      )}
    </div>
  );
}
