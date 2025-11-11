import { useMemo, useState } from "react";

import { usePostsStore } from "../../store/postsStore";
import type { ApiPost } from "../../types/api";

interface PostCardProps {
  post: ApiPost;
}

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "medium",
  timeStyle: "short"
});

export const PostCard = ({ post }: PostCardProps) => {
  const toggleLike = usePostsStore((state) => state.toggleLike);
  const [isLiking, setIsLiking] = useState(false);

  const formattedDate = useMemo(() => dateFormatter.format(new Date(post.publishedAt)), [post.publishedAt]);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    await toggleLike(post.id, post.likedByMe);
    setIsLiking(false);
  };

  return (
    <article className="card post-card">
      <header className="post-card__header">
        <div className="post-card__meta">
          <strong>{post.author.name}</strong>
          <span style={{ color: "#93c5fd", fontSize: "0.9rem" }}>@{post.author.alias}</span>
        </div>
        <time style={{ fontSize: "0.8rem", color: "#a5b4fc" }}>{formattedDate}</time>
      </header>
      <p className="post-card__message">{post.message}</p>
      <footer className="post-card__footer">
        <button
          type="button"
          className={`like-button ${post.likedByMe ? "like-button--active" : ""}`.trim()}
          onClick={handleLike}
          disabled={isLiking}
          aria-pressed={post.likedByMe}
        >
          {post.likedByMe ? "💔 Quitar" : "❤️ Me gusta"}
        </button>
        <span style={{ color: "#cbd5f5", fontWeight: 600 }}>{post.likes} likes</span>
      </footer>
    </article>
  );
};
