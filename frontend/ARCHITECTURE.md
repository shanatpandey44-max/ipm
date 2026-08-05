# Indore Property Management - Architecture Documentation

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (React + TypeScript)              │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────────┐  │
│  │   Routes    │  │ Components  │  │   State Mgmt      │  │
│  │ - /         │  │ - Site      │  │ - Zustand Stores  │  │
│  │ - /properties│  │ - UI       │  │ - React Query     │  │
│  │ - /properties/│  │ - Forms    │  │ - Local Storage  │  │
│  │   :slug     │  │ - Cards     │  │                   │  │
│  └─────────────┘  └─────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY (Express.js)                 │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────────┐  │
│  │   Auth      │  │ Properties  │  │   Inquiries       │  │
│  │ - JWT       │  │ - CRUD      │  │ - Lead Mgmt       │  │
│  │ - Roles     │  │ - Search    │  │ - CRM             │  │
│  │ - Sessions  │  │ - Filters   │  │ - Assignments     │  │
│  └─────────────┘  └─────────────┘  └───────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────────┐  │
│  │   Admin     │  │   Content   │  │   Uploads         │  │
│  │ - Dashboard │  │ - Cities    │  │ - Cloudinary      │  │
│  │ - Users     │  │ - Testimonials│ │ - Multer         │  │
│  │ - Analytics │  │ - SEO       │  │ - Optimization    │  │
│  └─────────────┘  └─────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB Atlas)                 │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────────┐  │
│  │   Users     │  │ Properties  │  │   Inquiries       │  │
│  │ - Admins    │  │ - Listings  │  │ - Leads           │  │
│  │ - Agents    │  │ - Media     │  │ - CRM Data        │  │
│  │ - Customers │  │ - Metadata  │  │ - Follow-ups      │  │
│  └─────────────┘  └─────────────┘  └───────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐                         │
│  │   Cities    │  │ Testimonials│                         │
│  │ - SEO Pages │  │ - Reviews   │                         │
│  │ - Stats     │  │ - Ratings   │                         │
│  └─────────────┘  └─────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

### **Frontend (`/src`)**
```
src/
├── components/
│   ├── site/           # Page-specific components
│   │   ├── Hero.tsx
│   │   ├── PropertiesSection.tsx
│   │   ├── PropertyCard.tsx
│   │   ├── CitiesSection.tsx
│   │   ├── Testimonials.tsx
│   │   ├── WhyChoose.tsx
│   │   ├── InquiryForm.tsx
│   │   ├── SiteHeader.tsx
│   │   ├── SiteFooter.tsx
│   │   └── SearchCard.tsx
│   └── ui/             # Reusable UI components (Shadcn)
│       ├── button.tsx
│       ├── input.tsx
│       ├── select.tsx
│       └── ... (30+ components)
├── routes/
│   ├── __root.tsx      # Root layout with QueryClient
│   ├── index.tsx       # Home page
│   └── properties/
│       ├── index.tsx   # Property listing
│       └── $slug.tsx   # Property detail
├── stores/
│   ├── authStore.ts    # Authentication state
│   └── filterStore.ts  # Property filters
├── hooks/
│   └── useApi.ts       # React Query hooks
├── lib/
│   ├── api.ts          # Axios instance
│   ├── types.ts        # TypeScript interfaces
│   └── utils.ts        # Utility functions
└── content/
    └── home.ts         # Static content
```

### **Backend (`/server`)**
```
server/
├── models/
│   ├── User.js         # Admin, Agent, User
│   ├── Property.js     # Complete property schema
│   ├── Inquiry.js      # Lead management
│   ├── City.js         # City pages
│   └── Testimonial.js  # Client reviews
├── controllers/
│   ├── authController.js
│   ├── propertyController.js
│   ├── inquiryController.js
│   └── adminController.js
├── routes/
│   ├── auth.js
│   ├── properties.js
│   ├── inquiries.js
│   ├── admin.js
│   └── content.js
├── middleware/
│   ├── auth.js         # JWT protection
│   ├── error.js        # Global error handler
│   └── upload.js       # File upload (Cloudinary)
├── config/
│   └── db.js           # MongoDB connection
├── utils/
│   └── seed.js         # Database seeder
└── index.js            # Express server entry
```

