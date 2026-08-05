import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Property, PropertyFilters, City, Testimonial, PaginatedResponse } from "@/lib/types";

// ── Query Keys ────────────────────────────────────────────
export const KEYS = {
  properties: (filters?: PropertyFilters) => ["properties", filters] as const,
  property: (slug: string) => ["property", slug] as const,
  cities: () => ["cities"] as const,
  city: (slug: string) => ["city", slug] as const,
  testimonials: () => ["testimonials"] as const,
  inquiryStats: () => ["inquiry-stats"] as const,
  propertyStats: () => ["property-stats"] as const,
  dashboard: () => ["dashboard"] as const,
};

// ── Properties ────────────────────────────────────────────

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: KEYS.properties(filters),
    queryFn: async () => {
      // Remove empty string values
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== "" && v !== undefined)
      );
      const { data } = await api.get<PaginatedResponse<Property>>("/properties", { params });
      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    placeholderData: (prev) => prev,
  });
}

export function useFeaturedProperties() {
  return useQuery({
    queryKey: KEYS.properties({ featured: true, limit: 6 }),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Property>>("/properties", {
        params: { featured: true, limit: 6 },
      });
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useProperty(slug: string) {
  return useQuery({
    queryKey: KEYS.property(slug),
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; property: Property; related: Property[] }>(
        `/properties/${slug}`
      );
      return data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

// ── Cities ────────────────────────────────────────────────

export function useCities() {
  return useQuery({
    queryKey: KEYS.cities(),
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; cities: City[] }>("/cities");
      return data.cities;
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useCity(slug: string) {
  return useQuery({
    queryKey: KEYS.city(slug),
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; city: City }>(`/cities/${slug}`);
      return data.city;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });
}

// ── Testimonials ──────────────────────────────────────────

export function useTestimonials() {
  return useQuery({
    queryKey: KEYS.testimonials(),
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; testimonials: Testimonial[] }>("/testimonials");
      return data.testimonials;
    },
    staleTime: 1000 * 60 * 10,
  });
}

// ── Inquiry Mutation ──────────────────────────────────────

interface InquiryPayload {
  name: string;
  email: string;
  phone: string;
  inquiryType?: string;
  propertyType?: string;
  city?: string;
  message?: string;
  propertyId?: string;
  source?: string;
}

export function useSubmitInquiry() {
  return useMutation({
    mutationFn: async (payload: InquiryPayload) => {
      const { data } = await api.post("/inquiries", payload);
      return data;
    },
  });
}

// ── Admin Stats ───────────────────────────────────────────

export function useDashboard() {
  return useQuery({
    queryKey: KEYS.dashboard(),
    queryFn: async () => {
      const { data } = await api.get("/admin/dashboard");
      return data.dashboard;
    },
    staleTime: 1000 * 60,
  });
}

export function usePropertyStats() {
  return useQuery({
    queryKey: KEYS.propertyStats(),
    queryFn: async () => {
      const { data } = await api.get("/properties/stats");
      return data.stats;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useInquiryStats() {
  return useQuery({
    queryKey: KEYS.inquiryStats(),
    queryFn: async () => {
      const { data } = await api.get("/inquiries/stats");
      return data.stats;
    },
    staleTime: 1000 * 60,
  });
}
