import type { IProducto, IProductoResponse, CreateProducto } from "../types/productos.type";

import { API_BASE_URL } from "../../../api/config";

const endpoint = `${API_BASE_URL}/productos`;

export const getProducts = async(): Promise<IProducto[]> => {
    try {
        const response = await fetch(endpoint);
        const data: IProductoResponse = await response.json();
        return data.data;
    } catch (error) {
        console.log("Error trayendo productos:", error);
        throw error;
    }
}

export const getProductById = async (id: number): Promise<IProducto> => {
    try {
        const response = await fetch(`${endpoint}/${id}`);
        const data: IProducto = await response.json();
        return data;
    } catch (error) {
        console.log("Error trayendo producto:", error);
        throw error;
    }
};


export const createProduct = async (productData: CreateProducto): Promise<IProducto> => {
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            throw new Error("Error creando producto");
        }

        const data: IProducto = await response.json();
        return data;
    } catch (error) {
        console.log("Error creando producto:", error);
        throw error;
    }
}

export const deleteProduct = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${endpoint}/${id}`, {
            method: "DELETE"
        });
        if(!response.ok){
            throw new Error("Error eliminando producto");
        }
    } catch (error) {
        console.log("Error eliminando producto:", error);
        throw error;
    }
}



export const updateProduct = async (id: number, productData: CreateProducto): Promise<IProducto> => {
    try {
        const response = await fetch(`${endpoint}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            throw new Error("Error actualizando producto");
        }

        const data: IProducto = await response.json();
        return data;
    } catch (error) {
        console.log("Error actualizando producto:", error);
        throw error;
    }
}
