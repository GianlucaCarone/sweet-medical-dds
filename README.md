Este repositorio es la base para el Trabajo Práctico de la materia **Desarrollo de Software (DDS)** de la carrera **Ingeniería en Sistemas de Información** de la **UTN FRBA**. Se trata de un **monorepo** que integra una aplicación frontend con Create React App y un backend con Express, facilitando el desarrollo y la gestión de ambos proyectos en un único entorno.

## 📦 Estructura del Proyecto

El monorepo está organizado de la siguiente manera:

```
.
├── packages/
│   ├── backend/        # Servidor Express.js
│   └── frontend/       # Aplicación React (Create React App)
├── package.json        # Configuración del monorepo (root)
├── README.md           # Este archivo
└── .env.example        # Ejemplo de configuración de variables de entorno
```

## ⚙️ Paquetes

Este monorepo utiliza **`npm workspaces`** para gestionar los diferentes paquetes.

### Backend (`packages/backend`)

El backend está construido con Express.js y utiliza las siguientes dependencias:

- **`express`**: El framework web para Node.js, utilizado para construir la API.
- **`cors`**: Middleware para Express que habilita Cross-Origin Resource Sharing (CORS), necesario para permitir que el frontend acceda al backend desde un origen diferente.
- **`dotenv`**: Carga variables de entorno desde un archivo `.env` en `process.env`. Es crucial para configurar el puerto del servidor y los orígenes permitidos.

La idea es dar lo mínimo para levantar el servidor, y que durante el desarrollo del TP se vayan agregando las dependencias necesarias.

### Frontend (`packages/frontend`)

El frontend es una aplicación de React generada con Create React App.

## 🚀 Inicio Rápido

Seguí estos pasos para poner en marcha el proyecto:

### 1\. Instalación de Dependencias

Desde la raíz del monorepo, ejecutá:

```bash
npm install
```

Esto instalará todas las dependencias para la raíz y para los paquetes `frontend` y `backend`.

### 2\. Configuración de Variables de Entorno

Crea un archivo `.env` en el directorio `packages/backend`. Para ello, debes copiar el archivo `.env.example` que se encuentra en `packages/backend/` y renombrarlo a `.env`.

```
# packages/backend/.env.example
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001
SERVER_PORT=3001
JWT_SECRET=escriba_aqui_su_secreto_local
JWT_EXPIRATION=1h
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=Sweet-Medical-Local
ITEMS_PER_PAGE=10
```

Este archivo `.env.example` **sí** debe subirse al repositorio para que todos los miembros del equipo sepan qué variables configurar. El archivo `.env` real será ignorado por Git.

- **`ALLOWED_ORIGINS`**: Define los orígenes permitidos para las solicitudes CORS. Asegurate de incluir la URL donde se ejecuta tu frontend.
- **`SERVER_PORT`**: El puerto en el que se ejecutará el servidor backend (ej. `3001`).
- **`JWT_SECRET`** y **`JWT_EXPIRATION`**: Configuración para la generación de tokens de sesión.
- **`MONGODB_URI`** y **`MONGODB_DB_NAME`**: Credenciales y configuración de la base de datos local.
- **`ITEMS_PER_PAGE`**: Paginación global para las listas.

### 3\. Ejecución de la Aplicación

Podés iniciar el frontend y el backend por separado o ambos a la vez:

#### Ejecutar el Backend

```bash
npm run start:backend
```

Para el desarrollo con reinicio automático:

```bash
npm run dev:backend
```

#### Ejecutar el Frontend

```bash
npm run start:frontend
```

#### Ejecutar Ambos (Desarrollo)

Para iniciar el backend en modo `dev` y el frontend simultáneamente, usá:

```bash
npm run start:dev
```
