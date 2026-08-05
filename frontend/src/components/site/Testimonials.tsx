import { useEffect, useRef } from "react";
import { Quote, Star } from "lucide-react";
import { useTestimonials } from "@/hooks/useApi";
import { testimonials as staticTestimonials } from "@/content/home";

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const { data: apiTestimonials, isLoading, isError } = useTestimonials();

  const testimonials = apiTestimonials?.length
    ? apiTestimonials
    : staticTestimonials.map((t, i) => ({
        _id: String(i),
        name: t.name,
        role: t.role,
        location: t.location,
        avatar: { url: t.avatar },
        rating: t.rating,
        quote: t.quote,
      }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".section-reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("revealed"), i * 100);
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
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface/50 to-background pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,163,224,0.04),transparent)] pointer-events-none" />

      <div className="container-page relative">
        <div className="mx-auto max-w-2xl text-center">
          <div className="section-reveal inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Client Stories
          </div>
          <h2 className="section-reveal stagger-1 mt-4 font-display text-[clamp(1.75rem,4vw,3rem)] font-medium leading-tight">
            What Our <span className="text-gradient">Clients Say</span>
          </h2>
          <p className="section-reveal stagger-2 mt-4 text-base text-muted-foreground">
            Real experiences from real people who trusted us with their property journey.
          </p>
        </div>

        {isLoading ? (
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-surface animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t, i) => (
              <figure
                key={t._id}
                className="section-reveal shimmer-card group relative flex flex-col rounded-2xl bg-card p-6 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(11,37,69,0.12)] luxury-border sm:p-7"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand/15 to-brand/5">
                    <Quote className="h-5 w-5 text-brand" />
                  </div>
                  <div className="flex gap-0.5" aria-label={`${t.rating} star rating`}>
                    {Array.from({ length: t.rating || 5 }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400 transition-transform group-hover:scale-110" style={{ transitionDelay: `${j * 0.05}s` }} />
                    ))}
                  </div>
                </div>

                <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-brand-ink/80">
                  <p className="line-clamp-5 italic">"{t.quote}"</p>
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-3 border-t border-hairline pt-5">
                  <div className="relative">
                    <img
                      src={(t.avatar as any)?.url || t.avatar as any || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=00A3E0&color=fff`}
                      alt={t.name}
                      loading="lazy"
                      className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-brand/20 group-hover:ring-brand/50 transition-all duration-300"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-400 border-2 border-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-bold text-brand-ink">{t.name}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {t.role}{t.location ? ` · ${t.location}` : ""}
                    </div>
                  </div>
                </figcaption>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl" />
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
