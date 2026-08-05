import { Search, MapPin, Home } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CITIES = ["Indore", "Ujjain", "Dewas", "Bhopal"];
const TYPES = ["Residential", "Plot", "Commercial"];
const QUICK_TAGS = ["Ready to Move", "Under ₹50L", "Near Highway", "RERA Approved", "Premium"];

export function SearchCard() {
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("search", keyword);
    if (city && city !== "all") params.set("city", city);
    if (type && type !== "all") params.set("type", type);
    window.location.href = `/properties?${params.toString()}`;
  };

  return (
    <div className="rounded-2xl bg-white shadow-[0_24px_64px_rgba(0,0,0,0.28)] overflow-hidden">
      {/* Header strip */}
      <div className="bg-brand px-5 py-3 flex items-center gap-2">
        <Search className="h-4 w-4 text-white/80" />
        <span className="text-sm font-semibold text-white tracking-wide">Search Properties</span>
      </div>

      <form onSubmit={handleSearch} className="p-4 sm:p-5">
        {/* Fields row */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_160px_160px_auto]">

          {/* Keyword */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              <Search className="h-3 w-3" />
              What are you looking for?
            </label>
            <div className="relative">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Project name, locality, area..."
                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-4 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
              />
            </div>
          </div>

          {/* City */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              <MapPin className="h-3 w-3" />
              City
            </label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="h-11 rounded-lg border-slate-200 bg-slate-50 text-sm text-slate-700 focus:border-brand focus:ring-2 focus:ring-brand/20 data-[placeholder]:text-slate-400">
                <SelectValue placeholder="All cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              <Home className="h-3 w-3" />
              Type
            </label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-11 rounded-lg border-slate-200 bg-slate-50 text-sm text-slate-700 focus:border-brand focus:ring-2 focus:ring-brand/20 data-[placeholder]:text-slate-400">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-transparent select-none hidden lg:block">_</span>
            <button
              type="submit"
              className="h-11 w-full rounded-lg bg-brand px-6 text-sm font-bold text-white shadow-md shadow-brand/30 transition-all hover:bg-brand/90 hover:shadow-brand/50 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        </div>

        {/* Quick tags */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Quick:</span>
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setKeyword(tag)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 hover:border-brand hover:text-brand hover:bg-brand/5 transition-all duration-150"
            >
              {tag}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
