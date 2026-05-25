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