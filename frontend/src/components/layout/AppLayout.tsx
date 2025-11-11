import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";
import { usePostsStore } from "../../store/postsStore";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const resetPosts = usePostsStore((state) => state.reset);

  const handleLogout = () => {
    logout();
    resetPosts();
    navigate("/login", { replace: true });
  };

  return (
    <div className="layout">
      <header className="layout__header">
        <span className="layout__brand">Periferia Social</span>
        <nav className="layout__nav">
          <Link to="/feed">Publicaciones</Link>
          <Link to="/profile">Perfil</Link>
        </nav>
        <div className="layout__user">
          {user ? <span className="layout__alias">@{user.alias}</span> : null}
          <button type="button" className="btn btn--ghost" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="layout__main">{children}</main>
    </div>
  );
};
