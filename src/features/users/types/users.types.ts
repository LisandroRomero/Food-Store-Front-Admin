export type UserRole =
  | "ADMIN"
  | "STOCK"
  | "PEDIDOS"
  | "CLIENT";

export interface Rol {
  codigo: UserRole;
  nombre: string;
  descripcion: string;
}

export interface UserPublic {
  id: number;
  nombre: string;
  apellido: string;
  celular: string;
  activo: boolean;
  email: string;
  roles: Rol[];
} 

export interface RegisterUserDto {
  nombre: string;
  apellido: string;
  celular: string;
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}



export interface IUserCreate {
  nombre: string;
  apellido: string;
  celular: string;
  email: string;
  password: string;
}

export interface IUserUpdate {
  nombre?: string;
  apellido?: string;
  celular?: string;
  email?: string;
  password?: string;
  roles?: UserRole[];
  activo?: boolean;
}

export interface IUserPaginado {
  total: number;
  data: UserPublic[];
}

export interface IUserRoleAction  {
  usuario_id: number;
  codigo_rol: UserRole;
  expires_at?: string | null;
};