# Periferia Social

Aplicación de red social interna donde los colaboradores pueden iniciar sesión, revisar su perfil, publicar mensajes y reaccionar con "likes". La solución está compuesta por un backend unificado en Nest.js + Prisma y un frontend en React + Vite.

## Arquitectura

- `backend`: API REST en Nest.js (TypeScript) con Prisma ORM y JWT para autenticación.
- `frontend`: SPA en React + TypeScript con Zustand para manejo de estado global.
- `postgres`: Base de datos PostgreSQL gestionada mediante migraciones Prisma.

## Requisitos

- Node.js >= 20
- npm >= 10
- Docker y Docker Compose
- PowerShell / Bash (según sistema operativo)

## Variables de entorno

Las variables compartidas residen en `.env` (existe `env.example` como referencia en la raíz):

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

1. Personaliza las variables del archivo .ENV (opcional):

2. Construye y levanta toda la solución:
   ```powershell
   docker compose up --build
   ```
3. Urls principales:
   - Frontend: `http://localhost:${FRONTEND_PORT}` (por defecto `http://localhost:5173`)
   - API: `http://localhost:${API_PORT}/api` (por defecto `http://localhost:3000/api`)

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
- `npm run test` – Ejecutar las pruebas unitarias del backend con Jest.

### Cómo ejecutar las pruebas unitarias del backend

1. Instala dependencias (solo la primera vez):

   ```powershell
   cd backend
   npm install
   ```

2. Lanza la suite de pruebas:

   ```powershell
   npm run test
   ```

3. Para ver la cobertura:

   ```powershell
   npm run test:cov
   ```

#### Desde Docker Compose

1. Asegúrate de tener los contenedores levantados:

   ```powershell
   docker compose up --build
   ```

2. Ejecuta las pruebas dentro del contenedor `api`:

   ```powershell
   docker compose exec api npm run test
   ```

3. Para generar cobertura desde Docker:

   ```powershell
   docker compose exec api npm run test:cov
   ```

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
