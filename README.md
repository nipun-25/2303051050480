# Affordmed Campus Notification Platform

A premium, full-stack, type-safe Campus Notification Platform built as part of the Affordmed Campus Hiring Full Stack Evaluation.

**Candidate Roll Number:** 2303051050480

---

## Project Architecture & Design Decisions

1. **Type-Safe Backend (Express + TypeScript)**: Enforces API payload shapes and request models.
2. **Asynchronous Non-Blocking Logger**: Instead of blocking `console.log()` outputs, the custom logging middleware streams structured metrics directly to `process.stdout` asynchronously, preserving Event Loop resources.
3. **Graceful Fallback Authentication (Offline/Mock Mode)**: Supports seamless testing when the external auth server (`20.244.56.144`) is unreachable. If `USE_MOCK_AUTH=true` is defined in `.env`, the system verifies calls via local Bearer Tokens.
4. **Priority Notification Sorting Engine**: Sorts announcements in absolute priority hierarchy:
   - Status: Unread takes priority over Read.
   - Category: Placement (Critical) > Exam Result (Important) > Event (General).
   - Recency: Newer announcements first.
5. **Responsive Material UI (MUI) Frontend**: React + TypeScript single-page app displaying "All Announcements" (paginated & filterable) and "Priority Board" (all unread critical notices). Responsive on all form factors.

---

## Folder Structure

```text
2303051050480/
├── backend/
│   ├── src/
│   │   ├── data/
│   │   │   └── store.ts          # In-Memory Database containing Mock Notifications
│   │   ├── middleware/
│   │   │   ├── auth.ts           # Token Authorization Middleware
│   │   │   └── logger.ts         # Asynchronous Streaming Logging Middleware
│   │   ├── routes/
│   │   │   └── notifications.ts  # Notifications API routes
│   │   ├── test/
│   │   │   └── api.test.ts       # Automated API Integration Suite
│   │   └── app.ts                # Main Express App entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx        # App header & navigation tabs
│   │   │   └── NotificationList.tsx # Notification grid display components
│   │   ├── App.tsx               # Main state manager & page routing
│   │   ├── main.tsx              # React bootstrap entry point
│   │   └── index.css             # Margin resets & styling configs
│   ├── package.json
│   └── vite.config.ts
├── .env                          # Local environment credentials (ignored)
├── .gitignore                    # System and node packages exclusions list
└── notification_system_design.md # Full technical specification guide
```

---

## Installation & Setup

### 1. Credentials Configuration
Create a `.env` file in the root workspace folder with the following variables:
```env
AFFORDMED_CLIENT_ID=0ae3da82-8427-4f1b-9e03-4ba06ba653cc
AFFORDMED_CLIENT_SECRET=dkvATBGvtUZcgFRc
AFFORDMED_MOCK_TOKEN=mock-bearer-token-roll-2303051050480-secret-dkvATBGvtUZcgFRc
PORT=3000
NODE_ENV=development
USE_MOCK_AUTH=true
```

### 2. Start the Backend
```bash
cd backend
npm install
npm run dev
```
The server will initialize at `http://localhost:3000`.

### 3. Start the Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173/` in your browser.

---

## Executing Tests
To run the automated API integration tests (ensure the backend is running first):
```bash
cd backend
npx ts-node src/test/api.test.ts
```
The console will output passing assertions verifying route validation, auth guards, sorting constraints, and error statuses.