---

## 🔧 Technology Stack

### **Frontend**
- **Framework**: React 19 + TypeScript
- **Routing**: TanStack Router (file-based)
- **State Management**: Zustand + React Query
- **Styling**: Tailwind CSS v4 + Custom animations
- **UI Components**: Shadcn/ui (Radix UI based)
- **HTTP Client**: Axios with interceptors
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner toast
- **Icons**: Lucide React
- **Build Tool**: Vite

### **Backend**
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB Atlas (cloud)
- **ORM**: Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer + Cloudinary
- **Security**: Helmet, CORS, rate limiting
- **Validation**: Express Validator
- **Logging**: Morgan (dev only)
- **Environment**: dotenv

### **DevOps**
- **Package Manager**: npm
- **Type Checking**: TypeScript
- **Linting**: ESLint + Prettier
- **Hot Reload**: Nodemon (backend), Vite (frontend)
- **Deployment**: Vercel (frontend), Railway/Render (backend)

---

## 🗄️ Database Schema

### **User Model**
```javascript
{
  name: String,           // Full name
  email: String,          // Unique, lowercase
  phone: String,          // Indian format
  password: String,       // Hashed, select: false
  role: ["user","agent","admin"],
  avatar: { public_id, url },
  favorites: [Property._id],
  isActive: Boolean,
  createdAt: Date
}
```

### **Property Model**
```javascript
{
  title: String,          // Property title
  slug: String,           // Auto-generated
  type: ["Residential","Commercial","Plot"],
  subType: String,        // "2 BHK", "Office", etc.
  status: ["For Sale","For Rent","Sold"],
  price: {
    amount: Number,       // In rupees
    unit: ["total","per_sqft","per_month"],
    negotiable: Boolean,
    displayPrice: String  // "₹85L - ₹1.2Cr"
  },
  location: {
    address: String,
    city: ["Indore","Ujjain","Dewas","Bhopal"],
    coordinates: { lat, lng }
  },
  size: {
    area: Number,         // sq ft
    displaySize: String   // "1279–1865 sq. ft."
  },
  bedrooms: Number,
  bathrooms: Number,
  amenities: [String],    // ["Swimming Pool","Gym",...]
  images: [{
    url: String,
    isPrimary: Boolean
  }],
  agent: User._id,
  views: Number,
  inquiries: Number,
  isFeatured: Boolean,
  isActive: Boolean
}
```

### **Inquiry Model (CRM)**
```javascript
{
  name: String,
  email: String,
  phone: String,
  inquiryType: ["Purchase","Rent","Sell","Evaluation"],
  property: Property._id, // Optional
  status: ["new","contacted","site_visit","converted","lost"],
  assignedTo: User._id,   // Agent
  notes: [{
    text: String,
    addedBy: User._id,
    addedAt: Date
  }],
  followUpDate: Date,
  isRead: Boolean,
  source: ["website_form","property_page","whatsapp","phone"]
}
```

---

## 🔐 Authentication & Authorization

### **JWT Flow**
1. User registers → JWT token generated
2. Token stored in HTTP-only cookie
3. Each request includes token in Authorization header
4. Middleware validates token and attaches user to request
5. Role-based access control (admin, agent, user)

### **Role Permissions**
- **Admin**: Full access (users, properties, inquiries, analytics)
- **Agent**: Create/update own properties, view assigned inquiries
- **User**: Browse properties, save favorites, submit inquiries

### **Security Features**
- Password hashing with bcrypt (12 rounds)
- Rate limiting (100 requests/15min, 10 auth attempts/15min)
- CORS configured for specific origins
- Helmet security headers
- XSS protection
- CSRF protection via same-site cookies

---

## 📡 API Endpoints

### **Public Routes**
```
GET    /api/health                    # Server status
GET    /api/properties                # List properties (with filters)
GET    /api/properties/:slug          # Property detail
GET    /api/cities                    # List cities with counts
GET    /api/testimonials              # List testimonials
POST   /api/auth/register             # User registration
POST   /api/auth/login                # User login
POST   /api/inquiries                 # Submit inquiry
```

