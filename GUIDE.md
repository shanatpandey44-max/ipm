# 📋 IPM Project — Complete Guide
> Indore Property Management | theipm.in | MERN Stack

---

## 🗂️ Project Structure

```
theipm/
├── frontend/          → React + TypeScript + Vite + TailwindCSS
└── backend/           → Node.js + Express + MongoDB
```

---

## 🚀 Project Kaise Run Karna Hai

### Step 1 — Prerequisites
- Node.js v18+ install hona chahiye
- MongoDB Atlas account (free tier chalega)
- Cloudinary account (free tier — images ke liye)
- Gmail account (email notifications ke liye)

---

### Step 2 — Backend Setup

```bash
# 1. Backend folder mein jao
cd backend

# 2. .env file banao
cp .env.example .env

# 3. .env file kholo aur ye values bharo:
#    MONGO_URI       → MongoDB Atlas connection string
#    JWT_SECRET      → koi bhi random string (e.g. ipm_secret_2024)
#    CLOUDINARY_*    → Cloudinary dashboard se
#    SMTP_USER       → tumhara Gmail
#    SMTP_PASS       → Gmail App Password (neeche bataya hai)

# 4. Dependencies install karo
npm install

# 5. Database seed karo (sample data)
npm run seed

# 6. Server start karo
npm run dev
```

✅ Backend `http://localhost:5000` pe chalega

---

### Step 3 — Frontend Setup

```bash
# 1. Frontend folder mein jao
cd frontend

# 2. .env file check karo (already bani hui hai)
cat .env
# VITE_API_URL=http://localhost:5000/api  ← ye hona chahiye

# 3. Dependencies install karo
npm install

# 4. Dev server start karo
npm run dev
```

✅ Frontend `http://localhost:5173` pe chalega

---

## 🔑 Default Login Credentials (after seed)

| Role  | Email              | Password       |
|-------|--------------------|----------------|
| Admin | admin@theipm.in    | Admin@IPM2024  |
| Agent | santosh@theipm.in  | Agent@IPM2024  |

---

## 🌐 Important URLs

| Page              | URL                                    |
|-------------------|----------------------------------------|
| Website (Home)    | http://localhost:5173                  |
| Properties        | http://localhost:5173/properties       |
| Admin Login       | http://localhost:5173/login            |
| Admin Dashboard   | http://localhost:5173/admin            |
| Admin Properties  | http://localhost:5173/admin/properties |
| Admin Inquiries   | http://localhost:5173/admin/inquiries  |
| Admin Users       | http://localhost:5173/admin/users      |
| Admin Analytics   | http://localhost:5173/admin/analytics  |
| Agent Dashboard   | http://localhost:5173/agent            |
| Agent Properties  | http://localhost:5173/agent/properties |
| Agent Inquiries   | http://localhost:5173/agent/inquiries  |
| Add Property      | http://localhost:5173/agent/properties/new |
| API Health Check  | http://localhost:5000/api/health       |

---

## 📡 Backend API Endpoints

### Public (koi bhi access kar sakta hai)
```
GET    /api/health                    → Server status check
GET    /api/properties                → Properties list (filters support)
GET    /api/properties/:slug          → Single property detail
GET    /api/cities                    → Cities with property count
GET    /api/testimonials              → Testimonials list
POST   /api/auth/register             → User register
POST   /api/auth/login                → Login
POST   /api/auth/forgot-password      → Password reset email
PUT    /api/auth/reset-password/:token → Reset password
POST   /api/inquiries                 → Submit inquiry (contact form)
```

### Protected — User (login required)
```
GET    /api/auth/me                   → Current user info
PUT    /api/auth/update-profile       → Update name/phone
PUT    /api/auth/change-password      → Change password
PUT    /api/auth/favorites/:id        → Toggle favorite property
GET    /api/auth/logout               → Logout
```

