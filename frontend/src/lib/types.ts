// ── User ─────────────────────────────────────────────────
export type UserRole = "user" | "agent" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: { public_id?: string; url: string };
  favorites?: string[];
  isActive: boolean;
  createdAt: string;
}

// ── Property ─────────────────────────────────────────────
export type PropertyType = "Residential" | "Commercial" | "Plot";
export type PropertyStatus = "For Sale" | "For Rent" | "Sold" | "Rented";
export type PropertyLabel = "New Launch" | "Featured" | "Hot Deal" | "Reduced Price" | "";
export type CityName = "Indore" | "Ujjain" | "Dewas" | "Bhopal";

export interface PropertyImage {
  public_id?: string;
  url: string;
  caption?: string;
  isPrimary?: boolean;
}

export interface Property {
  _id: string;
  title: string;
  slug: string;
  description: string;
  type: PropertyType;
  subType?: string;
  status: PropertyStatus;
  label?: PropertyLabel;
  price: {
    amount: number;
    unit: "total" | "per_sqft" | "per_month";
    negotiable?: boolean;
    displayPrice?: string;
  };
  location: {
    address: string;
    locality?: string;
    city: CityName;
    state?: string;
    pincode?: string;
    coordinates?: { lat: number; lng: number };
    mapEmbedUrl?: string;
  };
  size: {
    area?: number;
    areaUnit?: string;
    displaySize?: string;
    length?: number;
    width?: number;
  };
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  parking?: number;
  floors?: number;
  totalFloors?: number;
  facing?: string;
  furnishing?: string;
  possessionStatus?: string;
  possessionDate?: string;
  yearBuilt?: number;
  reraNumber?: string;
  amenities?: string[];
  images: PropertyImage[];
  videoUrl?: string;
  virtualTourUrl?: string;
  floorPlanUrl?: string;
  agent?: Pick<User, "_id" | "name" | "phone" | "avatar">;
  metaTitle?: string;
  metaDescription?: string;
  views?: number;
  inquiries?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Inquiry ───────────────────────────────────────────────
export type InquiryStatus =
  | "new"
  | "contacted"
  | "site_visit_scheduled"
  | "negotiating"
  | "converted"
  | "lost";

export interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  inquiryType?: string;
  propertyType?: string;
  city?: string;
  budget?: { min?: number; max?: number };
  message?: string;
  property?: Pick<Property, "_id" | "title" | "slug">;
  source?: string;
  status: InquiryStatus;
  assignedTo?: Pick<User, "_id" | "name" | "email">;
  notes?: { text: string; addedBy: Pick<User, "_id" | "name">; addedAt: string }[];
  followUpDate?: string;
  isRead: boolean;
  createdAt: string;
}

// ── City ─────────────────────────────────────────────────
export interface City {
  _id: string;
  name: CityName;
  slug: string;
  description?: string;
  shortDescription?: string;
  image?: { url: string };
  highlights?: string[];
  propertyCount?: number;
  isActive: boolean;
  order: number;
}

// ── Testimonial ───────────────────────────────────────────
export interface Testimonial {
  _id: string;
  name: string;
  role?: string;
  location?: string;
  avatar?: { url: string };
  quote: string;
  rating: number;
  isActive: boolean;
  order: number;
}

// ── API Response wrappers ─────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  total: number;
  page: number;
  pages: number;
  count: number;
  properties?: T[];
  inquiries?: T[];
}

// ── Filter / Search params ────────────────────────────────
export interface PropertyFilters {
  city?: CityName | "";
  type?: PropertyType | "";
  status?: PropertyStatus | "";
  subType?: string;
  minPrice?: number | "";
  maxPrice?: number | "";
  bedrooms?: number | "";
  furnishing?: string;
  possessionStatus?: string;
  label?: string;
  search?: string;
  sort?: "newest" | "oldest" | "price_low" | "price_high" | "popular";
  page?: number;
  limit?: number;
  featured?: boolean;
}