### **Protected Routes (User)**
```
GET    /api/auth/me                   # Get current user
PUT    /api/auth/update-profile       # Update profile
PUT    /api/auth/change-password      # Change password
PUT    /api/auth/favorites/:id        # Toggle favorite
GET    /api/auth/logout               # Logout
```

### **Protected Routes (Agent)**
```
POST   /api/properties                # Create property
PUT    /api/properties/:id            # Update own property
GET    /api/inquiries                 # View assigned inquiries
PUT    /api/inquiries/:id             # Update inquiry status
```

### **Protected Routes (Admin)**
```
GET    /api/admin/dashboard           # Dashboard stats
GET    /api/admin/users               # List all users
POST   /api/admin/users/agent         # Create agent account
PUT    /api/admin/users/:id           # Update user role/status
DELETE /api/properties/:id            # Delete any property
GET    /api/properties/stats          # Property analytics
GET    /api/inquiries/stats           # Inquiry analytics
```

---

## 🚀 Deployment Architecture

### **Development**
```
Local Machine → MongoDB Atlas (Development Cluster) → Cloudinary
```

### **Production**
```
Frontend (Vercel)
    ↓
Backend (Railway/Render) → MongoDB Atlas (Production Cluster) → Cloudinary
    ↓
CDN (Cloudflare) ← Static Assets
```

### **Environment Variables**
```bash
# Backend (.env)
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/theipm
JWT_SECRET=super_secret_key_change_in_production
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend (.env)
VITE_API_URL=https://api.theipm.in
VITE_APP_NAME=Indore Property Management
```

---

## 🔄 Data Flow

### **Property Search Flow**
1. User applies filters → `useFilterStore` updates
2. React Query fetches → `/api/properties?city=Indore&type=Residential`
3. MongoDB query with indexes → Fast response
4. Results cached for 2 minutes → Better UX
5. Pagination handled server-side → Efficient loading

### **Inquiry Submission Flow**
1. User fills form → Form validation
2. POST to `/api/inquiries` → Creates inquiry record
3. If propertyId provided → Increments property.inquiries
4. Admin/Agent notified → CRM dashboard updates
5. Follow-up system → Status tracking

### **Image Upload Flow**
1. User selects images → Multer validation (5MB, images only)
2. Buffer uploaded to Cloudinary → Automatic optimization
3. Cloudinary returns URLs → Stored in property.images
4. Frontend displays → Lazy loading, WebP format

---

## 📊 Performance Optimizations

### **Frontend**
- Code splitting with Vite
- Lazy loading images
- React Query caching
- Tailwind CSS purging
- Bundle size optimization

### **Backend**
- MongoDB indexing (city, type, price, slug)
- Redis caching (planned Phase 4)
- Connection pooling
- Query optimization
- Rate limiting

### **Database**
- Compound indexes for common queries
- Text indexes for search
- TTL indexes for session data
- Aggregation pipelines for analytics

---

## 🔒 Security Implementation

### **Authentication**
- JWT with 7-day expiry
- HTTP-only cookies
- Token refresh mechanism
- Password strength validation

### **Authorization**
- Role-based middleware
- Resource ownership checks
- API key validation (future)
- IP whitelisting (admin)

### **Data Protection**
- Input sanitization
- XSS prevention
- SQL injection protection (Mongoose)
- File upload validation
- GDPR compliance (inquiry forms)

### **Infrastructure**
- HTTPS enforcement
- Security headers
- Regular dependency updates
- Audit logging

---

## 📈 Scalability Considerations

### **Horizontal Scaling**
- Stateless API servers
- MongoDB sharding ready
- CDN for static assets
- Load balancer ready

### **Database Scaling**
- Read replicas for analytics
- Connection pooling
- Index optimization
- Aggregation caching

### **Caching Strategy**
- Redis for property listings
- CDN for images
- Browser caching for static assets
- API response caching

---

## 🧪 Testing Strategy

### **Unit Tests** (Planned Phase 5)
- Jest for backend
- React Testing Library for frontend
- MongoDB in-memory for tests

### **Integration Tests**
- API endpoint testing
- Database interaction tests
- Authentication flow tests

### **E2E Tests**
- Cypress for critical user flows
- Property search flow
- Inquiry submission flow
- Admin dashboard flow

