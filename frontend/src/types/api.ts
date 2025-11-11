export interface ApiUser {
  id: string;
  email: string;
  username: string;
  alias: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: ApiUser;
}

export interface PostAuthor {
  id: string;
  alias: string;
  name: string;
}

export interface ApiPost {
  id: string;
  message: string;
  author: PostAuthor;
  publishedAt: string;
  likes: number;
  likedByMe: boolean;
}

export interface CreatePostPayload {
  message: string;
}
