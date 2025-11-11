import { useState } from "react";
import type { FormEvent } from "react";

import { usePostsStore } from "../../store/postsStore";

export const CreatePostForm = () => {
  const createPost = usePostsStore((state) => state.createPost);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim()) {
      setError("Escribe un mensaje para publicar");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await createPost({ message: message.trim() });

    if (result) {
      setMessage("");
      setError(null);
    } else {
      setError("No pudimos crear la publicación. Intenta de nuevo.");
    }

    setIsSubmitting(false);
  };

  return (
    <section className="card">
      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", fontWeight: 600 }}>
        Comparte algo nuevo
      </h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form__field">
          <label className="form__label" htmlFor="post-message">
            Mensaje
          </label>
          <textarea
            id="post-message"
            className="form__textarea"
            rows={4}
            maxLength={280}
            placeholder="¿Qué está pasando hoy?"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              if (error) {
                setError(null);
              }
            }}
          />
          <span style={{ fontSize: "0.75rem", color: "#94a3b8", textAlign: "right" }}>
            {message.length}/280
          </span>
        </div>
        {error ? <span className="form__error">{error}</span> : null}
        <button className="btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Publicando..." : "Publicar"}
        </button>
      </form>
    </section>
  );
};
