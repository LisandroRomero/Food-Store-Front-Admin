import { jwtDecode } from "jwt-decode";

import { API_BASE_URL } from "../../../api/config";

import type {
  LoginUserDto,
  RegisterUserDto,
  UserPublic,
} from "../types/users.types";

const endpoint = `${API_BASE_URL}/usuarios`;

export interface TokenResponse {
  access_token: string;

  token_type: string;

  expires_in: string;
}

interface JwtPayload {
  sub: string;
}

export const requestRegister = async (
  userData: RegisterUserDto
): Promise<UserPublic> => {
  try {
    const response = await fetch(`${endpoint}/register`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Error registrando usuario");
    }

    const data: UserPublic = await response.json();

    return data;
  } catch (error) {
    console.log("Error registrando usuario:", error);

    throw error;
  }
};

export const requestLogin = async (
  userData: LoginUserDto
): Promise<TokenResponse> => {
  try {
    const response = await fetch(`${endpoint}/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Credenciales inválidas");
    }

    const data: TokenResponse = await response.json();

    return data;
  } catch (error) {
    console.log("Error iniciando sesión:", error);

    throw error;
  }
};

export const requestRefresh = async (): Promise<TokenResponse> => {
  try {
    const response = await fetch(`${endpoint}/refresh`, {
      method: "PATCH",

      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error refrescando token");
    }

    const data: TokenResponse = await response.json();

    return data;
  } catch (error) {
    console.log("Error refrescando token:", error);

    throw error;
  }
};

export const requestLogout = async (
  accessToken: string
): Promise<void> => {
  try {
    const response = await fetch(`${endpoint}/logout`, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${accessToken}`,
      },

      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error cerrando sesión");
    }
  } catch (error) {
    console.log("Error cerrando sesión:", error);

    throw error;
  }
};

export const requestUserById = async (
  userId: number,
  accessToken: string
): Promise<UserPublic> => {
  try {
    const response = await fetch(`${endpoint}/${userId}`, {
      method: "GET",

      headers: {
        Authorization: `Bearer ${accessToken}`,
      },

      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error obteniendo usuario");
    }

    const data: UserPublic = await response.json();

    return data;
  } catch (error) {
    console.log("Error obteniendo usuario:", error);

    throw error;
  }
};

export const getUserIdFromToken = (
  accessToken: string
): number => {
  const decoded = jwtDecode<JwtPayload>(accessToken);

  return Number(decoded.sub);
};