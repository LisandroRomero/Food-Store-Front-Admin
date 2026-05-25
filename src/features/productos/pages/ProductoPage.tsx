import { useState } from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";

import {
  useCatalogosStore,
} from "../store/catalogos.store";

import Swal from "sweetalert2";

import { ClipLoader } from "react-spinners";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productos.service";

import type {
  Producto,
  CreateProductoDTO,
  UpdateProductoDTO,
} from "../types/productos.type";

import ProductoTable from "../components/ProductoTable";

import ProductoCreateModal from "../components/modals/ProductosCreateModal";

import ProductoUpdateModal from "../components/modals/ProductosUpdateModal";

import ProductoDetalleModal from "../components/modals/ProductosDetalleModal";

export default function ProductoPage() {
  const queryClient =
    useQueryClient();

    const categorias =
  useCatalogosStore(
    (state) => state.categorias
  );

const ingredientes =
  useCatalogosStore(
    (state) => state.ingredientes
  );

  const loadCatalogos =
  useCatalogosStore(
    (state) =>
      state.loadCatalogos
  );

useEffect(() => {
  loadCatalogos();
}, []);

  const [
    openCreate,
    setOpenCreate,
  ] = useState(false);

  const [
    openUpdate,
    setOpenUpdate,
  ] = useState(false);

  const [
    openDetalle,
    setOpenDetalle,
  ] = useState(false);

  // ======================
  // ESTADOS
  // ======================

  const [
    productoActivo,
    setProductoActivo,
  ] = useState<Producto | null>(
    null
  );

  const [
    productoDetalleId,
    setProductoDetalleId,
  ] = useState<number | null>(
    null
  );

  // ======================
  // QUERY
  // ======================

  const {
    data: productos = [],
    isLoading,
    isError,
  } = useQuery<Producto[]>({
    queryKey: ["productos"],

    queryFn:() => getProducts(),

    staleTime:
      1000 * 60 * 5,
  });

  // ======================
  // CREATE
  // ======================

  const createMutation =
    useMutation({
      mutationFn:
        createProduct,

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "productos",
            ],
          }
        );

        setOpenCreate(false);

        Swal.fire({
          icon: "success",
          title:
            "Producto creado",
        });
      },

      onError: (
        error: Error
      ) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.message,
        });
      },
    });

  // ======================
  // UPDATE
  // ======================

  const updateMutation =
    useMutation({
      mutationFn: ({
        id,
        producto,
      }: {
        id: number;

        producto: UpdateProductoDTO;
      }) =>
        updateProduct(
          id,
          producto
        ),

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "productos",
            ],
          }
        );

        setOpenUpdate(false);

        setProductoActivo(
          null
        );

        Swal.fire({
          icon: "success",
          title:
            "Producto actualizado",
        });
      },

      onError: (
        error: Error
      ) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.message,
        });
      },
    });

  // ======================
  // DELETE
  // ======================

  const deleteMutation =
    useMutation({
      mutationFn:
        deleteProduct,

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "productos",
            ],
          }
        );

        Swal.fire({
          icon: "success",
          title:
            "Producto eliminado",
        });
      },

      onError: (
        error: Error
      ) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.message,
        });
      },
    });

  // ======================
  // HANDLERS
  // ======================

  const handleOpenEdit = (
    producto: Producto
  ) => {
    setProductoActivo(
      producto
    );

    setOpenUpdate(true);
  };

  const handleOpenDetalle = (
    id: number
  ) => {
    setProductoDetalleId(
      id
    );

    setOpenDetalle(true);
  };

  const handleDelete = async (
    id: number
  ) => {
    const result =
      await Swal.fire({
        title:
          "¿Eliminar producto?",

        text:
          "No podrás revertir esto",

        icon: "warning",

        showCancelButton: true,

        confirmButtonText:
          "Eliminar",

        cancelButtonText:
          "Cancelar",
      });

    if (
      result.isConfirmed
    ) {
      deleteMutation.mutate(
        id
      );
    }
  };

  // ======================
  // LOADING
  // ======================

  if (isLoading) {
    return (
      <div
        className="
          flex
          justify-center
          items-center
          h-[300px]
        "
      >
        <ClipLoader />
      </div>
    );
  }

  // ======================
  // ERROR
  // ======================

  if (isError) {
    return (
      <div
        className="
          text-center
          text-red-500
          mt-10
        "
      >
        Error cargando
        productos
      </div>
    );
  }

  // ======================
  // RENDER
  // ======================

  return (
    <div
      className="
        p-8
        text-slate-100
      "
    >
      {/* HEADER */}
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
          Productos
        </h1>

        <button
          onClick={() =>
            setOpenCreate(
              true
            )
          }
          className="
            bg-blue-500
            hover:bg-blue-600
            text-white
            px-4
            py-2
            rounded-lg
          "
        >
          Nuevo producto
        </button>
      </div>

      {/* TABLA */}
      <ProductoTable
        productos={productos}
        onView={
          handleOpenDetalle
        }
        onEdit={
          handleOpenEdit
        }
        onDelete={
          handleDelete
        }
      />

      {/* MODAL DETALLE */}
      <ProductoDetalleModal
        isOpen={
          openDetalle
        }
        productoId={
          productoDetalleId
        }
        onClose={() => {
          setOpenDetalle(
            false
          );

          setProductoDetalleId(
            null
          );
        }}
      />

      {/* MODAL CREATE */}
      <ProductoCreateModal
        isOpen={
          openCreate
        }
        onClose={() =>
          setOpenCreate(
            false
          )
        }
        onSubmit={(
          data
        ) =>
          createMutation.mutate(
            data as CreateProductoDTO
          )
        }
      />

      {/* MODAL UPDATE */}
      {productoActivo && (
        <ProductoUpdateModal
  isOpen={openUpdate}
  producto={productoActivo}
  categorias={categorias}
  ingredientes={ingredientes}
  onClose={() => {
    setOpenUpdate(false);

    setProductoActivo(
      null
    );
  }}
  onUpdate={(
    id,
    data
  ) =>
    updateMutation.mutate({
      id,
      producto: data,
    })
  }
/>
      )}

      {/* OVERLAY */}
      {(createMutation.isPending ||
        updateMutation.isPending ||
        deleteMutation.isPending) && (
        <div
          className="
            fixed
            inset-0
            bg-black/30
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