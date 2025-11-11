# Periferia Social

Aplicación de red social interna donde los colaboradores pueden iniciar sesión, revisar su perfil, publicar mensajes y reaccionar con "likes". La solución está compuesta por un backend unificado en Nest.js + Prisma y un frontend en React + Vite.

## Arquitectura

- `backend`: API REST en Nest.js (TypeScript) con Prisma ORM y JWT para autenticación.
- `frontend`: SPA en React + TypeScript con Zustand para manejo de estado global.
- `postgres`: Base de datos PostgreSQL gestionada mediante migraciones Prisma.

## Requisitos

- Node.js >= 20
- npm >= 10
- Docker Desktop >= 24 (Compose v2)
- PowerShell / Bash (según sistema operativo)

## Variables de entorno

Las variables compartidas residen en `.env` (existe `.env.example` como referencia en la raíz):

| Variable | Descripción |
| --- | --- |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT` | Configuración de PostgreSQL |
| `POSTGRES_DB` | Nombre de la base de datos principal (`periferia_social`) |
| `DATABASE_URL` | Cadena de conexión usada por Prisma |
| `API_PORT` | Puerto expuesto del backend Nest (3000 por defecto) |
| `FRONTEND_PORT` | Puerto expuesto del frontend Vite (5173 por defecto) |
| `JWT_SECRET` | Clave simétrica para firmar tokens JWT |

Para desarrollo del frontend fuera de Docker puedes exportar `VITE_API_URL` (por ejemplo `http://localhost:3000`).

## Despliegue con Docker Compose

1. Personaliza las variables (opcional):
   ```powershell
   Copy-Item .env .env.local
   # Ajusta valores en .env según tu entorno
   ```
2. Construye y levanta toda la solución:
   ```powershell
   docker compose up --build
   ```
3. Endpoints principales:
   - Frontend: `http://localhost:${FRONTEND_PORT}` (por defecto `http://localhost:5173`)
   - API: `http://localhost:${API_PORT}/api` (por defecto `http://localhost:3000/api`)
   - Health check: `GET /api/health`
   - Login: `POST /api/auth/login`
   - Perfil: `GET /api/users/me`
   - Publicaciones: `GET /api/posts`

El contenedor del backend ejecuta `prisma migrate deploy` y `prisma db seed` de forma idempotente en cada arranque.

## Ejecución manual (sin Docker)

1. Instala dependencias:
   ```powershell
   npm install --prefix backend
   npm install --prefix frontend
   ```
2. Levanta PostgreSQL (puedes reutilizar `docker compose up postgres`).
3. Exporta/ajusta `DATABASE_URL` y ejecuta Prisma:
   ```powershell
   cd backend
   npm run prisma:generate
   npm run prisma:migrate:deploy
   npm run prisma:seed
   ```
4. Arranca los servidores en modo desarrollo:
   ```powershell
   # Backend (desde apps/api)
   npm run start:dev

   # Frontend (desde frontend)
   npm run dev -- --host
   ```
5. Accede al frontend en `http://localhost:5173` (o el puerto que definas) y al backend en `http://localhost:3000/api`.

## Usuarios de prueba

| Alias | Usuario / Email | Contraseña |
| --- | --- | --- |
| `@anar` | aromero / ana.romero@periferia.it | `Periferia123!` |
| `@carlitos` | cmendez / carlos.mendez@periferia.it | `Periferia123!` |
| `@lauca` | lcastillo / laura.castillo@periferia.it | `Periferia123!` |

## Endpoints relevantes

- `POST /api/auth/login` – Devuelve `{ token, user }` tras validar credenciales.
- `GET /api/users/me` – Retorna el perfil del usuario autenticado.
- `GET /api/posts` – Feed de publicaciones de otros usuarios (likes agregados).
- `POST /api/posts` – Crea una publicación propia.
- `POST /api/posts/:id/like` – Envia un like idempotente a la publicación indicada.

Las rutas protegidas requieren encabezado `Authorization: Bearer <token>`.

## Scripts útiles (apps/api)

- `npm run prisma:generate` – Generar cliente Prisma a partir del esquema.
- `npm run prisma:migrate:dev` / `npm run prisma:migrate:deploy` – Aplicar migraciones.
- `npm run prisma:seed` – Poblar datos iniciales.
- `npm run start:dev` – Modo desarrollo con recarga.
- `npm run build` / `npm run start:prod` – Compilar y ejecutar en modo producción.

## Estructura del proyecto

```
├── backend/                # Backend unificado Nest.js + Prisma
│   ├── Dockerfile
│   ├── docker-entrypoint.sh
│   ├── prisma/         # schema.prisma, migraciones y seed.ts
│   └── src/            # Módulos Auth, Users, Posts y configuración
├── frontend/               # SPA React + Zustand + Vite
├── config/                 # Scripts de init DB (archivos .env viven en la raíz)
├── docs/                   # Manual en Markdown/PDF
├── docker-compose.yml
└── README.md
```

## Documentación adicional

- `docs/manual_instalacion.md`: Guía editable con pasos de instalación.
- `docs/manual_instalacion.pdf`: Versión en PDF generada desde la guía.

## Próximos pasos sugeridos

- Añadir pruebas unitarias e2e (Jest / Playwright) para backend y frontend.
- Integrar CI/CD para ejecutar lint, build y tests automáticamente.
- Incorporar Swagger u otra documentación interactiva para los endpoints.
- Extender el modelo con refresh tokens y recuperación de contraseña.
- Monitorizar contenedores (Prometheus + Grafana) y centralizar logs.
