import { useEffect } from "react";

import { CreatePostForm } from "../components/posts/CreatePostForm";
import { PostList } from "../components/posts/PostList";
import { useAuthStore } from "../store/authStore";
import { usePostsStore } from "../store/postsStore";

export const FeedPage = () => {
  const fetchFeed = usePostsStore((state) => state.fetchFeed);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      fetchFeed();
    }
  }, [fetchFeed, token]);

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <CreatePostForm />
      <PostList />
    </section>
  );
};