### Protected — Agent + Admin
```
POST   /api/properties                → Create property (with images)
PUT    /api/properties/:id            → Update property
GET    /api/inquiries                 → View inquiries
PUT    /api/inquiries/:id             → Update inquiry status/notes
```

### Protected — Admin Only
```
GET    /api/admin/dashboard           → Dashboard stats
GET    /api/admin/users               → All users list
POST   /api/admin/users/agent         → Create agent account
PUT    /api/admin/users/:id           → Update user role/status
DELETE /api/admin/users/:id           → Delete user
DELETE /api/properties/:id            → Delete property
GET    /api/properties/stats          → Property analytics
GET    /api/inquiries/stats           → Inquiry analytics
```

---

## 🖥️ Frontend Pages & Features

### Public Website
| Page | Route | Features |
|------|-------|----------|
| Home | `/` | Hero, Search, Properties, Cities, Testimonials, Contact Form |
| Properties | `/properties` | Filter by city/type/price, Search, Pagination |
| Property Detail | `/properties/:slug` | Images, Details, Inquiry Form, Related Properties |

### Admin Dashboard (`/admin/*`)
| Page | Route | Features |
|------|-------|----------|
| Dashboard | `/admin` | Stats cards, Recent inquiries, Recent properties, Inquiry trend chart |
| Properties | `/admin/properties` | List all, Search/Filter, Delete, Toggle Featured, Pagination |
| Inquiries | `/admin/inquiries` | CRM view, Filter by status, Update status, Add notes, Call button |
| Users | `/admin/users` | List all users/agents, Create agent, Activate/Deactivate |
| Analytics | `/admin/analytics` | Properties by city/type, Inquiries by status/source |

### Agent Portal (`/agent/*`)
| Page | Route | Features |
|------|-------|----------|
| Dashboard | `/agent` | Stats, My properties, Assigned inquiries |
| My Properties | `/agent/properties` | Card view, Delete, View live |
| Add Property | `/agent/properties/new` | Full form — title, price, location, amenities, image upload |
| Inquiries | `/agent/inquiries` | Assigned inquiries, Update status, Add notes, Call |

---

## 🗄️ Database Models

### User
- name, email, phone, password (hashed)
- role: `user` / `agent` / `admin`
- favorites (property IDs)
- isActive, avatar

### Property
- title, slug (auto), description
- type: `Residential` / `Commercial` / `Plot`
- subType: `2 BHK`, `Villa`, `Office`, etc.
- status: `For Sale` / `For Rent` / `Sold`
- price: amount, unit, displayPrice, negotiable
- location: address, locality, city, pincode, coordinates
- size: area, areaUnit, displaySize
- bedrooms, bathrooms, parking, furnishing
- amenities (array), images (Cloudinary URLs)
- agent (User ref), views, inquiries count
- isFeatured, isActive, reraNumber

### Inquiry (CRM)
- name, email, phone
- inquiryType: `Purchase` / `Rent` / `Sell` / `Evaluation`
- city, budget, message
- property (optional ref)
- status: `new` → `contacted` → `site_visit_scheduled` → `negotiating` → `converted` / `lost`
- assignedTo (Agent ref)
- notes (array with text + addedBy + date)
- followUpDate, isRead, source

### City
- name, slug, description, shortDescription
- image, highlights, order
- isActive

### Testimonial
- name, role, location, avatar
- quote, rating, order, isActive

---

## ⚙️ Environment Variables

