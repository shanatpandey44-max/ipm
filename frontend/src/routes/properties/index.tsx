import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, MapPin, Grid3X3, List } from "lucide-react";
import { useProperties } from "@/hooks/useApi";
import { useFilterStore } from "@/stores/filterStore";
import { PropertyCard } from "@/components/site/PropertyCard";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { CityName, PropertyType } from "@/lib/types";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/properties/")({
  component: PropertiesPage,
  head: () => ({
    meta: [
      { title: "Properties — Indore Property Management" },
      { name: "description", content: "Browse all properties in Indore, Ujjain, Dewas and Bhopal." },
    ],
  }),
});

const CITIES: CityName[] = ["Indore", "Ujjain", "Dewas", "Bhopal"];
const TYPES: PropertyType[] = ["Residential", "Commercial", "Plot"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

function PropertiesPage() {
  const { filters, setFilter, setFilters, resetFilters } = useFilterStore();
  const { data, isLoading, isFetching } = useProperties(filters);
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 20000000]);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setFilter("search", searchInput);
    }, 400);
    return () => clearTimeout(searchTimeout.current);
  }, [searchInput]);

  const activeFilterCount = [
    filters.city, filters.type, filters.status,
    filters.minPrice, filters.maxPrice, filters.bedrooms,
  ].filter(Boolean).length;

  const properties = data?.properties ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;
  const currentPage = filters.page ?? 1;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Toaster richColors position="top-center" />

      {/* Page Hero */}
      <div className="relative bg-brand-ink pt-28 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(0,163,224,0.15),transparent)]" />
        <div className="container-page relative text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 mb-4">
            <MapPin className="h-3 w-3 text-brand" />
            All Properties
          </div>
          <h1 className="font-display text-4xl font-medium text-white md:text-5xl">
            Find Your <span className="text-gradient-gold italic">Dream Property</span>
          </h1>
          <p className="mt-3 text-white/60 max-w-xl mx-auto">
            {total > 0 ? `${total} properties across Indore, Ujjain, Dewas & Bhopal` : "Browse our curated portfolio"}
          </p>
        </div>
      </div>

      <div className="container-page py-10">
        {/* Search + Controls Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, location..."
              className="pl-9 h-11 rounded-xl border-hairline"
            />
            {searchInput && (
              <button onClick={() => { setSearchInput(""); setFilter("search", ""); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Filter toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`gap-2 rounded-xl h-11 border-hairline ${showFilters ? "bg-brand text-white border-brand" : ""}`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 grid h-5 w-5 place-items-center rounded-full bg-white text-brand text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {/* Sort */}
            <Select value={filters.sort} onValueChange={(v) => setFilter("sort", v as typeof filters.sort)}>
              <SelectTrigger className="h-11 w-44 rounded-xl border-hairline">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View mode */}
            <div className="hidden sm:flex items-center rounded-xl border border-hairline overflow-hidden">
              <button onClick={() => setViewMode("grid")}
                className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-brand text-white" : "text-muted-foreground hover:bg-surface"}`}>
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button onClick={() => setViewMode("list")}
                className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-brand text-white" : "text-muted-foreground hover:bg-surface"}`}>
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-6 rounded-2xl border border-hairline bg-surface p-5 shadow-soft">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* City */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">City</label>
                <Select value={filters.city || ""} onValueChange={(v) => setFilter("city", v as CityName | "")}>
                  <SelectTrigger className="h-10 rounded-xl border-hairline bg-background">
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Cities</SelectItem>
                    {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Type */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Type</label>
                <Select value={filters.type || ""} onValueChange={(v) => setFilter("type", v as PropertyType | "")}>
                  <SelectTrigger className="h-10 rounded-xl border-hairline bg-background">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Status</label>
                <Select value={filters.status || ""} onValueChange={(v) => setFilter("status", v as typeof filters.status)}>
                  <SelectTrigger className="h-10 rounded-xl border-hairline bg-background">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="For Sale">For Sale</SelectItem>
                    <SelectItem value="For Rent">For Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bedrooms */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Bedrooms</label>
                <Select value={String(filters.bedrooms || "")} onValueChange={(v) => setFilter("bedrooms", v ? Number(v) : "")}>
                  <SelectTrigger className="h-10 rounded-xl border-hairline bg-background">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    {[1, 2, 3, 4].map((n) => <SelectItem key={n} value={String(n)}>{n} BHK</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Price Range: ₹{(priceRange[0] / 100000).toFixed(0)}L — ₹{(priceRange[1] / 100000).toFixed(0)}L
                </label>
                <Slider
                  min={0} max={20000000} step={500000}
                  value={priceRange}
                  onValueChange={(v) => setPriceRange(v)}
                  onValueCommit={(v) => setFilters({ minPrice: v[0] || "", maxPrice: v[1] || "" })}
                  className="mt-2"
                />
              </div>

              {/* Reset */}
              <div className="flex items-end sm:col-span-2 lg:col-span-2">
                <Button variant="outline" onClick={() => { resetFilters(); setSearchInput(""); setPriceRange([0, 20000000]); }}
                  className="gap-2 rounded-xl border-hairline text-muted-foreground hover:text-brand-ink">
                  <X className="h-4 w-4" />
                  Reset All Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {filters.city && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft border border-brand/20 px-3 py-1 text-xs font-semibold text-brand">
                {filters.city}
                <button onClick={() => setFilter("city", "")}><X className="h-3 w-3" /></button>
              </span>
            )}
            {filters.type && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft border border-brand/20 px-3 py-1 text-xs font-semibold text-brand">
                {filters.type}
                <button onClick={() => setFilter("type", "")}><X className="h-3 w-3" /></button>
              </span>
            )}
            {filters.bedrooms && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft border border-brand/20 px-3 py-1 text-xs font-semibold text-brand">
                {filters.bedrooms} BHK
                <button onClick={() => setFilter("bedrooms", "")}><X className="h-3 w-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading..." : `Showing ${properties.length} of ${total} properties`}
          </p>
          {isFetching && !isLoading && (
            <span className="text-xs text-brand animate-pulse">Updating...</span>
          )}
        </div>

        {/* Property Grid */}
        {isLoading ? (
          <div className={`grid gap-6 ${viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-surface animate-pulse" style={{ height: 360 }} />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-surface mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold text-brand-ink">No properties found</h3>
            <p className="mt-2 text-muted-foreground">Try adjusting your filters or search terms</p>
            <Button onClick={() => { resetFilters(); setSearchInput(""); }} className="mt-5 rounded-full bg-brand text-white">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-3xl"}`}>
            {properties.map((p, i) => (
              <Link key={p._id} to="/properties/$slug" params={{ slug: p.slug }}>
                <PropertyCard p={p} index={i} />
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setFilter("page", currentPage - 1)}
              className="rounded-xl border-hairline gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setFilter("page", p)}
                    className={`h-9 w-9 rounded-xl text-sm font-semibold transition-colors ${
                      p === currentPage
                        ? "bg-brand text-white shadow-[0_4px_12px_rgba(0,163,224,0.35)]"
                        : "text-muted-foreground hover:bg-surface border border-hairline"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              disabled={currentPage >= pages}
              onClick={() => setFilter("page", currentPage + 1)}
              className="rounded-xl border-hairline gap-1"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
