import { useMemo } from "react";

import { useAuthStore } from "../store/authStore";

export const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);

  const fullName = useMemo(() => {
    if (!user) return "";
    return `${user.firstName} ${user.lastName}`.trim();
  }, [user]);

  if (!user) {
    return (
      <div className="empty-state">No pudimos encontrar información del usuario autenticado.</div>
    );
  }

  return (
    <section className="card">
      <h1 className="page-title" style={{ marginBottom: "1.5rem" }}>
        Perfil
      </h1>
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <ProfileField label="Nombre completo" value={fullName} />
        <ProfileField label="Alias" value={`@${user.alias}`} />
        <ProfileField label="Correo" value={user.email} />
        <ProfileField label="Usuario" value={user.username} />
        <ProfileField label="Fecha de nacimiento" value={new Date(user.birthDate).toLocaleDateString()} />
        <ProfileField label="Miembro desde" value={new Date(user.createdAt).toLocaleDateString()} />
      </div>
    </section>
  );
};

interface ProfileFieldProps {
  label: string;
  value: string;
}

const ProfileField = ({ label, value }: ProfileFieldProps) => (
  <div
    className="card card--compact"
    style={{
      background: "rgba(15, 23, 42, 0.55)",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem"
    }}
  >
    <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.1em" }}>
      {label}
    </span>
    <strong style={{ fontSize: "1.25rem", lineHeight: 1.4 }}>{value}</strong>
  </div>
);
