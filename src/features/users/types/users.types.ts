export type UserRole = 'admin' | 'user';

export interface UserPublic {
    id: number;
    nombre: string;
    mail: string;
    rol: UserRole;
    contraseña: string;
}


export interface useRegisterUser {
    nombre: string;
    mail: string;
    contraseña: string;
}

export interface useLoginUser {
    mail: string;
    contraseña: string;
}


