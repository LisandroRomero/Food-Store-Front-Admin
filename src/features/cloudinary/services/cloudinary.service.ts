import type {Image} from "../types/cloudinary.types";
import { apiClient } from "../../../api/axiosInstance";




export const fetchImages = async(): Promise<Image[]> => {
    try{
        const response = await apiClient.get<Image[]>("/uploads/imagen");
        return response.data;
    }catch (error) {
        console.error("Error trayendo imagenes:", error);
        throw new Error("Error trayendo imagenes");
    }
}

export const uploadImage = async (file: File): Promise<Image> => {
    try{
        const formData = new FormData();
        formData.append("file", file);
        const response = await apiClient.post<Image>("/uploads/imagen", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error subiendo imagenes:", error);
        throw new Error("Error subiendo imagenes");
    }
   

}

export const deleteImage = async (public_id: string): Promise<void> => {
    try{
        await apiClient.delete(`/uploads/imagen/${public_id}`);
    } catch (error) {
        console.error("Error eliminando imagen:", error);
        throw new Error("Error eliminando imagen");
    }
}