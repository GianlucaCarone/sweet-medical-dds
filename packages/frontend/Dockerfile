# ─────────────────────────────────────────────
# Stage 1 — BUILD
# ─────────────────────────────────────────────

FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# ─────────────────────────────────────────────
# Stage 2 — SERVE
# ─────────────────────────────────────────────

FROM nginx:alpine

# Copiar la app compilada
COPY --from=build /app/build /usr/share/nginx/html

# Configuración de nginx para React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Variables de entorno runtime
COPY env.sh /docker-entrypoint.d/40-env-config.sh
RUN chmod +x /docker-entrypoint.d/40-env-config.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]