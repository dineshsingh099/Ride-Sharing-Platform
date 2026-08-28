# SafeGo

A full-stack ride/vehicle booking platform with secure authentication — built with a **Node.js + TypeScript + MongoDB** backend and a **React + Vite** frontend.

---

## ✨ Features

- **Email/Password Authentication** with OTP-based email verification
- **Google Sign-In** (One Tap / GSI) with nonce-based replay protection
- **JWT Access + Refresh Token** flow with HTTP-only cookies
- **Refresh token rotation** with reuse detection (auto session revoke on theft attempt)
- **Role-based access control** (`user`, `partner`, `admin`)
- **Rate limiting** on login, signup, and OTP endpoints
- **Redux Toolkit** state management with persisted auth flag
- **Auto token refresh** via Axios interceptor on the frontend

---

## 🛠️ Tech Stack

| Layer     | Technology                                                                 |
|-----------|-----------------------------------------------------------------------------|
| Frontend  | React 19, Vite, React Router v7, Redux Toolkit, Tailwind CSS, Axios         |
| Backend   | Node.js, Express 5, TypeScript, MongoDB (Mongoose)                          |
| Auth      | JWT (`jsonwebtoken`), `bcryptjs`, Google Auth Library                       |
| Security  | Helmet, CORS, express-rate-limit, express-validator                         |
| Email     | Nodemailer (Gmail SMTP)                                                     |

---

## 📁 Project Structure

```
SafeGo/
├── Backend/
│   ├── server.ts                  # App entry point
│   └── src/
│       ├── app.ts                 # Express app & middleware setup
│       ├── config/db.ts           # MongoDB connection
│       ├── controllers/           # Route handlers (auth, user)
│       ├── middlewares/           # authGuard, rate limiters
│       ├── models/                # Mongoose schemas (User, Session, Vehicle)
│       ├── routes/                # API route definitions
│       ├── types/                 # Global TypeScript declarations
│       ├── utils/                 # Token, mail, nonce helpers
│       └── validators/            # Request validation rules
│
└── Frontend/
    └── src/
        ├── App.jsx                # Route definitions
        ├── main.jsx               # App entry point
        ├── components/            # Navbar, Hero, Footer, VehicleSlider
        ├── pages/                 # Landing, Login, SignUp, VerifyOTP, Dashboard, Onboarding
        ├── hooks/useGetMe.jsx     # Fetch logged-in user on load
        ├── redux/                 # Store & auth slice
        └── services/              # Axios instance & API calls
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js **v18+**
- MongoDB database (local or Atlas)
- Gmail account with an [App Password](https://myaccount.google.com/apppasswords) (for OTP emails)
- Google OAuth Client ID ([Google Cloud Console](https://console.cloud.google.com/apis/credentials))

### 1. Clone & Install

```bash
git clone https://github.com/dineshsingh099/SafeGo.git
cd SafeGo

cd Backend && npm install
cd ../Frontend && npm install
```

### 2. Environment Variables

**`Backend/.env`**

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

GOOGLE_CLIENT_ID=your_google_client_id

EMAIL=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

**`Frontend/.env`**

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Run in Development

```bash
# Terminal 1 — Backend
cd Backend
npm run dev

# Terminal 2 — Frontend
cd Frontend
npm run dev
```

- Backend runs at: `http://localhost:5000`
- Frontend runs at: `http://localhost:5173`

### 4. Build for Production

```bash
# Backend
cd Backend
npm run build
npm start

# Frontend
cd Frontend
npm run build
npm run preview
```

---

## 🔌 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint          | Description                          |
|--------|-------------------|---------------------------------------|
| POST   | `/register`       | Register a new user, sends OTP        |
| POST   | `/verify-otp`      | Verify email OTP, logs the user in    |
| POST   | `/resend-otp`      | Resend OTP (60s cooldown)             |
| POST   | `/login`           | Login with email & password           |
| GET    | `/google/nonce`    | Get a nonce for Google Sign-In        |
| POST   | `/google`          | Login/signup via Google ID token      |
| POST   | `/refresh`         | Refresh the access token              |
| POST   | `/logout`          | Logout & revoke session               |

### User — `/api/user`

| Method | Endpoint | Description                  | Auth Required |
|--------|----------|-------------------------------|----------------|
| GET    | `/me`    | Get the current logged-in user | ✅              |

---

## 📜 Available Scripts

**Backend**

| Script  | Description                          |
|---------|----------------------------------------|
| `dev`   | Run server in watch mode (ts-node-dev) |
| `build` | Compile TypeScript to `dist/`          |
| `start` | Run the compiled production build      |

**Frontend**

| Script    | Description                  |
|-----------|-------------------------------|
| `dev`     | Start Vite dev server         |
| `build`   | Build for production          |
| `preview` | Preview the production build  |
| `lint`    | Run ESLint                    |

---

## 🔒 Security Notes

- Access tokens and refresh tokens are stored in **HTTP-only cookies** (not accessible via JS)
- Refresh tokens are **hashed with bcrypt** before being stored in the database
- Refresh token **reuse triggers automatic revocation** of all sessions for that user
- Passwords and OTPs are never stored in plain text
- Sensitive routes are protected by `authGuard` middleware with role-based checks

---

## 📄 License

ISC