---

## 📱 Mobile Responsiveness

### **Breakpoints**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### **Mobile Features**
- Touch-friendly UI
- Accelerated mobile pages
- PWA ready (Phase 6)
- Offline capabilities (cached properties)

---

## 🔍 SEO Implementation

### **Technical SEO**
- Server-side rendering ready (Next.js migration Phase 4)
- Dynamic sitemap generation
- Schema.org structured data
- Meta tags per page
- Canonical URLs

### **Content SEO**
- City pages with unique content
- Property pages with rich metadata
- Blog integration (Phase 3)
- Internal linking strategy

---

## 📊 Analytics & Monitoring

### **User Analytics**
- Property views tracking
- Inquiry source tracking
- User behavior analytics
- Conversion funnel

### **System Monitoring**
- API health monitoring
- Error tracking (Sentry integration)
- Performance metrics
- Uptime monitoring

---

## 🚨 Error Handling

### **Frontend**
- React Error Boundaries
- Graceful loading states
- User-friendly error messages
- Retry mechanisms

### **Backend**
- Global error middleware
- Structured error responses
- Logging with context
- Alerting system

---

## 📄 Documentation

### **API Documentation**
- OpenAPI/Swagger (planned)
- Postman collection
- Example requests/responses

### **Developer Documentation**
- Setup instructions
- Architecture decisions
- Deployment guide
- Troubleshooting guide

---

## 🔄 CI/CD Pipeline

### **Development**
- Pre-commit hooks (linting)
- Automated testing
- Build verification

### **Production**
- Automated deployments
- Rollback capability
- Environment parity
- Backup procedures

---

## 📅 Phase Completion Status

### **✅ Phase 1 — Foundation (COMPLETE)**
- MongoDB schema design
- Express API with auth
- React frontend setup
- Database seeder

### **✅ Phase 2 — Core Property Features (COMPLETE)**
- Property listing with filters
- Property detail pages
- Advanced search
- Favorites system
- WhatsApp integration

### **🔄 Phase 3 — Premium Features (NEXT)**
- Agent portal
- Lead management system
- EMI calculator
- Virtual tours
- Blog CMS

### **⏳ Phase 4 — SEO + Performance**
- SSR with Next.js
- Dynamic sitemaps
- Redis caching
- Image optimization

### **⏳ Phase 5 — Analytics + Admin**
- Admin dashboard
- Property analytics
- User behavior tracking
- Monthly reports

### **⏳ Phase 6 — Mobile PWA + Deployment**
- Progressive Web App
- Push notifications
- AWS/Vercel deployment
- Performance audit

---

## 🎯 Success Metrics

### **Performance**
- Page load < 1 second
- API response < 200ms
- 99.9% uptime
- Mobile score > 90

### **Business**
- Lead conversion > 20%
- User retention > 30 days
- Property views > 1000/month
- Inquiry response < 24 hours

### **Technical**
- Zero critical security issues
- < 1% error rate
- Automated test coverage > 80%
- Documentation completeness

---

## 👥 Team & Responsibilities

### **Backend Developer**
- API development
- Database design
- Authentication
- Security implementation

### **Frontend Developer**
- UI/UX implementation
- State management
- Performance optimization
- Mobile responsiveness

### **DevOps Engineer**
- Deployment pipeline
- Monitoring setup
- Security hardening
- Scaling infrastructure

### **QA Engineer**
- Testing strategy
- Bug tracking
- Performance testing
- User acceptance testing

---

## 📞 Support & Maintenance

### **Support Channels**
- Email: support@theipm.in
- Phone: 9009444491
- WhatsApp: +91 9009444491
- Documentation: docs.theipm.in

### **Maintenance Schedule**
- Weekly backups
- Monthly security updates
- Quarterly performance reviews
- Annual architecture review

---

## 🔗 Useful Links

- **Live Site**: https://theipm.in
- **API Docs**: https://api.theipm.in/docs
- **GitHub**: https://github.com/ipm/indore-property-management
- **Admin Panel**: https://admin.theipm.in
- **Status Page**: https://status.theipm.in

---

*Last Updated: December 2024*  
*Version: 2.0*  
*Architecture Version: MERN Premium Edition*
