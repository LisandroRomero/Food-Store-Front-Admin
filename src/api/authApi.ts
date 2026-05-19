import { apiClient } from "./axiosInstance";
import type { UserPublic } from "../features/users/types/users.types";

export async function requestLogin(email:string, contraseña:string) {
    const body = new URLSearchParams({
        email,
        contraseña
    });
    await apiClient.post('/auth/login', body, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    
}


export async function requestRegister(payload: {nombre: string, mail: string, contraseña: string}) {
   const response = await apiClient.post('/auth/register', payload);
   return response.data;
}

export async function requestMe() {
    const response = await apiClient.get<UserPublic>('/auth/me');
    return response.data;
}

export async function requestLogout(): Promise<void> {
    await apiClient.post('/auth/logout');
}