# 🗨️ Speaky - Real-Time Chat Application

A real-time full-stack chat application with user authentication, profile management, and live messaging built using modern web technologies.

## 🔗 Live Demo

👉 <a href="https://speaky-9qys.onrender.com" target="_blank" rel="noopener noreferrer"> Speaky Chat App </a>

## 🚀 Features

- 🔐 **Authentication & Authorization** with JWT
- 💬 **Real-time messaging** using Socket.io
- 🟢 **Online/offline user status** indicator
- 👤 **User profile update** (name & profile picture)
- ⚙️ **Global state management** with Zustand
- 🧠 **Robust error handling** on both client and server
- 📱 **Responsive UI** with TailwindCSS and DaisyUI

---

## 🛠️ Tech Stack

### Frontend:

- **React**
- **Tailwind CSS**
- **DaisyUI**
- **Zustand** (state management)
- **Socket.io Client**

### Backend:

- **Node.js**
- **Express**
- **MongoDB** (with Mongoose)
- **Socket.io Server**
- **JWT** (Authentication)

---

## 📁 Folder Structure

```
speaky/
├── backend/
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── lib/
│       └── index.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── constants/
│       ├── lib/
│       ├── pages/
│       ├── store/
│       ├── App.jsx
│       └── main.jsx
│
├── .gitignore
├── package.json
└── package-lock.json

```

---

## 🛠️ Setup Instructions

### 📁 Clone the Repository

```bash
git clone https://github.com/joydey100/speaky.git
```

```bash
cd speaky
```

---

### 🛡️ Setup .env file

Create a .env file in the speaky folder (root directory) with the following contents:

```bash
MONGODB_URI = your_mongodb_connection_string
JWT_SECRET = your_jwt_secret_key
NODE_ENV = development
PORT = 3000
CLOUDINARY_CLOUD_NAME = your_cloudinary_cloud_name_key
CLOUDINARY_API_KEY = your_cloudinary_api_key
CLOUDINARY_API_SECRET = your_cloudinary_api_secret_key
```

---

### 🏗️ Build the app

```bash
npm run build

```

---

### 🚀 Start the app

```bash
npm run start

```

---
