import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Phone, X, Building2, MapPin } from "lucide-react";

const NAV = [
  { label: "Home", href: "#top" },
  { label: "Properties", href: "#properties" },
  { label: "Cities", href: "#cities" },
  { label: "About", href: "#why" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 shadow-[0_2px_24px_rgba(11,37,69,0.10)]"
      style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
      >
        {/* Brand accent line — visible on scroll */}
        <div
          className={`h-[2px] w-full bg-gradient-to-r from-transparent via-brand to-transparent transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="container-page flex items-center justify-between gap-4 py-3.5 md:py-4">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-black shadow-[0_4px_14px_rgba(0,0,0,0.18)]">
              <img src="/logo.webp" alt="IPM logo" className="h-full w-full object-cover" />
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 rounded-full text-sm font-medium text-brand-ink/80 hover:text-brand-ink hover:bg-slate-100 transition-all duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* ── Desktop Actions ── */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <a
              href="tel:+919009444491"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-brand-ink transition-all duration-200 hover:bg-slate-100"
            >
              <span className={`grid h-7 w-7 place-items-center rounded-full transition-colors ${scrolled ? "bg-brand/10" : "bg-white/15"}`}>
                <Phone className="h-3.5 w-3.5" />
              </span>
              +91 90094 44491
            </a>
            <a
              href="#contact"
              className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(0,163,224,0.35)] hover:bg-brand/90 hover:shadow-[0_6px_22px_rgba(0,163,224,0.5)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <Building2 className="h-4 w-4" />
              List Property
            </a>
          </div>

          {/* ── Mobile Actions ── */}
          <div className="flex items-center gap-1 lg:hidden">
            <a
              href="tel:+919009444491"
              aria-label="Call us"
              className="grid h-10 w-10 place-items-center rounded-full text-brand-ink transition-colors hover:bg-slate-100"
            >
              <Phone className="h-4 w-4" />
            </a>
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full text-brand-ink transition-colors hover:bg-slate-100"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-brand-ink/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer panel */}
      <div
        className={`fixed inset-y-0 right-0 z-[70] w-[82vw] max-w-[340px] bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-white shadow-[0_4px_12px_rgba(0,163,224,0.3)]">
              <img src="/logo.webp" alt="IPM logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-brand-ink leading-tight">IPM</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Menu</p>
            </div>
          </div>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-0.5 p-3 flex-1 overflow-y-auto">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-[15px] font-medium text-brand-ink hover:bg-brand-soft hover:text-brand transition-colors"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand/40 shrink-0" />
              {item.label}
            </a>
          ))}
        </nav>

        {/* Drawer footer */}
        <div className="border-t border-slate-100 p-4 space-y-2.5">
          <a
            href="tel:+919009444491"
            className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-brand-ink hover:bg-slate-50 transition-colors"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-brand/10 text-brand shrink-0">
              <Phone className="h-3.5 w-3.5" />
            </span>
            +91 90094 44491
          </a>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-brand py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(0,163,224,0.3)] hover:bg-brand/90 transition-colors"
          >
            <MapPin className="h-4 w-4" />
            List Your Property
          </a>
        </div>
      </div>
    </>
  );
}
