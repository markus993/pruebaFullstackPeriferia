import axios from "axios";

import type { ApiResponse } from "../utils/api";
import type { ApiUser, LoginPayload, LoginResponse } from "../types/api";

const baseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000";

const authClient = axios.create({
  baseURL: `${baseUrl.replace(/\/$/, "")}/api`
});

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await authClient.post<ApiResponse<LoginResponse>>("/auth/login", payload);
    return data.data;
  },

  async getProfile(token: string): Promise<ApiUser> {
    const { data } = await authClient.get<ApiResponse<ApiUser>>("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return data.data;
  }
};
