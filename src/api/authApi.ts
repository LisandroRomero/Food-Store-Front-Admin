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
  expires_in: number;
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
    "/auth/register",
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
export async function requestMe(
  accessToken: string
): Promise<UserPublic> {
  const response = await apiClient.get<UserPublic>(
    `/auth/me`,
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
      "/auth/refresh"
    );
  return response.data;
}

export async function requestLogout(
  accessToken: string
): Promise<void> {
  await apiClient.post(
    "/auth/logout",
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