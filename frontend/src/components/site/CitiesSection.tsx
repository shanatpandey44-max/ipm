import { useRef, useEffect } from "react";
import { ArrowUpRight, MapPin, Building2 } from "lucide-react";
import { useCities } from "@/hooks/useApi";
import { cities as staticCities } from "@/content/home";

export function CitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { data: apiCities, isLoading } = useCities();

  const cities = apiCities?.length
    ? apiCities
    : staticCities.map((c, i) => ({
        _id: String(i),
        name: c.name,
        slug: c.name.toLowerCase(),
        image: { url: c.image },
        propertyCount: c.count,
        shortDescription: c.description,
      }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            entry.target.querySelectorAll(".section-reveal").forEach((el, i) =>
              setTimeout(() => el.classList.add("revealed"), i * 80)
            );
        }),
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cities"
      className="relative py-20 md:py-28 bg-gradient-to-b from-surface/40 to-background overflow-hidden"
    >
      {/* subtle bg glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_80%,rgba(0,163,224,0.06),transparent)] pointer-events-none" />

      <div className="container-page relative">
        {/* Heading */}
        <div className="max-w-xl mb-10 md:mb-14">
          <div className="section-reveal inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-brand mb-4">
            <MapPin className="h-3 w-3" />
            Explore Cities
          </div>
          <h2 className="section-reveal stagger-1 font-display text-[clamp(1.75rem,4vw,3rem)] font-medium leading-tight">
            Properties across{" "}
            <span className="text-gradient">4 Cities</span>
          </h2>
          <p className="section-reveal stagger-2 mt-3 text-base text-muted-foreground leading-relaxed">
            Handpicked homes and plots that blend value, location, and lifestyle across Madhya Pradesh.
          </p>
        </div>

        {/* Cards grid */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[420px] rounded-3xl bg-surface animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cities.map((c, i) => {
              const rawUrl = (c.image as any)?.url || (c.image as any);
              const imgSrc = rawUrl?.startsWith("/") ? rawUrl : rawUrl;
              const count = c.propertyCount || 0;
              const desc = (c as any).shortDescription || "Madhya Pradesh";

              return (
                <a
                  key={c._id}
                  href={`/properties?city=${c.name}`}
                  className="section-reveal group relative flex flex-col overflow-hidden rounded-3xl bg-brand-ink cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  style={{
                    height: "420px",
                    transitionDelay: `${i * 0.07}s`,
                  }}
                >
                  {/* Image */}
                  <img
                    src={imgSrc}
                    alt={c.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Shimmer sweep on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                  {/* Top badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 px-3 py-1.5 text-[11px] font-semibold text-white">
                      <Building2 className="h-3 w-3 text-brand" />
                      {count} {count === 1 ? "Property" : "Properties"}
                    </span>
                  </div>

                  {/* Arrow button top-right */}
                  <div className="absolute top-4 right-4">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white transition-all duration-300 group-hover:bg-brand group-hover:border-brand group-hover:shadow-[0_4px_20px_rgba(0,163,224,0.6)] group-hover:scale-110">
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    {/* City name */}
                    <h3 className="font-display text-[2rem] font-semibold text-white leading-none tracking-tight group-hover:text-brand transition-colors duration-300">
                      {c.name}
                    </h3>

                    {/* Description */}
                    <p className="mt-1.5 text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">
                      {desc}
                    </p>

                    {/* Explore label — slides up on hover */}
                    <div className="mt-3 flex items-center gap-1.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="h-px w-5 bg-brand" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-brand">
                        Explore
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
