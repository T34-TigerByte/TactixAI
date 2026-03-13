# 🔴 TactixAI. — Cyber Threat Negotiation Training Platform

> A GenAI-powered chatbot platform for simulating real-world ransomware negotiation scenarios.  
> Built for **FlameTree Cyber** | IFN735 Industry Project — Group 34, QUT

---

## 📌 Project Overview

Tactix ai. is a web-based training platform that allows security professionals to practice
ransomware negotiation in a safe, AI-driven environment. Learners engage with realistic
threat actor personas, receive performance feedback, and build negotiation skills aligned
with cybersecurity best practices.

**Key capabilities:**
- Role-based access control (Learner, Reviewer, Admin)
- AI-powered threat actor simulation with configurable personas and scenarios
- Session tracking, performance metrics, and downloadable reports

This repository contains the **frontend client** application.

---

## 🛠 FE Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router DOM v6 |
| State Management | Context API |
| HTTP Client | Axios |
| Icons | lucide-react |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v20+`
- npm `v9+`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/tactix_ai-client.git
cd tactix_ai-client

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

### Environment Variables

```bash
# .env
VITE_API_URL=http://localhost:5173     # Backend API base URL
VITE_USE_MOCK=true                     # true = use mock auth (no backend needed)
```

### Run Locally

```bash
npm run dev
# → http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔐 Dev Test Accounts

When `VITE_USE_MOCK=true`, use these credentials (any password):

| Email | Role | Access |
|---|---|---|
| `admin@test.com` | Admin | User management, admin dashboard |
| `learner@test.com` | Learner | Training sessions, chat, dashboard |

---

## 📁 Folder Structure

```
src/
├── api/                  # Axios API calls (1:1 with backend endpoints)
│   ├── client.ts         # Axios instance + JWT interceptor
│   ├── auth.api.ts
│   ├── user.api.ts (to be added)
│   └── chat.api.ts (to be added)
│
├── components/
│   ├── common/           # Reusable UI components (Button, Input, Modal...)
│   ├── layout/           # App shell (Navbar, Sidebar, AppLayout)
│   └── guards/           # RBAC route protection
│       ├── ProtectedRoute.tsx
│       └── RoleGuard.tsx
│
├── context/              # Global state (Context API)
│   └── AuthContext.tsx
│
├── hooks/                # Custom hooks
│   ├── useAuth.ts
│   └── useRBAC.ts (to be added)
│
├── pages/                # One file per route
│   ├── auth/             # Login, Register
│   ├── learner/          # Learner Dashboard, Chat
│   ├── admin/            # Admin Dashboard, User Management
│   └── common/           # Unauthorized, NotFound
│
├── router/
│   ├── AppRouter.tsx     # All route declarations
│   └── routes.ts         # Route path constants
│
├── types/                # Shared TypeScript types
├── utils/                # Token helpers, formatters
└── styles/               # Global CSS
```

---

## 🌿 Git Branching Strategy

```
main                          ← production (auto-deploys to Vercel)
└── feature/<epic>-<task>     ← feature branches
    └── PR → reviewed → merged into main
```

**Branch naming convention:**
```
feature/epic-3-auth-scaffold
feature/epic-4-admin-dashboard
feature/epic-5-RBAC
fix/login-redirect
```

**Commit message format:**
```
feat:  new feature
fix:   bug fix
chore: config / dependency changes
docs:  documentation only
```

---

## 👥 Team — Group 34

| Name | Role | Responsibility |
|---|---|---|
| **Alex Yoo** | Full-stack Developer | Frontend, System Architecture |
| **Sam Chien** | Full-stack Developer | Python/FastAPI, Backend Services |
| **Neal Liu** | Database Engineer | PostgreSQL Schema, Migrations |
| **Chris Lee** | AI Engineer | Decision Tree Model, Dataset |
| **Summer Cheung** | UI Designer | Figma Prototypes, Design System |
| **Zoie Leung** | QA / Personas | Threat Actor Personas, Performance Metrics |

---

## 🗺 MVP Roadmap

| MVP | Target Week | Scope |
|---|---|---|
| **MVP 1** | Week 4 | Auth + RBAC + Mock Chat + Admin Basics |
| **MVP 2** | Week 8 | AI Integration + Scenario Config + Tracking |
| **MVP 3** | Week 10-12 | Full Analytics + Reports + Final Delivery |

---

## 📄 License

This project was developed as part of **IFN735 Industry Project** at  
Queensland University of Technology (QUT) in collaboration with **FlameTree Cyber**.

© 2026 Group 34 — All rights reserved.