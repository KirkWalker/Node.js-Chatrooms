# 🚀 Fullstack Real-Time Chat

A professional-grade real-time chat application built with **React Native (Expo)**, **Node.js**, **Express**, and **MongoDB**. This project demonstrates high-level fullstack patterns including Optimistic UI, Role-Based Access Control (RBAC), and Database Change Streams.

## 🛠 Tech Stack

### Frontend

- **React Native (Expo)**: Cross-platform mobile architecture.
- **TanStack Query (v5)**: Server-state management and optimistic UI updates.
- **Socket.io-client**: Real-time bidirectional communication.
- **React Navigation**: Stack-based navigation flow.

### Backend

- **Node.js & Express**: Event-driven server architecture.
- **MongoDB & Mongoose**: NoSQL data modeling with Change Streams.
- **JWT & HttpOnly Cookies**: Secure authentication and refresh token rotation.
- **Socket.io**: Real-time event broadcasting.

---

## ✨ Key Features

- **Real-Time Sync**: Utilizes **MongoDB Change Streams** on the backend to watch for database changes and broadcast updates via **Socket.io**, ensuring all clients stay in sync without manual refreshing.
- **Optimistic UI**: Implements "Semi-Transparent" message states. Messages appear instantly in the UI and "solidify" once the server confirms persistence.
- **Secure Auth**: Full JWT implementation with access tokens in memory and refresh tokens in secure HttpOnly cookies.
- **RBAC (Role-Based Access Control)**: Middleware-driven security to protect specific API endpoints based on user roles (Admin/User).
- **Developer Tooling**:
- **Husky & lint-staged**: Prevents bad commits by running ESLint and Prettier automatically.
- **Commitlint**: Enforces conventional commit messages for clean git history.

---

## 🚦 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account or local instance
- Expo Go app on your mobile device (for testing)

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-link>

```

2. **Setup Backend**

```bash
cd node-server
npm install
# Create a .env file based on the provided .env.example
npm start

```

3. **Setup Frontend**

```bash
cd personalai
npm install
npx expo start

```

---

## 🧪 Testing

The project uses **Jest** and **Supertest** for integration testing of the authentication and security layers.

```bash
# Run integration tests
npm test

```

> **Note:** Tests are configured to run `--runInBand` to handle stateful authentication flows and database connection lifecycles gracefully.

---

## 🏗 Architecture Decisions

- **Why TanStack Query?** To decouple server state from UI logic and provide built-in caching and synchronization.
- **Why Change Streams?** Instead of emitting socket events directly from controllers, watching the DB ensures that the UI only updates when data is actually persisted, creating a single source of truth.
- **Why ES Modules?** To utilize modern JavaScript features and improve build-tooling compatibility.

---

## 👨‍💻 Author

**Kirk** - Fullstack Developer

---

##example.env

# Server Configuration

a .env file is needed to protect sentive auth info

# JWT Secrets (Generate long random strings for these)

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

PORT=3500

MONGO_DB_USER=
MONGO_DB_PW=

# MongoDB Connection

DATABASE_URI=

# Integration Testing Credentials

AUTH_USER=
AUTH_PW=
