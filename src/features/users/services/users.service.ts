import type {
  UserPublic,
  UserRole,
  IUserCreate,
  IUserUpdate,
  IUserPaginado,
} from "../types/users.types";

import { apiClient } from "../../../api/axiosInstance";

type IUserRoleAction = {
  rol: UserRole;
};

/* =========================
   GET ALL (admin — paginated)
   GET /admin/usuarios?offset&limit&rol
========================= */
export const getUsers = async (
  offset = 0,
  limit = 20,
  rol?: UserRole
): Promise<IUserPaginado> => {
  try {
    const response = await apiClient.get<IUserPaginado>(
      "/admin/usuarios",
      {
        params: {
          offset,
          limit,
          ...(rol && { rol }),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error trayendo usuarios:", error);
    throw error;
  }
};

/* =========================
   GET BY ID
   GET /usuarios/{id}
========================= */
export const getUserById = async (
  id: number
): Promise<UserPublic> => {
  try {
    const response = await apiClient.get<UserPublic>(
      `/usuarios/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error trayendo usuario:", error);
    throw error;
  }
};

/* =========================
   CREATE (via register)
   POST /auth/register
========================= */
export const createUser = async (
  data: IUserCreate
): Promise<UserPublic> => {
  try {
    const response = await apiClient.post<UserPublic>(
      "/auth/register",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creando usuario:", error);
    throw error;
  }
};

/* =========================
   UPDATE
   PATCH /usuarios/{id}
========================= */
export const updateUser = async (
  id: number,
  data: IUserUpdate
): Promise<UserPublic> => {
  try {
    const response = await apiClient.patch<UserPublic>(
      `/usuarios/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    throw error;
  }
};


export const deleteUser = async (
  id: number
): Promise<void> => {
  try {
    await apiClient.delete(`/usuarios/${id}`);
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    throw error;
  }
};


export const assignRole = async (
  id: number,
  data: IUserRoleAction
): Promise<UserPublic> => {
  try {
    const response = await apiClient.patch<UserPublic>(
      `/admin/usuarios/${id}/roles/asignar`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error asignando rol:", error);
    throw error;
  }
};


export const removeRole = async (
  id: number,
  data: IUserRoleAction
): Promise<void> => {
  try {
    await apiClient.patch(
      `/admin/usuarios/${id}/roles/remover`,
      data
    );
  } catch (error) {
    console.error("Error removiendo rol:", error);
    throw error;
  }
};
