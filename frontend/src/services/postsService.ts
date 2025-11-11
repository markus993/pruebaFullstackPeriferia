import axios from "axios";

import type { ApiResponse } from "../utils/api";
import type { ApiPost, CreatePostPayload } from "../types/api";

const baseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000";

const postsClient = axios.create({
  baseURL: `${baseUrl.replace(/\/$/, "")}/api`
});

const authHeader = (token: string) => ({
  Authorization: `Bearer ${token}`
});

export const postsService = {
  async getFeed(token: string): Promise<ApiPost[]> {
    const { data } = await postsClient.get<ApiResponse<ApiPost[]>>("/posts", {
      headers: authHeader(token)
    });
    return data.data;
  },

  async createPost(token: string, payload: CreatePostPayload): Promise<ApiPost> {
    const { data } = await postsClient.post<ApiResponse<ApiPost>>("/posts", payload, {
      headers: authHeader(token)
    });
    return data.data;
  },

  async likePost(token: string, postId: string): Promise<ApiPost> {
    const { data } = await postsClient.post<ApiResponse<ApiPost>>(`/posts/${postId}/like`, null, {
      headers: authHeader(token)
    });
    return data.data;
  },

  async unlikePost(token: string, postId: string): Promise<ApiPost> {
    const { data } = await postsClient.post<ApiResponse<ApiPost>>(`/posts/${postId}/unlike`, null, {
      headers: authHeader(token)
    });
    return data.data;
  }
};
