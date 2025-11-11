import type { Location } from "react-router-dom";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/authStore";

export const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const login = useAuthStore((state) => state.login);
  const isAuthenticating = useAuthStore((state) => state.isAuthenticating);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const isAuthenticated = useAuthStore((state) => Boolean(state.token));

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/feed", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!identifier || !password) {
      return;
    }

    try {
      await login(identifier.trim(), password);
      const from = (location.state as { from?: Location } | null)?.from?.pathname ?? "/feed";
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login falló", err);
    }
  };

  return (
    <div className="layout login-layout">
      <main className="layout__main" style={{ maxWidth: "420px", width: "100%", paddingTop: "4rem" }}>
        <div className="card">
          <h1 className="page-title" style={{ marginBottom: "1.5rem" }}>
            Bienvenido a Periferia Social
          </h1>
          <p style={{ marginBottom: "1.5rem", color: "#cbd5f5" }}>
            Ingresa tus credenciales para continuar. Puedes usar el alias o correo registrado en el sistema.
          </p>

          <form className="form" onSubmit={handleSubmit}>
            <div className="form__field">
              <label className="form__label" htmlFor="identifier">
                Usuario o correo
              </label>
              <input
                id="identifier"
                name="identifier"
                className="form__input"
                placeholder="alias o correo"
                value={identifier}
                onChange={(event) => {
                  setIdentifier(event.target.value);
                  if (error) {
                    clearError();
                  }
                }}
                autoComplete="username"
                required
              />
            </div>

            <div className="form__field">
              <label className="form__label" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form__input"
                placeholder="••••••••"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (error) {
                    clearError();
                  }
                }}
                autoComplete="current-password"
                required
              />
            </div>

            {error ? <span className="form__error">{error}</span> : null}

            <button className="btn" type="submit" disabled={isAuthenticating}>
              {isAuthenticating ? "Validando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
