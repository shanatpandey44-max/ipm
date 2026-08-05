# Indore Property Management — MERN Stack

> Premium Real Estate Platform | theipm.in

```
theipm/
├── frontend/    ← React + TypeScript + Tailwind CSS
└── backend/     ← Node.js + Express + MongoDB
```

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
cp .env.example .env
# Fill in MONGO_URI and other values in .env
npm install
npm run seed     # seed database with sample data
npm run dev      # starts on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev      # starts on http://localhost:5173
```

---

## 🔑 Default Credentials (after seed)
| Role  | Email                | Password       |
|-------|----------------------|----------------|
| Admin | admin@theipm.in      | Admin@IPM2024  |
| Agent | santosh@theipm.in    | Agent@IPM2024  |

---

## 📡 API Base URL
- Development: `http://localhost:5000/api`
- Production:  `https://api.theipm.in/api`

## 🌐 Frontend URL
- Development: `http://localhost:5173`
- Production:  `https://theipm.in`

---

## 📚 Documentation
See `frontend/ARCHITECTURE.md` for full system architecture.
