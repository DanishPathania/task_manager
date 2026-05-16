# Team Task Manager

A production-ready Team Task Manager built with the MERN stack. Features JWT authentication, role-based access control, project/task management, dashboard analytics, and Railway deployment support.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (Vite), Tailwind CSS 3, React Router DOM, Axios, Recharts, Framer Motion, React Hook Form + Yup |
| Backend | Node.js, Express.js, Mongoose, JWT, bcryptjs, express-validator |
| Database | MongoDB Atlas |
| Deployment | Railway (backend) |

## Project Structure

```
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/         # Database connection
│   │   ├── controllers/    # Auth, Project, Task, User
│   │   ├── middleware/     # Auth, admin, error, validation
│   │   ├── models/         # User, Project, Task
│   │   ├── routes/         # API route definitions
│   │   ├── utils/          # Token generation, ApiError
│   │   └── validators/     # Express-validator schemas
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── railway.json
└── frontend/
    ├── src/
    │   ├── api/            # Axios instance + API modules
    │   ├── components/     # Reusable UI components
    │   ├── context/        # AuthContext
    │   ├── hooks/          # useAuth
    │   ├── layouts/        # DashboardLayout
    │   ├── pages/          # All app pages
    │   ├── routes/         # Route definitions + guards
    │   └── utils/          # Helper functions
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone and Setup

```bash
cd team-task-manager
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Environment Variables

### Backend (.env)
| Variable | Description |
|----------|-----------|
| PORT | Server port (default: 5000) |
| MONGO_URI | MongoDB Atlas connection string |
| JWT_SECRET | Secret key for JWT tokens |
| JWT_EXPIRE | Token expiry (default: 7d) |
| CLIENT_URL | Frontend URL for CORS |
| NODE_ENV | development / production |

### Frontend (.env)
| Variable | Description |
|----------|-----------|
| VITE_API_URL | Backend API URL |

## API Documentation

### Auth
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| POST | /api/auth/register | Register user | Public |
| POST | /api/auth/login | Login user | Public |
| GET | /api/auth/me | Get current user | Private |
| POST | /api/auth/logout | Logout | Private |

### Projects
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| GET | /api/projects | List projects | Private |
| POST | /api/projects | Create project | Admin |
| GET | /api/projects/:id | Get project | Private |
| PUT | /api/projects/:id | Update project | Admin |
| DELETE | /api/projects/:id | Delete project | Admin |

### Tasks
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| GET | /api/tasks | List tasks | Private |
| POST | /api/tasks | Create task | Admin |
| GET | /api/tasks/:id | Get task | Private |
| PUT | /api/tasks/:id | Update task | Private* |
| DELETE | /api/tasks/:id | Delete task | Admin |
| POST | /api/tasks/:id/comments | Add comment | Private |
| GET | /api/tasks/stats/dashboard | Dashboard stats | Private |

*Members can only update status of their assigned tasks.

### Users
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| GET | /api/users | List users | Private |
| GET | /api/users/:id | Get user | Private |
| PUT | /api/users/profile | Update profile | Private |

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or 0.0.0.0/0 for development)
5. Get connection string and paste in `.env` as `MONGO_URI`

## Railway Deployment (Backend)

1. Push your code to GitHub
2. Go to [Railway](https://railway.app)
3. Create new project → Deploy from GitHub
4. Select the backend directory
5. Add environment variables (MONGO_URI, JWT_SECRET, CLIENT_URL, NODE_ENV=production)
6. Deploy!

## Features

- **Authentication**: JWT-based signup/login with persistent sessions
- **Role-Based Access**: Admin (full CRUD) vs Member (view + status updates)
- **Projects**: Create, update, delete, assign team members
- **Tasks**: Full CRUD with priority, status, due dates, comments
- **Dashboard**: Interactive charts (Recharts) with real-time statistics
- **Search & Filter**: Search by name, filter by status/priority
- **Pagination**: Server-side pagination on all list views
- **Responsive**: Mobile-first design with collapsible sidebar
- **Animations**: Smooth Framer Motion transitions
- **Toast Notifications**: User feedback for all actions
- **Form Validation**: Client-side (Yup) + server-side (express-validator)

## License

ISC
