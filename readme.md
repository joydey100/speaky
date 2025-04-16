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
cd speaky
```

### 🔧 Backend Setup

```bash
npm install

```

# Create a .env file inside the backend folder with the following contents:

```bash
MONGODB_URI = your_mongodb_connection_string
JWT_SECRET = your_jwt_secret_key
NODE_ENV = development
PORT = 3000
CLOUDINARY_CLOUD_NAME = your_cloudinary_cloud_name_key
CLOUDINARY_API_KEY = your_cloudinary_api_key
CLOUDINARY_API_SECRET = your_cloudinary_api_secret_key
```

# Start the backend server:

```bash
npm run start

```

For Development:

```bash
npm run dev

```

### 💻 Frontend Setup

```bash
cd ../frontend
npm install
npm run dev

```

# The frontend will run by default at http://localhost:5173

---
