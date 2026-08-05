import { useEffect, useRef, useState } from "react";
import { PropertyCard } from "./PropertyCard";
import { useProperties } from "@/hooks/useApi";
import { properties as staticProperties } from "@/content/home";
import { ArrowRight, SlidersHorizontal } from "lucide-react";

const TYPES = ["All", "Residential", "Plot", "Commercial"] as const;

export function PropertiesSection() {
  const [filter, setFilter] = useState<string>("All");
  const sectionRef = useRef<HTMLElement>(null);

  const { data, isLoading, isError } = useProperties({
    limit: 6,
    ...(filter !== "All" ? { type: filter as any } : {}),
  });

  // Fallback to static data if API fails
  const apiProperties = data?.properties ?? [];
  const fallback = filter === "All"
    ? staticProperties
    : staticProperties.filter((p) => p.type === filter);
  const properties = isError || (!isLoading && apiProperties.length === 0)
    ? fallback
    : apiProperties;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".section-reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("revealed"), i * 80);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="properties" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-brand/5 blur-2xl pointer-events-none" />

      <div className="container-page relative">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <div className="section-reveal inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Curated Portfolio
            </div>
            <h2 className="section-reveal stagger-1 mt-4 font-display text-[clamp(1.75rem,4vw,3rem)] font-medium leading-tight">
              Our{" "}
              <span className="text-gradient">Premium Properties</span>
            </h2>
            <p className="section-reveal stagger-2 mt-4 text-base text-muted-foreground leading-relaxed">
              Legally verified plots and homes — handpicked for value, location, and lifestyle.
            </p>
          </div>
          <a
            href="/properties"
            className="section-reveal stagger-3 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-5 py-2.5 text-sm font-semibold text-brand hover:bg-brand hover:text-white hover:border-brand transition-all duration-200 shadow-soft"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Filter Tabs */}
        <div className="section-reveal stagger-2 mt-8 flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
                filter === t
                  ? "bg-brand text-white shadow-[0_4px_12px_rgba(0,163,224,0.35)]"
                  : "bg-surface text-muted-foreground hover:bg-brand-soft hover:text-brand-ink border border-hairline"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-surface animate-pulse" style={{ height: 360 }} />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p, i) => (
              <div key={(p as any)._id || (p as any).id} className="section-reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <PropertyCard p={p as any} index={i} />
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="section-reveal mt-14 text-center">
          <div className="inline-flex flex-col items-center gap-4 rounded-3xl border border-hairline bg-surface px-8 py-8 shadow-soft">
            <p className="text-base font-medium text-brand-ink">
              Looking for something specific? Let our experts help you.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-[#0077b6] px-6 py-3 text-sm font-bold text-white shadow-[0_4px_20px_rgba(0,163,224,0.4)] hover:shadow-[0_8px_30px_rgba(0,163,224,0.5)] hover:scale-105 transition-all duration-200"
            >
              Get Free Consultation
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
