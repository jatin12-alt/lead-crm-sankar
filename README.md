# Lead Management System (Mini CRM)

A full-stack Mini CRM for managing leads, built with React, Node.js, Express, and PostgreSQL.

## Prerequisites

- Node.js installed
- PostgreSQL installed and running locally

## Setup — One Time Only

### 1. Configure the Database

Open `backend/.env` and update your PostgreSQL credentials:

```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
```

> **Note:** You do NOT need to create the `leads` table manually. The backend creates it automatically on first run.

### 2. Install All Dependencies

Run this once from the root directory to install dependencies for both backend and frontend:

```bash
npm run install:all
```

---

## 🚀 Start Everything — Single Command

Make sure your PostgreSQL server is running, then from the **root** directory just run:

```bash
npm start
```

This will launch both the backend (port `5000`) and the frontend (usually port `5173`) simultaneously in the same terminal.

Open your browser at: **http://localhost:5173**

---

## Features

- **Dashboard**: Total Leads, Converted, and Interested metrics at a glance.
- **Add Leads**: Capture Name, Phone, and Source (Call / WhatsApp / Field).
- **Status Management**: Update lead status inline (Interested / Not Interested / Converted).
- **Search & Filter**: Search by name and filter by source.
- **Delete Leads**: Remove leads with a single click.
- **Modern UI**: Clean, responsive, and beautiful interface.

## Project Structure

```
lead-crm-sankar/
├── backend/
│   ├── server.js       # Express server & API routes
│   ├── db.js           # PostgreSQL connection & table init
│   ├── .env            # Database credentials
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx     # Main app component
│   │   ├── index.css   # Global styles
│   │   └── components/
│   │       ├── Dashboard.jsx
│   │       ├── LeadForm.jsx
│   │       ├── LeadTable.jsx
│   │       └── SearchBar.jsx
│   └── package.json
├── package.json        # Root — runs both with `npm start`
└── README.md
```
