TEAM TASK MANAGER - README
=========================

A production-ready Team Task Manager built with the MERN stack. 
Features JWT authentication, role-based access control, project/task management, 
dashboard analytics, and a premium interactive UI.

TECH STACK
----------
Frontend: React 18 (Vite), Tailwind CSS 3, Framer Motion, Recharts
Backend:  Node.js, Express.js, Mongoose (MongoDB)
Auth:     JWT, bcryptjs
Forms:    React Hook Form + Yup

PROJECT STRUCTURE
-----------------
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Auth, Project, Task, User logic
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API endpoints
│   │   └── middleware/     # Auth and validation guards
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI (CustomSelect, Navbar, etc.)
│   │   ├── pages/          # App views (Dashboard, Tasks, Projects)
│   │   └── context/        # Auth state management

QUICK START
-----------
1. Clone the repository
2. Backend Setup:
   - cd backend
   - npm install
   - Create .env (use MONGO_URI, JWT_SECRET)
   - npm run dev
3. Frontend Setup:
   - cd frontend
   - npm install
   - npm run dev
4. Access app at http://localhost:5173

FEATURES
--------
- AUTHENTICATION: Secure JWT login/signup with persistent sessions.
- ROLE-BASED ACCESS: Admin (Full control) vs Member (Assigned tasks only).
- DASHBOARD: Real-time analytics and project statistics.
- PREMIUM UI: 
  * Custom glassmorphic dropdowns and selects.
  * Modern split-screen Login/Signup pages.
  * Smooth Framer Motion transitions and background animations.
- RESPONSIVE DESIGN: Fully optimized for mobile and desktop viewports.

API ENDPOINTS (Summary)
-----------------------
AUTH:     POST /api/auth/login, /api/auth/register
PROJECTS: GET /api/projects, POST /api/projects
TASKS:    GET /api/tasks, POST /api/tasks
USERS:    GET /api/users, PUT /api/users/profile

LICENSE
-------
ISC License