### Backend `.env`
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/theipm
JWT_SECRET=koi_bhi_random_string_likho
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CLOUDINARY_CLOUD_NAME=tumhara_cloud_name
CLOUDINARY_API_KEY=tumhari_api_key
CLOUDINARY_API_SECRET=tumhara_api_secret
CLIENT_URL=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tumhara@gmail.com
SMTP_PASS=gmail_app_password
ADMIN_EMAIL=admin@theipm.in
ADMIN_PASSWORD=Admin@IPM2024
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Indore Property Management
VITE_WHATSAPP_NUMBER=9009444491
```

---

## 📧 Gmail App Password Kaise Banayein

1. Gmail kholo → Settings → Google Account
2. Security → 2-Step Verification ON karo
3. Security → App Passwords
4. App: "Mail", Device: "Other" → "IPM Server" likho
5. Generate karo → 16 digit password milega
6. Woh password `SMTP_PASS` mein daalo

---

## ☁️ MongoDB Atlas Setup

1. [mongodb.com/atlas](https://mongodb.com/atlas) pe free account banao
2. New Cluster banao (M0 Free tier)
3. Database Access → New User banao (username + password)
4. Network Access → `0.0.0.0/0` add karo (sab IPs allow)
5. Connect → Drivers → Connection string copy karo
6. `<password>` ki jagah apna password daalo
7. `.env` mein `MONGO_URI` mein paste karo

---

## ☁️ Cloudinary Setup

1. [cloudinary.com](https://cloudinary.com) pe free account banao
2. Dashboard pe `Cloud Name`, `API Key`, `API Secret` milega
3. Teeno `.env` mein daalo

---

## 🔐 Security Features

- JWT tokens (7 din expiry)
- Passwords bcrypt se hash (12 rounds)
- Rate limiting: 100 req/15min (API), 10 req/15min (auth)
- CORS: sirf allowed origins
- Helmet security headers
- HTTP-only cookies
- Role-based access control (admin/agent/user)

---

## 🏗️ Production Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Vercel pe deploy karo
# Environment variables Vercel dashboard mein daalo:
# VITE_API_URL=https://api.theipm.in/api
```

### Backend → Railway / Render
```bash
# Railway ya Render pe Node.js service banao
# Root directory: backend/
# Start command: node index.js
# Saare .env variables dashboard mein daalo
```

---

## 🐛 Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| `Cannot connect to MongoDB` | MONGO_URI check karo, Network Access mein IP whitelist karo |
| `CORS error` | Backend `.env` mein `CLIENT_URL` sahi set karo |
| `Images not uploading` | Cloudinary credentials check karo |
| `Email not sending` | Gmail App Password check karo, 2FA ON karo |
| `Login not working` | `npm run seed` dobara chalao |
| `Routes not found (404)` | `npm run dev` se Vite restart karo (route tree regenerate hoga) |
| `Token expired` | Logout karke dobara login karo |

---

## 📦 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 19 + TypeScript |
| Routing | TanStack Router (file-based) |
| State Management | Zustand + React Query |
| Styling | Tailwind CSS v4 |
| UI Components | Shadcn/ui (Radix UI) |
| HTTP Client | Axios |
| Forms | React Hook Form + Zod |
| Build Tool | Vite |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcryptjs |
| File Upload | Multer + Cloudinary |
| Email | Nodemailer (Gmail SMTP) |
| Security | Helmet + CORS + Rate Limiting |

---

## ✅ Kya Ready Hai

- [x] Public website (Home, Properties, Property Detail)
- [x] Search & Filter system
- [x] Contact/Inquiry form
- [x] Admin Dashboard
- [x] Admin Properties management
- [x] Admin Inquiries CRM
- [x] Admin Users management
- [x] Admin Analytics
- [x] Agent Portal
- [x] Agent Property listing
- [x] Add New Property (with image upload)
- [x] Agent Inquiries management
- [x] JWT Authentication
- [x] Password Reset (email)
- [x] Email notifications (new inquiry)
- [x] Cloudinary image upload + optimization
- [x] Database seed (sample data)

## ⏳ Aage Kya Karna Hai

- [ ] Property Edit page (agent/admin)
- [ ] EMI Calculator
- [ ] Virtual Tour integration
- [ ] Blog/CMS
- [ ] Redis caching
- [ ] Next.js migration (SSR for SEO)
- [ ] PWA support
- [ ] Automated tests (Jest + Cypress)
- [ ] Sitemap generation

---

*Last Updated: 2024 | Version: 2.0 | Stack: MERN Premium*
