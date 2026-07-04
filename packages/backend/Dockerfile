# ─────────────────────────────────────────────
# Imagen base: node:20-alpine
# (package.json no define engines.node, se usa LTS 20)
# ─────────────────────────────────────────────
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# ─────────────────────────────────────────────
# Copiar manifiestos primero para aprovechar
# el cache de capas de Docker.
# Si package.json/package-lock.json no cambian,
# la capa de instalación se reutiliza.
# ─────────────────────────────────────────────
COPY package*.json ./

# Instalar solo dependencias de producción.
# nosotros NO versionamos package-lock.json está presente → usamos npm install --omit-dev
RUN npm install --omit=dev

# ─────────────────────────────────────────────
# Copiar únicamente el código del servidor API.
# El cliente React se buildea en su propio
# contenedor (ver client/Dockerfile).
# ─────────────────────────────────────────────
COPY . .

EXPOSE 3000

# Punto de entrada: inicia el servidor Express
CMD ["node", "./index.js"]