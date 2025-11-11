#!/bin/sh
set -euo pipefail

echo "[api] Esperando a la base de datos..."
until printf "SELECT 1;" | npx prisma db execute --schema prisma/schema.prisma --stdin >/dev/null 2>&1; do
  echo "[api] Base de datos no disponible, reintentando en 2s..."
  sleep 2
done

echo "[api] Ejecutando prisma generate"
npm run prisma:generate

echo "[api] Aplicando migraciones (deploy)"
npm run prisma:migrate:deploy

echo "[api] Ejecutando seed"
npm run prisma:seed

echo "[api] Iniciando servidor Nest"
exec node dist/src/main.js
