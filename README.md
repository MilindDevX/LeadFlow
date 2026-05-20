# LeadFlow — Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack and TypeScript. Manage, track, filter, and export sales leads through a clean, professional dashboard.

> 🚀 **Live Demo:** [https://lead-flow-psi-ten.vercel.app](https://lead-flow-psi-ten.vercel.app)
> 
> *Test Account — Email: `demo@example.com` | Password: `Password123`*

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, React Query, Zustand, React Hook Form + Zod |
| **Backend** | Node.js, Express, TypeScript, MongoDB + Mongoose |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **DevOps** | Docker, Docker Compose, nginx |

---

## Features

- **JWT Authentication** — Register, login, protected routes, persistent sessions
- **Role-Based Access Control** — Admin (full access) and Sales User (limited) roles
- **Lead CRUD** — Create, view, edit, delete leads with full validation
- **Advanced Filtering** — Filter by status, source, search by name/email, sort by date — all composable simultaneously
- **Debounced Search** — 300ms debounce prevents excessive API calls
- **Backend Pagination** — Proper `skip`/`limit` with pagination metadata in every response
- **CSV Export** — Export current filtered results (Admin only)
- **Dark Mode** — Full dark mode support, persisted to localStorage

---

## Project Structure

```
leadflow/
├── docker-compose.yml
├── .env.example
├── README.md
├── API_DOCS.md
│
├── backend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── index.ts              # Entry point
│   │   ├── app.ts                # Express app
│   │   ├── config/db.ts          # MongoDB connection
│   │   ├── middleware/           # Auth, RBAC, error handling
│   │   ├── modules/
│   │   │   ├── auth/             # Auth controller, service, routes, schema
│   │   │   └── leads/            # Lead controller, service, routes, model, schema
│   │   ├── models/user.model.ts
│   │   └── types/index.ts
│
└── frontend/
    ├── Dockerfile
    └── src/
        ├── api/                  # Axios instance, auth API, leads API
        ├── store/                # Zustand auth store
        ├── hooks/                # useLeads (React Query), useDebounce
        ├── components/
        │   ├── ui/               # Button, Input, Select, Badge, Modal, Feedback
        │   ├── layout/           # Sidebar, Header, ProtectedRoute
        │   └── leads/            # LeadTable, LeadFilters, LeadForm, Pagination
        ├── pages/                # Login, Register, Dashboard, Leads, LeadDetail
        └── types/index.ts
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Docker + Docker Compose (for containerized setup)

---

### Option 1 — Docker (Recommended)

```bash
# Clone the repo
git clone https://github.com/yourusername/leadflow.git
cd leadflow

# Set environment variables
cp .env.example .env
# Edit .env and set a strong JWT_SECRET

# Build and run all services
docker-compose up --build

# App is now running at:
# Frontend: http://localhost
# Backend API: http://localhost:3001
# MongoDB: localhost:27017
```

---

### Option 2 — Local Development

**Backend:**

```bash
cd backend
npm install

# Set up environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT_SECRET

npm run dev
# Backend runs at http://localhost:3001
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/leadflow` |
| `JWT_SECRET` | Secret for signing JWTs | — (required) |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

---

## API Overview

See [API_DOCS.md](./API_DOCS.md) for full API documentation.

### Auth
| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Public |
| GET | `/api/auth/me` | Protected |

### Leads
| Method | Route | Access |
|---|---|---|
| GET | `/api/leads` | Protected |
| POST | `/api/leads` | Protected |
| GET | `/api/leads/:id` | Protected |
| PUT | `/api/leads/:id` | Protected |
| DELETE | `/api/leads/:id` | Admin only |
| GET | `/api/leads/export/csv` | Admin only |

---

## Architecture Decisions

**Why Zustand over Redux?**
LeadFlow's auth state is simple — a user object and token. Zustand provides persist middleware out of the box with no boilerplate overhead.

**Why React Query?**
Lead data is server state — it belongs on the server, not in a client store. React Query handles caching, background refetching, and pagination with minimal code. Combined with query key invalidation, the UI stays in sync after mutations automatically.

**Why Zod on both ends?**
The same validation rules (field lengths, email format, enum membership) are declared in both backend (authoritative) and frontend (fast feedback). Zod provides both runtime validation and TypeScript type inference from a single schema definition.

**Why lean() on Mongoose queries?**
Read-only list operations use `.lean()` which returns plain JS objects instead of full Mongoose documents — significantly faster for read-heavy operations like the leads list.

**Why text indexes on MongoDB?**
Rather than using regex on every search, a MongoDB text index enables efficient full-text search across `name` and `email` fields. The compound index on `{ status, source, createdAt }` optimizes the most common filter combination.

---

## Git Commit Convention

```
feat: add CSV export functionality
fix: resolve JWT cookie not being cleared on logout
refactor: extract filter logic from LeadService
docs: add API documentation
chore: add Docker setup
```

---

## Evaluation Criteria Checklist

- [x] TypeScript used throughout (no `any` without justification)
- [x] Proper interfaces and types defined
- [x] Clean folder structure with separation of concerns
- [x] JWT auth with bcrypt password hashing
- [x] Auth middleware + Role-based middleware
- [x] Full Lead CRUD with validation
- [x] Multi-filter support (status + source + search composable)
- [x] Debounced search (300ms)
- [x] Backend pagination with metadata
- [x] CSV export (admin only)
- [x] RBAC (admin / sales_user)
- [x] Docker + Docker Compose
- [x] Reusable UI components
- [x] Loading states
- [x] Empty states
- [x] Error states + centralized error handling
- [x] Form validation (Zod + React Hook Form)
- [x] Responsive design
- [x] Dark mode (bonus)
- [x] RESTful API with proper status codes
- [x] README + .env.example + API docs
