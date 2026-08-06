import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Hero } from "@/components/site/Hero";

// Lazy load below-fold sections
const PartnersSection = lazy(() => import("@/components/site/PartnersSection").then(m => ({ default: m.PartnersSection })));
const PropertiesSection = lazy(() => import("@/components/site/PropertiesSection").then(m => ({ default: m.PropertiesSection })));
const WhyChoose = lazy(() => import("@/components/site/WhyChoose").then(m => ({ default: m.WhyChoose })));
const InquiryForm = lazy(() => import("@/components/site/InquiryForm").then(m => ({ default: m.InquiryForm })));
const CitiesSection = lazy(() => import("@/components/site/CitiesSection").then(m => ({ default: m.CitiesSection })));
const Testimonials = lazy(() => import("@/components/site/Testimonials").then(m => ({ default: m.Testimonials })));
const SiteFooter = lazy(() => import("@/components/site/SiteFooter").then(m => ({ default: m.SiteFooter })));

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Indore Property Management — Plots, Flats & Villas in Indore, Ujjain, Dewas, Bhopal" },
      {
        name: "description",
        content:
          "Discover legally verified plots, apartments and villas across Indore, Ujjain, Dewas and Bhopal. Local expertise, complete property solutions, and a client-first approach.",
      },
      { property: "og:title", content: "Indore Property Management — Care Beyond Ownership" },
      {
        property: "og:description",
        content:
          "Handpicked plots and homes across Indore, Ujjain, Dewas and Bhopal — managed with trust, transparency and deep local expertise.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <SiteHeader />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <PartnersSection />
          <PropertiesSection />
          <WhyChoose />
          <InquiryForm />
          <CitiesSection />
          <Testimonials />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <SiteFooter />
      </Suspense>
      <Toaster richColors position="top-center" />

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-brand to-[#0077b6] text-white shadow-[0_8px_25px_rgba(0,163,224,0.5)] hover:shadow-[0_12px_35px_rgba(0,163,224,0.6)] hover:scale-110 transition-all duration-200 opacity-0 pointer-events-none"
        id="back-to-top"
        aria-label="Back to top"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      <script dangerouslySetInnerHTML={{
        __html: `
          window.addEventListener('scroll', () => {
            const btn = document.getElementById('back-to-top');
            if (btn) {
              if (window.scrollY > 300) {
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
              } else {
                btn.style.opacity = '0';
                btn.style.pointerEvents = 'none';
              }
            }
          });
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) entry.target.classList.add('revealed');
            });
          }, { threshold: 0.1 });
          document.querySelectorAll('.section-reveal').forEach(el => observer.observe(el));
        `
      }} />
    </div>
  );
}
