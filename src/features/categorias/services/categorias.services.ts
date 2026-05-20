import type {ICategoria, ICategoriaResponse} from "../types/categorias.types";
import { API_BASE_URL } from "../../../api/config";

const endpoint = `${API_BASE_URL}/categorias`;

export const getCategorias = async (): Promise<ICategoria[]> => {
    try {
        const response = await fetch(endpoint);
        const data: ICategoriaResponse = await response.json();
        return data.data;
    } catch (error) {
        console.log("Error trayendo categorias:", error);
        throw error;
    }
}

export const createCategoria = async (categoria: Omit<ICategoria, "id">): Promise<ICategoria> => {
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(categoria)
        });

        if (!response.ok) {
            throw new Error("Error creando categoria");
        }

        const data: ICategoria = await response.json();
        return data;
    } catch (error) {
        console.log("Error creando categoria:", error);
        throw error;
    }
}

export const deleteCategoria = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${endpoint}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Error eliminando categoria");
        }
    } catch (error) {
        console.log("Error eliminando categoria:", error);
        throw error;
    }
}

export const updateCategoria = async (id: number, categoria: Omit<ICategoria, "id">): Promise<ICategoria> => {
    try {
        const response = await fetch(`${endpoint}/${id}`, { 
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(categoria)
        });

        if (!response.ok) {
            throw new Error("Error actualizando categoria");
        }

        const data: ICategoria = await response.json();
        return data;
    } catch (error) {
        console.log("Error actualizando categoria:", error);
        throw error;
    }
}
