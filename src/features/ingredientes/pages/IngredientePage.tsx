import { useState } from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import Swal from "sweetalert2";

import { ClipLoader } from "react-spinners";

import {
  createIngrediente,
  deleteIngrediente,
  getIngredientes,
  updateIngrediente,
} from "../services/ingredientes.service";

import type {
  IIngrediente,
  CreateIngrediente,
} from "../types/ingredientes.type";

import IngredienteCreateModal from "../components/modals/IngredienteCreateModal";

import IngredienteUpdateModal from "../components/modals/IngredienteUpdateModal";

const IngredientePage = () => {
  const queryClient = useQueryClient();

  // CREATE MODAL
  const [openCreate, setOpenCreate] =
    useState(false);

  // UPDATE MODAL
  const [openUpdate, setOpenUpdate] =
    useState(false);

  // Ingrediente seleccionado
  const [
    ingredienteActivo,
    setIngredienteActivo,
  ] = useState<IIngrediente | null>(
    null
  );

  // GET
  const {
    data: ingredientes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ingredientes"],

    queryFn: getIngredientes,

    staleTime: 1000 * 60 * 5,
  });

  // CREATE
  const createMutation = useMutation({
    mutationFn: createIngrediente,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ingredientes"],
      });

      setOpenCreate(false);

      Swal.fire({
        icon: "success",
        title: "Ingrediente creado",
      });
    },

    onError: (error) => {
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
      ingrediente,
    }: {
      id: number;
      ingrediente: CreateIngrediente;
    }) =>
      updateIngrediente(
        id,
        ingrediente
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ingredientes"],
      });

      setOpenUpdate(false);

      Swal.fire({
        icon: "success",
        title:
          "Ingrediente actualizado",
      });
    },

    onError: (error) => {
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
    mutationFn: deleteIngrediente,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ingredientes"],
      });

      Swal.fire({
        icon: "success",
        title: "Ingrediente eliminado",
      });
    },
  });

  // HANDLERS

  const handleOpenEdit = (
    ingrediente: IIngrediente
  ) => {
    setIngredienteActivo(
      ingrediente
    );

    setOpenUpdate(true);
  };

  const handleDelete = (
    id: number
  ) => {
    Swal.fire({
      title:
        "¿Eliminar ingrediente?",

      icon: "warning",

      showCancelButton: true,
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
        Error cargando ingredientes
      </p>
    );
  }

  return (
    <div className="p-8 text-slate-100">
      {/* Header */}
      <div
        className="
          flex
          justify-between
          items-center
          mb-8
        "
      >
        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Ingredientes
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
          Nuevo ingrediente
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
                Alérgeno
              </th>

              <th className="p-4 text-left">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {ingredientes.map(
              (ingrediente, index) => (
                <tr
                  key={
                    ingrediente.id
                  }
                  className="border-t border-slate-800"
                >
                  <td className="p-4">
                    {index + 1}
                  </td>

                  <td className="p-4">
                    {
                      ingrediente.nombre
                    }
                  </td>

                  <td className="p-4">
                    {
                      ingrediente.descripcion
                    }
                  </td>

                  <td className="p-4">
                    {ingrediente.es_alergeno
                      ? "Sí"
                      : "No"}
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
                          ingrediente
                        )
                      }
                      className="
                        bg-yellow-500
                        hover:bg-yellow-600
                        text-white
                        px-3
                        py-1
                        rounded-lg
                      "
                    >
                      Editar
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          ingrediente.id
                        )
                      }
                      className="
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        px-3
                        py-1
                        rounded-lg
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
      <IngredienteCreateModal
        isOpen={openCreate}
        onClose={() =>
          setOpenCreate(false)
        }
        onCreate={(data) =>
          createMutation.mutate(data)
        }
      />

      {/* UPDATE MODAL */}
      {ingredienteActivo && (
        <IngredienteUpdateModal
          isOpen={openUpdate}
          ingrediente={
            ingredienteActivo
          }
          onClose={() => {
            setOpenUpdate(false);

            setIngredienteActivo(
              null
            );
          }}
          onUpdate={(id, data) =>
            updateMutation.mutate({
              id,
              ingrediente: data,
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


export default IngredientePage;
