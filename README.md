# 🏥 Sweet Medical

A **full-stack medical appointment management system** developed as the final project for the **Software Development (DDS)** course of the **Information Systems Engineering** degree at **UTN FRBA**.

This project was built using a **monorepo architecture**, integrating a React frontend and an Express.js backend. It includes authentication, appointment management, user roles, and a complete REST API.

---

## 🚀 Features

- 🔐 JWT-based authentication and authorization
- 👨‍⚕️ Medical appointment management
- 👥 User and role management
- 📅 Scheduling system
- 💾 MongoDB persistence
- 🌐 RESTful API
- 📱 Responsive React frontend
- 🎨 Modern and intuitive user interface

---

## 🛠️ Tech Stack

### Frontend
- React
- JavaScript
- HTML5
- CSS3
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- CORS
- Dotenv

### Development
- Git
- GitHub
- npm Workspaces

---

## 📁 Project Structure

```text
.
├── packages/
│   ├── backend/        # Express.js API
│   └── frontend/       # React Application
├── package.json
├── README.md
└── .env.example
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/Sweet-Medical.git
```

Install all dependencies:

```bash
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside:

```text
packages/backend/
```

using the provided `.env.example` as reference.

Example:

```env
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001
SERVER_PORT=3001
JWT_SECRET=your_secret_key
JWT_EXPIRATION=1h
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=Sweet-Medical-Local
ITEMS_PER_PAGE=10
```

---

## ▶️ Running the Project

### Backend

```bash
npm run start:backend
```

Development mode:

```bash
npm run dev:backend
```

### Frontend

```bash
npm run start:frontend
```

### Run both simultaneously

```bash
npm run start:dev
```

---

## 💼 My Contributions

Throughout this project, I contributed to both the **frontend** and **backend**, including:

- Designing and implementing REST API endpoints
- JWT authentication and authorization
- MongoDB data persistence
- Backend business logic
- React frontend development
- User interface implementation
- Application workflows and use cases
- Bug fixing and feature development

---

## 📚 Academic Project

This project was developed as part of the **Software Development (DDS)** course at **Universidad Tecnológica Nacional – Facultad Regional Buenos Aires (UTN FRBA)**.

---

## 📄 License

This repository is intended for educational purposes.
