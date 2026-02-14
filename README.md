# VendorLink – AI-Powered Supplier Management Platform

A complete MERN stack application for centralized supplier management with structured procurement workflow, smart alerts, vendor performance tracking, and an AI assistant for insights.

## Tech Stack

- **Frontend:** React (Vite), TailwindCSS, Context API, Axios, MVVM with custom hooks
- **Backend:** Node.js, Express.js, Clean Architecture, MongoDB Atlas, Mongoose, JWT, RBAC
- **Database:** MongoDB Atlas

## Project Structure

```
vendor link/
├── backend/
│   ├── src/
│   │   ├── config/          # DB config
│   │   ├── controllers/     # Request handlers
│   │   ├── domain/          # Domain entities
│   │   ├── middlewares/     # Auth, validation, error handling
│   │   ├── models/          # Mongoose schemas
│   │   ├── repositories/    # Data access
│   │   ├── routes/          # API routes
│   │   ├── services/        # AI Assistant
│   │   ├── usecases/        # Business logic
│   │   ├── utils/           # Validators, seed, risk score
│   │   └── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/           # ViewModels
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (or copy from `.env.example`):

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/vendor_link?appName=YOUR_APP
JWT_SECRET=supersecurekey
PORT=5000
NODE_ENV=development
```

```bash
npm run dev        # Start dev server
npm run seed       # Seed sample data
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000 and proxies API requests to http://localhost:5000.

### Default Credentials (after seed)

- **Admin:** admin@vendorlink.com / admin123
- **Officer:** officer@vendorlink.com / officer123

## API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login

### Vendors
- `GET /api/vendors` - List (paginated, search, sort)
- `GET /api/vendors/:id` - Get by ID
- `POST /api/vendors` - Create
- `PUT /api/vendors/:id` - Update
- `DELETE /api/vendors/:id` - Delete

### Purchase Orders
- `GET /api/purchase-orders` - List
- `POST /api/purchase-orders` - Create
- `GET /api/purchase-orders/:id` - Get by ID
- `PUT /api/purchase-orders/:id/approve` - Approve

### Invoices
- `GET /api/invoices` - List
- `POST /api/invoices` - Create (auto-matches with PO)
- `GET /api/invoices/:id` - Get by ID

### Payments
- `GET /api/payments` - List
- `POST /api/payments` - Create
- `PUT /api/payments/:id/paid` - Mark paid
- `GET /api/payments/:id` - Get by ID

### Dashboard
- `GET /api/dashboard` - Analytics

### AI Assistant
- `POST /api/ai-assistant/query` - Send query

All protected routes require `Authorization: Bearer <token>`.

## Risk Score Formula

```
Risk Score = (delayRate × 0.4) + (mismatchRate × 0.4) + ((5 - rating) × 20 × 0.2)
```

- 0–29: Low
- 30–49: Medium
- 50–69: High
- 70–100: Critical

## AI Assistant Queries

- "Why is Vendor X delayed?"
- "Show vendors with mismatch above 10%"
- "Which vendor is high risk?"
- "Predict next payment risk"
- "Dashboard overview"
