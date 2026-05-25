import { jwtDecode } from "jwt-decode";
import { apiClient } from "./axiosInstance";
import type {
  LoginUserDto,
  RegisterUserDto,
  UserPublic,
} from "../features/users/types/users.types";

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: string;
}

interface JwtPayload {
  sub: string;
}

export async function requestLogin(
  payload: LoginUserDto
): Promise<TokenResponse> {
  const response = await apiClient.post<TokenResponse>(
    "/auth/login",
    payload
  );
  return response.data;
}

export async function requestRegister(
  payload: RegisterUserDto
): Promise<UserPublic> {
  const response = await apiClient.post<UserPublic>(
    "/usuarios/register",
    payload
  );
  return response.data;
}

export async function requestUserById(
  userId: number,
  accessToken: string
): Promise<UserPublic> {
  const response = await apiClient.get<UserPublic>(
    `/usuarios/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
}

export async function requestRefresh(): Promise<TokenResponse> {
  const response =
    await apiClient.patch<TokenResponse>(
      "/usuarios/refresh"
    );
  return response.data;
}

export async function requestLogout(
  accessToken: string
): Promise<void> {
  await apiClient.post(
    "/usuarios/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getUserIdFromToken(
  accessToken: string
): number {
  const decoded =
    jwtDecode<JwtPayload>(accessToken);
  return Number(decoded.sub);
}