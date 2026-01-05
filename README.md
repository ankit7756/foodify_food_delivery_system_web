# 🍔 Foodify – Food Ordering & Delivery System

Foodify is a full-stack food ordering and delivery system designed to demonstrate modern web application development using **Next.js**, **Node.js**, **Express**, and **MongoDB**.  
The project follows clean architecture principles with clear separation between frontend and backend.

---

## 🚀 Project Overview

Foodify allows users to:
- Register and log in securely
- Access a protected dashboard after authentication
- Experience a modern UI with form validation and theming
- Interact with a backend API built using industry-standard patterns

This project is built for learning, scalability, and maintainability.

---

## 🧱 Architecture Overview

The project is structured as a **monorepo** with separate frontend and backend applications

---

## 🎨 Frontend (Next.js)

The frontend is built using **Next.js App Router** with component-based architecture and client-side validation.

### Key Features
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Zod validation
- react-hook-form
- Light / Dark theme toggle
- Clean folder separation
- Dummy authentication flow (UI-focused)

### Main Routes
- `/` – Home page
- `/login` – Login page
- `/register` – Registration page
- `/auth/dashboard` – Protected dashboard (dummy)

---

## 🔐 Backend (Node.js & Express)

The backend is a RESTful API responsible for authentication and user management.

### Key Features
- Node.js & Express
- TypeScript
- MongoDB with Mongoose
- JWT-based authentication
- Password hashing using bcrypt
- Zod DTO validation
- Clean layered architecture:
  - Routes
  - Controllers
  - Services
  - Repositories
  - Models
  - DTOs

### Authentication APIs
- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Login user and generate JWT

---

## 🗄 Database

- **MongoDB**
- Mongoose ODM
- User schema includes:
  - Email
  - Hashed password
  - Role (`user` / `admin`)
  - Profile information

---

## 🛠 Technologies Used

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Zod
- react-hook-form

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- bcryptjs
- jsonwebtoken
- dotenv

### Tools
- Git & GitHub
- Postman
- VS Code

---

## 📦 Environment Variables

Backend uses environment variables for configuration:

```env
PORT=5050
MONGODB_URI=mongodb://127.0.0.1:27017/foodify_db
JWT_SECRET=your_secret_key
