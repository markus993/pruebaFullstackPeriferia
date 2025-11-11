FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
ENV NODE_ENV=development

COPY backend/package*.json ./
RUN npm install

COPY backend/tsconfig*.json ./
COPY backend/nest-cli.json ./
COPY backend/eslint.config.mjs ./
COPY backend/prisma ./prisma
COPY backend/src ./src

RUN npm run prisma:generate
RUN npm run build

FROM base AS release
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/dist ./dist
COPY backend/package*.json ./
COPY backend/prisma ./prisma
COPY backend/src ./src
COPY backend/tsconfig*.json ./
COPY backend/docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x docker-entrypoint.sh
RUN sed -i 's/\r$//' docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
