import { create } from "zustand";

import { postsService } from "../services/postsService";
import type { ApiPost, CreatePostPayload } from "../types/api";
import { getErrorMessage } from "../utils/api";
import { useAuthStore } from "./authStore";

interface PostsState {
  posts: ApiPost[];
  isLoading: boolean;
  error: string | null;
  fetchFeed: () => Promise<void>;
  createPost: (payload: CreatePostPayload) => Promise<ApiPost | null>;
  toggleLike: (postId: string, liked: boolean) => Promise<ApiPost | null>;
  reset: () => void;
}

export const usePostsStore = create<PostsState>((set) => ({
  posts: [],
  isLoading: false,
  error: null,
  async fetchFeed() {
    const token = useAuthStore.getState().token;

    if (!token) {
      set({ posts: [], error: null, isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const posts = await postsService.getFeed(token);
      set({ posts, isLoading: false });
    } catch (error) {
      set({
        error: getErrorMessage(error, "No pudimos obtener las publicaciones."),
        isLoading: false
      });
    }
  },
  async createPost(payload) {
    const token = useAuthStore.getState().token;
    if (!token) {
      return null;
    }

    try {
      const newPost = await postsService.createPost(token, payload);
      set((state) => ({ posts: [newPost, ...state.posts] }));
      return newPost;
    } catch (error) {
      set({ error: getErrorMessage(error, "No pudimos crear la publicación.") });
      return null;
    }
  },
  async toggleLike(postId, liked) {
    const token = useAuthStore.getState().token;
    if (!token) {
      return null;
    }

    try {
      const updated = liked
        ? await postsService.unlikePost(token, postId)
        : await postsService.likePost(token, postId);
      set((state) => ({
        posts: state.posts.map((post) => (post.id === updated.id ? updated : post))
      }));
      return updated;
    } catch (error) {
      set({
        error: getErrorMessage(error, liked ? "No pudimos quitar el like." : "No pudimos registrar el like.")
      });
      return null;
    }
  },
  reset() {
    set({ posts: [], error: null, isLoading: false });
  }
}));
