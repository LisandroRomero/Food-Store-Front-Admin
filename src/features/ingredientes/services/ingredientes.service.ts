import type {
    IIngrediente,
    IIngredientesResponse
} from "../types/ingredientes.type";

import { API_BASE_URL } from "../../../api/config";

const endpoint = `${API_BASE_URL}/ingredientes`;

export const getIngredientes = async (): Promise<IIngrediente[]> => {
    try {

    const response = await fetch(endpoint);
    const data: IIngredientesResponse = await response.json();
    return data.data;
    } catch (error) {
        console.log("Error trayendo ingredientes:", error);
        throw error;
    }
}


export const createIngrediente = async (ingrediente: Omit<IIngrediente, "id">): Promise<IIngrediente> => {
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ingrediente)
        });

        if (!response.ok) {
            throw new Error("Error creando ingrediente");
        }

        const data: IIngrediente = await response.json();
        return data;
    } catch (error) {
        console.log("Error creando ingrediente:", error);
        throw error;
    }
}


export const deleteIngrediente = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${endpoint}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Error eliminando ingrediente");
        }
    } catch (error) {
        console.log("Error eliminando ingrediente:", error);
        throw error;
    }
}

export const updateIngrediente = async (id: number, ingrediente: Omit<IIngrediente, "id">): Promise<IIngrediente> => {
    try {
        const response = await fetch(`${endpoint}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ingrediente)
        });

        if (!response.ok) {
            throw new Error("Error actualizando ingrediente");
        }

        const data: IIngrediente = await response.json();
        return data;
    } catch (error) {
        console.log("Error actualizando ingrediente:", error);
        throw error;
    }
}
