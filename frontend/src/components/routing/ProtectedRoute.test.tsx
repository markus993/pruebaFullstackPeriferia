import { screen, render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { useAuthStore } from "../../store/authStore";

const initialState = useAuthStore.getState();

const resetAuthStore = () => {
  useAuthStore.setState(initialState, true);
  localStorage.clear();
};

describe("ProtectedRoute", () => {
  beforeEach(() => {
    resetAuthStore();
  });

  it("muestra una pantalla de carga mientras bootstrap está activo", () => {
    useAuthStore.setState({ isBootstrapping: true });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Contenido privado</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText("Cargando aplicación...")).toBeInTheDocument();
    expect(screen.queryByText("Contenido privado")).not.toBeInTheDocument();
  });

  it("renderiza el contenido cuando el usuario está autenticado", () => {
    useAuthStore.setState({
      token: "token-valido",
      isBootstrapping: false
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Panel Privado</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Panel Privado")).toBeInTheDocument();
  });

  it("redirecciona a /login cuando el usuario no está autenticado", () => {
    useAuthStore.setState({
      token: null,
      isBootstrapping: false
    });

    render(
      <MemoryRouter initialEntries={["/privado"]}>
        <Routes>
          <Route path="/login" element={<div>Pantalla Login</div>} />
          <Route
            path="/privado"
            element={
              <ProtectedRoute>
                <div>Privado</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Pantalla Login")).toBeInTheDocument();
    expect(screen.queryByText("Privado")).not.toBeInTheDocument();
  });
});

