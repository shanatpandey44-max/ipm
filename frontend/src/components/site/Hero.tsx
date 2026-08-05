import { useEffect, useRef } from "react";
import { SearchCard } from "./SearchCard";
import { ArrowDown, BadgeCheck, Phone, MessageCircle } from "lucide-react";
import { useFeaturedProperties } from "@/hooks/useApi";

const STATS = [
  { value: "500+", label: "Happy Clients", sub: "Since 2018" },
  { value: "₹200Cr+", label: "Properties Sold", sub: "Trusted & secured" },
  { value: "100%", label: "Legally Verified", sub: "RERA compliant" },
];

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { data: featuredData } = useFeaturedProperties();
  const featuredCount = featuredData?.total || 0;

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      const bg = hero.querySelector<HTMLElement>(".hero-bg-img");
      if (bg) bg.style.transform = `scale(1.08) translate(${x * 0.3}px, ${y * 0.3}px)`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative isolate overflow-hidden min-h-screen flex flex-col"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=2400&q=90"
          alt=""
          className="hero-bg-img h-full w-full object-cover transition-transform duration-700 ease-out scale-105"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-ink/92 via-brand-ink/72 to-[#0a1628]/88" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/95 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,163,224,0.18),transparent)]" />
      </div>

      {/* Decorative orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-brand/5 blur-3xl pointer-events-none animate-float-slow" />
      <div
        className="absolute bottom-1/3 left-1/6 w-64 h-64 rounded-full bg-brand/8 blur-2xl pointer-events-none animate-float"
        style={{ animationDelay: "3s" }}
      />

      {/* Rotating ring — desktop only */}
      <div className="absolute top-20 right-10 w-32 h-32 opacity-10 pointer-events-none hidden lg:block">
        <div className="w-full h-full rounded-full border-2 border-brand animate-rotate-slow" />
        <div
          className="absolute inset-4 rounded-full border border-brand/50 animate-rotate-slow"
          style={{ animationDirection: "reverse", animationDuration: "15s" }}
        />
      </div>

      {/* Main content */}
      <div className="container-page flex flex-col justify-center flex-1 pb-24 pt-36 sm:pt-40 md:pb-32 md:pt-48 lg:pb-40 lg:pt-52">
        <div className="mx-auto max-w-4xl text-center">

          

          {/* Headline */}
          <h1 className="fade-up-delay-1 font-display text-[clamp(2.6rem,7vw,5.5rem)] font-medium leading-[1.05] tracking-tight text-white">
            Find Your{" "}
            <span className="relative inline-block">
              <span className="text-gradient-gold">Dream Property</span>
            </span>
            <br />
            <span className="italic text-white/80">in Indore & Beyond</span>
          </h1>

          {/* Subheading */}
          <p className="fade-up-delay-2 mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
            Handpicked plots, apartments & villas across{" "}
            <span className="text-white/90 font-medium">Indore, Ujjain, Dewas</span> and{" "}
            <span className="text-white/90 font-medium">Bhopal</span> — legally verified, client-first.
          </p>

          {/* CTA Buttons */}
          <div className="fade-up-delay-2 mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:+919009444491"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-all hover:bg-brand/90 hover:shadow-brand/50 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </a>
            <a
              href="https://wa.me/919009444491"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Search Card */}
        <div className="fade-up-delay-3 mx-auto mt-12 w-full max-w-5xl md:mt-14">
          <SearchCard />
        </div>

        {/* Stats */}
        <dl className="fade-up-delay-3 mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-0 text-center text-white sm:mt-14">
          {STATS.map((s, i) => (
            <div key={s.label} className="relative px-4 py-2">
              {i > 0 && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-px bg-white/15" />
              )}
              <dt
                className="font-display text-3xl font-semibold text-white sm:text-4xl"
                style={{ textShadow: "0 0 30px rgba(0,163,224,0.5)" }}
              >
                {s.value}
              </dt>
              <dd className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70 sm:text-xs">
                {s.label}
              </dd>
              <dd className="text-[10px] text-white/40 mt-0.5">{s.sub}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 animate-bounce">
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <ArrowDown className="h-4 w-4" />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
