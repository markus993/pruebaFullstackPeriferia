FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./

FROM build AS test
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM build AS release
RUN npm run build

FROM nginx:1.27-alpine AS serve
COPY --from=release /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
