import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail, ArrowRight, Building2 } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #071529 0%, #050e1f 100%)" }}>
      {/* Top accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(0,163,224,0.08),transparent)] pointer-events-none" />

      {/* Newsletter bar */}
      <div className="border-b border-white/8">
        <div className="container-page py-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/8 bg-white/4 p-6 backdrop-blur-sm sm:flex-row sm:items-center">
            <div>
              <h3 className="font-display text-lg font-semibold text-white">Stay Updated on New Properties</h3>
              <p className="mt-1 text-sm text-white/50">Get the latest listings and market insights.</p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full max-w-sm gap-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="h-10 flex-1 rounded-full border border-white/15 bg-white/8 px-4 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 backdrop-blur-sm"
              />
              <button
                type="submit"
                className="flex h-10 items-center gap-1.5 rounded-full bg-brand px-4 text-sm font-semibold text-white shadow-[0_4px_15px_rgba(0,163,224,0.35)] hover:bg-brand/90 hover:shadow-[0_6px_20px_rgba(0,163,224,0.5)] transition-all"
              >
                Subscribe
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-page grid gap-10 py-16 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand to-[#0077b6] font-display text-base font-bold text-white shadow-[0_4px_15px_rgba(0,163,224,0.4)]">
              iPM
            </div>
            <span>
              <span className="block text-sm font-bold text-white">Indore Property Management</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-white/40">Care Beyond Ownership</span>
            </span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
            Local expertise for plots, apartments, and villas across Indore, Ujjain, Dewas and Bhopal — from discovery to ownership and beyond.
          </p>

          {/* Social */}
          <div className="mt-6 flex gap-2">
            {[
              { Icon: Facebook, href: "#", label: "Facebook" },
              { Icon: Instagram, href: "#", label: "Instagram" },
              { Icon: Linkedin, href: "#", label: "LinkedIn" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="group grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/5 text-white/60 transition-all duration-200 hover:border-brand hover:bg-brand hover:text-white hover:shadow-[0_4px_15px_rgba(0,163,224,0.4)] hover:scale-110"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          {/* Rating */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/8 px-3 py-1.5">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-yellow-400 text-xs">★</span>
              ))}
            </div>
            <span className="text-xs font-semibold text-yellow-400">4.9/5 Rating</span>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Explore</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {["Home", "About Us", "Properties", "Blog", "Contact"].map((l) => (
              <li key={l}>
                <a href="#" className="group flex items-center gap-2 text-white/55 transition-colors hover:text-white">
                  <span className="h-px w-3 bg-brand/40 group-hover:w-5 group-hover:bg-brand transition-all duration-200" />
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Cities */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Cities</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {["Indore", "Ujjain", "Dewas", "Bhopal"].map((l) => (
              <li key={l}>
                <a href="#" className="group flex items-center gap-2 text-white/55 transition-colors hover:text-white">
                  <span className="h-px w-3 bg-brand/40 group-hover:w-5 group-hover:bg-brand transition-all duration-200" />
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Contact</h4>
          <ul className="mt-5 space-y-4 text-sm">
            <li>
              <a href="tel:9009444491" className="flex items-start gap-3 text-white/55 hover:text-white transition-colors group">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand/15 group-hover:bg-brand/25 transition-colors">
                  <Phone className="h-3.5 w-3.5 text-brand" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/30">Phone</div>
                  <div className="font-semibold text-white/80 group-hover:text-white">9009444491</div>
                </div>
              </a>
            </li>
            <li className="flex items-start gap-3 text-white/55">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand/15">
                <MapPin className="h-3.5 w-3.5 text-brand" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-white/30">Location</div>
                <div className="text-white/70">Indore, Madhya Pradesh</div>
              </div>
            </li>
            <li>
              <a href="mailto:info@theipm.in" className="flex items-start gap-3 text-white/55 hover:text-white transition-colors group">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand/15 group-hover:bg-brand/25 transition-colors">
                  <Mail className="h-3.5 w-3.5 text-brand" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/30">Email</div>
                  <div className="font-semibold text-white/80 group-hover:text-white">info@theipm.in</div>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="container-page flex flex-col items-start justify-between gap-3 py-6 text-xs text-white/35 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5 text-brand/50" />
            <p>© {new Date().getFullYear()} Indore Property Management Pvt. Ltd. All rights reserved.</p>
          </div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">RERA</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
