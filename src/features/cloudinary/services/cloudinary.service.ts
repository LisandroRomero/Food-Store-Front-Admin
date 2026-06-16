import type {ImagenPublic} from "../types/cloudinary.types";
import { apiClient } from "../../../api/axiosInstance";

const endpoint = "/uploads";

export const fetchImages = async(): Promise<ImagenPublic[]> => {
    try{
        const response = await apiClient.get<ImagenPublic[]>(`${endpoint}/`);
        return response.data;
    }catch (error) {
        console.error("Error trayendo imagenes:", error);
        throw new Error("Error trayendo imagenes");
    }
}

export const getImageById = async (id: number): Promise<ImagenPublic> => {
    try{
        const response = await apiClient.get<ImagenPublic>(`${endpoint}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error trayendo imagen:", error);
        throw new Error("Error trayendo imagen");
    }
}

export const uploadImage = async (file: File): Promise<string> => {
    try{
        const formData = new FormData();
        formData.append("files", file);
        const response = await apiClient.post<ImagenPublic[]>(`${endpoint}/imagen`, formData);
        return response.data[0].url;
    } catch (error) {
        console.error("Error subiendo imagenes:", error);
        throw new Error("Error subiendo imagenes");
    }
}

export const deleteImage = async (id: number): Promise<void> => {
    try{
        await apiClient.delete(`${endpoint}/imagen/${id}`);
    } catch (error) {
        console.error("Error eliminando imagen:", error);
        throw new Error("Error eliminando imagen");
    }
}
