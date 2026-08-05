import { useEffect, useRef } from "react";
import { pillars } from "@/content/home";
import { CheckCircle2, Award, Users, TrendingUp } from "lucide-react";

const ICONS = [Award, Users, TrendingUp];

const STATS = [
  { value: "500+", label: "Happy Clients" },
  { value: "10+", label: "Projects" },
  { value: "4", label: "Cities" },
  { value: "8+", label: "Years Experience" },
];

export function WhyChoose() {
  const sectionRef = useRef<HTMLElement>(null);

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
    <section ref={sectionRef} id="why" className="relative py-24 md:py-32 bg-gradient-to-b from-surface/50 to-background overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,163,224,0.04),transparent)] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-px h-64 bg-gradient-to-b from-transparent via-brand/20 to-transparent" />
      <div className="absolute top-1/2 right-0 w-px h-64 bg-gradient-to-b from-transparent via-brand/20 to-transparent" />

      <div className="container-page relative">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_1.6fr] lg:gap-20">
          {/* Left sticky */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="section-reveal inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Why IPM
            </div>
            <h2 className="section-reveal stagger-1 mt-4 font-display text-[clamp(1.75rem,4vw,3rem)] font-medium leading-tight">
              Why Indore Property Management is the{" "}
              <span className="text-gradient">perfect choice?</span>
            </h2>
            <p className="section-reveal stagger-2 mt-4 text-base text-muted-foreground leading-relaxed">
              Every relationship we build is grounded in trust, transparency, and deep local expertise.
            </p>

            {/* Mini stats */}
            <div className="section-reveal stagger-3 mt-8 grid grid-cols-2 gap-3">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-hairline bg-card p-4 text-center shadow-soft hover:shadow-lift hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="font-display text-2xl font-semibold text-brand">{s.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Trust badge */}
            <div className="section-reveal stagger-4 mt-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <CheckCircle2 className="h-8 w-8 shrink-0 text-emerald-500" />
              <div>
                <div className="text-sm font-semibold text-emerald-800">RERA Registered</div>
                <div className="text-xs text-emerald-600">All properties legally verified</div>
              </div>
            </div>
          </div>

          {/* Right pillars */}
          <ol className="space-y-5">
            {pillars.map((p, i) => {
              const Icon = ICONS[i];
              return (
                <li
                  key={p.n}
                  className="section-reveal shimmer-card group relative grid gap-6 rounded-2xl border border-hairline bg-card p-6 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(11,37,69,0.1)] hover:-translate-y-1 sm:grid-cols-[auto_1fr] sm:p-8 luxury-border"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  {/* Number + Icon */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand/10 to-brand/5 transition-all duration-300 group-hover:from-brand group-hover:to-[#0077b6] group-hover:shadow-[0_8px_25px_rgba(0,163,224,0.4)]">
                      <Icon className="h-6 w-6 text-brand transition-colors group-hover:text-white" />
                    </div>
                    <span className="font-display text-4xl font-bold leading-none text-brand/15 transition-colors group-hover:text-brand/30 sm:text-5xl">
                      {p.n}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-display text-xl font-semibold text-brand-ink sm:text-2xl group-hover:text-brand transition-colors duration-300">
                      {p.title}
                    </h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">{p.body}</p>
                    <div className="mt-4 h-0.5 w-0 bg-gradient-to-r from-brand to-transparent group-hover:w-full transition-all duration-500" />
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-brand/20 group-hover:bg-brand transition-colors duration-300" />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
