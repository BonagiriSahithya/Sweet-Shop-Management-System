Sure! I can create a **polished, updated README** for your Sweet Shop Management System project, including your **deployed frontend and backend URLs**, tech stack, and features. Here’s an updated version:

````markdown
# 🍭 Sweet Shop Management System 🍬

✨ A full-stack **Sweet Shop Management System** built with **React**, **Node.js**, **Express**, and **MongoDB** — designed with **Test-Driven Development (TDD)** principles and modern UI practices.

---

## 🌟 Project Overview

The **Sweet Shop Management System** is a full-stack application for managing sweets inventory and user purchases. It supports **role-based access**, allowing different actions for users and admins:

- 🧑‍💻 **Users** can browse, view, and purchase sweets.  
- 🧑‍🔧 **Admins** can manage inventory — add new sweets, update details, restock quantities, and delete items.

---

## 🚀 Live Demo

- **Frontend (React)**: [https://sweet-shop-management-system-theta-rust.vercel.app/signup](https://sweet-shop-management-system-theta-rust.vercel.app/signup)  
- **Backend API (Node.js + Express)**: [https://sweet-shop-management-system-5c0g.onrender.com/api](https://sweet-shop-management-system-5c0g.onrender.com/api)

---

## 🎯 Key Features

- ✅ JWT-based Authentication and Authorization  
- ✅ Role-based Access Control (Admin / User)  
- ✅ Fully RESTful API with Express  
- ✅ MongoDB Atlas for persistent cloud database  
- ✅ CORS enabled for frontend-backend communication  
- ✅ Test-Driven Development (TDD) with Jest and Supertest  
- ✅ Modern, responsive UI with React and React Router

---

## 🛠 Tech Stack

| Frontend          | Backend                 | Database         | Others               |
|------------------|------------------------|----------------|---------------------|
| React (Vite)     | Node.js + Express       | MongoDB Atlas   | Axios, JWT, bcrypt  |
| React Router DOM | JSON Web Tokens (JWT)   | Mongoose ODM    | CORS, dotenv        |
| Vite             | Jest & Supertest (TDD) |                | Nodemon (dev)       |

---

## 📦 Getting Started

### 1️⃣ Clone the Repo
```bash
git clone https://github.com/BonagiriSahithya/Sweet-Shop-Management-System.git
````

### 2️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret
npm run dev
```

* Backend runs at `http://localhost:5000` by default.

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Update .env with VITE_API_URL pointing to backend
npm run dev
```

* Frontend runs at `http://localhost:5173` by default.

---

## ⚡ Usage

1. Sign up as a **User** or **Admin**
2. Login to access your dashboard
3. Admins can manage sweets inventory
4. Users can browse and purchase sweets

---

## 🧪 Testing

* Backend tests are written using **Jest** and **Supertest**:

```bash
cd backend
npm run test
npm run test:coverage
```

---

## 📌 Notes

* Make sure your **MongoDB Atlas URI** is valid in `.env`.
* Frontend communicates with backend via `VITE_API_URL`.
* JWT tokens are stored in **localStorage** for session persistence.

---

## 🌐 Deployment

* **Frontend** deployed on **Vercel**
* **Backend API** deployed on **Render**

---

## 💖 Author

* Sahithya Bonagiri
* GitHub: [BonagiriSahithya](https://github.com/BonagiriSahithya)
* Portfolio: *Your Portfolio Link Here*

```


