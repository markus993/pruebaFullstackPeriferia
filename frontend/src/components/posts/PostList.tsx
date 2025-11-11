import { usePostsStore } from "../../store/postsStore";
import { PostCard } from "./PostCard";

export const PostList = () => {
  const posts = usePostsStore((state) => state.posts);
  const isLoading = usePostsStore((state) => state.isLoading);
  const error = usePostsStore((state) => state.error);

  if (isLoading) {
    return <div className="card">Cargando publicaciones...</div>;
  }

  if (error) {
    return <div className="card" style={{ color: "#fca5a5" }}>{error}</div>;
  }

  if (!posts.length) {
    return <div className="empty-state">Aún no hay publicaciones de otros usuarios. ¡Sé el primero en compartir!</div>;
  }

  return (
    <div className="posts-grid">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};
