import {create} from 'zustand';
import type { UserPublic, UserRole } from '../features/users/types/users.types';
import * as authApi from '../api/authApi';



interface AuthState {
    user: UserPublic | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    hasRole: (...roles: UserRole[]) => boolean;
    login: (email: string, contraseña: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    clearSesion: () => void;
    setError: (msg: string | null) => void;
}


const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    setError: (msg) => set({error: msg}),

    hasRole: (...roles) => {
        const { user } = get();
        return user ? roles.includes(user.rol) : false;
    },
    clearSesion: () => set({user: null, isAuthenticated: false, error: null}),

    checkAuth: async () => {
        set({isLoading: true, error: null});
        try {
            const user = await authApi.requestMe();
            set({user, isAuthenticated: true, isLoading: false});
        } catch (error) {
            set({error: 'Error al verificar autenticación', isLoading: false});
        }
    },

    login: async (email, contraseña) => {
        set({isLoading: true, error: null});
        try {
            await authApi.requestLogin(email, contraseña);
            const user = await authApi.requestMe();
            set({user, isAuthenticated: true, isLoading: false});
        } catch (error) {
            set({error: 'Error al iniciar sesión', isLoading: false});
        }
    },
    logout: async()=>{
        try{
            await authApi.requestLogout();
        }catch(error){
            console.error('Error al cerrar sesión', error);
        }
        set({user: null, isAuthenticated: false, error: null});
    }
    }))


export { useAuthStore };