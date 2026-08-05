import { partners } from "@/content/home";

export function PartnersSection() {
  return (
    <section className="relative py-14 border-y border-hairline overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-surface/40 to-background pointer-events-none" />
      <div className="container-page relative">
        <p className="mb-8 text-center text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
          Trusted by Leading Developers
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partners.map((src, i) => (
            <div
              key={i}
              className="group relative h-10 w-28 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <img
                src={src}
                alt={`Partner ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
