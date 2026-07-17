# Eventra

A full-stack MERN event booking platform with secure authentication, OTP-based booking verification, role-based access control, and an admin dashboard for managing events, bookings, and analytics.

## 🔗 Live Demo

**[https://eventra-1vrl.onrender.com](https://eventra-1vrl.onrender.com)**

> ⏳ Hosted on Render's free tier — the first visit after a period of inactivity may take up to a minute while the server wakes up.

## ✨ Features

- **Authentication** — JWT-based login & registration secured with bcrypt password hashing
- **Email OTP verification** — new accounts and bookings are verified with a 6-digit OTP sent via email
- **Forgot password** — secure, single-use, 15-minute password reset links delivered by email
- **Event discovery** — browse and search events with live seat availability
- **Booking flow** — OTP-verified booking requests with email confirmations
- **User dashboard** — track booking requests, statuses, and payments; cancel anytime
- **Admin dashboard** — create/delete events, approve or reject booking requests, and view analytics (revenue, paid clients, pending requests)
- **Premium UI** — luxury dark theme with glassmorphism, aurora lighting, and Framer Motion animations

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, React Router, Axios |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcrypt |
| Email | Nodemailer (Gmail) |
| Hosting | Render (single web service serving API + built client) |

## 📁 Project Structure

```
Eventra/
├── client/              # React frontend (Vite + Tailwind)
│   └── src/
│       ├── components/  # Navbar, EventCard, AuthCard, Background, ...
│       ├── pages/       # Home, EventDetail, dashboards, auth pages
│       ├── context/     # Auth context (JWT session)
│       └── utils/       # Axios instance
└── server/              # Express backend
    ├── controllers/     # Auth, events, bookings logic
    ├── models/          # User, Event, Booking, OTP schemas
    ├── routes/          # /api/auth, /api/events, /api/bookings
    ├── middleware/      # JWT auth guard
    └── utils/           # Nodemailer email templates
```

## 🚀 Running Locally

**Prerequisites:** Node.js ≥ 20, a MongoDB database (Atlas free tier works), and a Gmail account with an [App Password](https://myaccount.google.com/apppasswords).

1. **Clone and install**

   ```bash
   git clone https://github.com/Meet-510/Eventra.git
   cd Eventra
   npm install --prefix server
   npm install --prefix client
   ```

2. **Configure environment variables**

   Create `server/.env` (see [`server/.env.example`](server/.env.example)):

   ```env
   PORT=5000
   MONGODB_URI=<your MongoDB connection string>
   JWT_SECRET=<long random string>
   EMAIL_USER=<your Gmail address>
   EMAIL_PASS=<16-char Gmail app password>
   ```

3. **(Optional) Seed sample data**

   ```bash
   cd server && node seed.js
   ```

4. **Start both servers**

   ```bash
   # Terminal 1 — backend on :5000
   cd server && npm run dev

   # Terminal 2 — frontend on :5173
   cd client && npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173).

## 🌐 Deployment

The app deploys as a **single Render web service**: the build compiles the React client and Express serves the static bundle alongside the API.

- **Build command:** `npm run build`
- **Start command:** `npm start`
- **Env vars:** all of the above plus `NODE_ENV=production` (`PORT` is provided by Render)

Every push to `main` triggers an automatic redeploy. A health check is available at [`/api/health`](https://eventra-1vrl.onrender.com/api/health).

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register + send verification OTP |
| POST | `/api/auth/verify-otp` | Verify account OTP |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/forgot-password` | Email a password reset link |
| POST | `/api/auth/reset-password/:id/:token` | Set a new password |
| GET | `/api/events` | List/search events |
| GET | `/api/events/:id` | Event details |
| POST | `/api/events` | Create event *(admin)* |
| DELETE | `/api/events/:id` | Delete event *(admin)* |
| POST | `/api/bookings/send-otp` | Send booking OTP *(auth)* |
| POST | `/api/bookings` | Create booking request *(auth)* |
| GET | `/api/bookings/my` | My bookings / all bookings *(admin)* |
| PUT | `/api/bookings/:id/confirm` | Approve booking *(admin)* |
| DELETE | `/api/bookings/:id` | Cancel booking |
| GET | `/api/health` | Service + database status |

## 👤 Author

**Meet** — [github.com/Meet-510](https://github.com/Meet-510)
