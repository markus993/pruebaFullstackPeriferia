export interface PostAuthor {
  id: string;
  alias: string;
  name: string;
}

export interface PostResponse {
  id: string;
  message: string;
  publishedAt: Date;
  author: PostAuthor;
  likes: number;
  likedByMe: boolean;
}
