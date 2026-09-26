# Habit Tracker

An AI-powered full-stack habit tracking application with gamification, interactive analytics, and smart habit recommendations.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Framer Motion, Three.js / React Three Fiber, Axios
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Google Gen AI SDK (`@google/genai`)

---

## Project Structure

```
habit-tracker/
├── backend/          # Express API & MongoDB backend
│   ├── src/          # Controllers, models, routes, config
│   ├── .env.example  # Backend environment variables template
│   └── package.json
├── frontend/         # React + Vite frontend
│   ├── src/          # Components, pages, hooks, services
│   ├── .env.example  # Frontend environment variables template
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or a MongoDB Atlas connection URI)

---

### 1. Backend Setup

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` configuration file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *On Windows PowerShell:*
   ```powershell
   Copy-Item .env.example .env
   ```

4. Configure your environment variables in `backend/.env`:
   - `PORT`: Server port (default: `8000`)
   - `MONGOURI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for signing auth tokens
   - `CLIENT_URL`: URL of the frontend (default: `http://localhost:5173`)
   - `GEMINI_API_KEY`: Google Gemini API key

5. (Optional) Seed the database with sample data:
   ```bash
   npm run seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```
   The backend server runs on `http://localhost:8000`.

---

### 2. Frontend Setup

1. Open another terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *On Windows PowerShell:*
   ```powershell
   Copy-Item .env.example .env
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.
