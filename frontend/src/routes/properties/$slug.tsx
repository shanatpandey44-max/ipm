import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  MapPin, Ruler, BedDouble, Bath, Car, ChevronLeft, ChevronRight,
  Phone, MessageCircle, Heart, Share2, Eye, CheckCircle2,
  ArrowLeft, Calendar, Building2, Shield, X, ArrowRight,
} from "lucide-react";
import { useProperty, useSubmitInquiry } from "@/hooks/useApi";
import { useAuthStore } from "@/stores/authStore";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PropertyCard } from "@/components/site/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export const Route = createFileRoute("/properties/$slug")({
  component: PropertyDetailPage,
});

function PropertyDetailPage() {
  const { slug } = Route.useParams();
  const { data, isLoading, isError } = useProperty(slug);
  const { user } = useAuthStore();
  const submitInquiry = useSubmitInquiry();

  const [imgIndex, setImgIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [liked, setLiked] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", email: user?.email || "", message: "" });

  const property = data?.property;
  const related = data?.related ?? [];

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitInquiry.mutateAsync({
        ...form,
        propertyId: property?._id,
        source: "property_page",
      });
      toast.success("Inquiry sent! Our team will contact you within 24 hours.");
      setForm((f) => ({ ...f, message: "" }));
    } catch (err: any) {
      toast.error(err.message || "Failed to send inquiry");
    }
  };

  const handleWhatsApp = () => {
    const msg = `Hi, I'm interested in *${property?.title}* listed on IPM.\n\nLocation: ${property?.location.address}, ${property?.location.city}\nPrice: ${property?.price.displayPrice || "Contact for price"}\n\nPlease share more details.`;
    window.open(`https://wa.me/919009444491?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: property?.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (isLoading) return <PropertyDetailSkeleton />;
  if (isError || !property) return <PropertyNotFound />;

  const images = property.images.length > 0 ? property.images : [{ url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80" }];
  const primaryImage = images.find((i) => i.isPrimary) || images[0];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Toaster richColors position="top-center" />

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 text-white/70 hover:text-white" onClick={() => setLightbox(false)}>
            <X className="h-8 w-8" />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
            onClick={(e) => { e.stopPropagation(); setImgIndex((i) => (i - 1 + images.length) % images.length); }}>
            <ChevronLeft className="h-10 w-10" />
          </button>
          <img src={images[imgIndex].url} alt="" className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
            onClick={(e) => { e.stopPropagation(); setImgIndex((i) => (i + 1) % images.length); }}>
            <ChevronRight className="h-10 w-10" />
          </button>
          <div className="absolute bottom-4 text-white/50 text-sm">{imgIndex + 1} / {images.length}</div>
        </div>
      )}

      <div className="pt-20">
        {/* Breadcrumb */}
        <div className="container-page py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-brand transition-colors">Home</Link>
            <span>/</span>
            <Link to="/properties/" className="hover:text-brand transition-colors">Properties</Link>
            <span>/</span>
            <span className="text-brand-ink font-medium truncate max-w-xs">{property.title}</span>
          </div>
        </div>

        <div className="container-page pb-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            {/* LEFT COLUMN */}
            <div className="min-w-0">
              {/* Image Gallery */}
              <div className="relative rounded-2xl overflow-hidden bg-muted">
                <img
                  src={images[imgIndex].url}
                  alt={property.title}
                  className="w-full aspect-[16/9] object-cover cursor-zoom-in"
                  onClick={() => setLightbox(true)}
                />
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold text-white backdrop-blur-md ${
                    property.type === "Plot" ? "bg-emerald-500/90" : property.type === "Commercial" ? "bg-purple-500/90" : "bg-brand/90"
                  }`}>{property.type}</span>
                  {property.label && (
                    <span className="rounded-full bg-yellow-500/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">{property.label}</span>
                  )}
                </div>
                {/* View count */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur-md">
                  <Eye className="h-3.5 w-3.5" /> {property.views || 0} views
                </div>
                {/* Nav arrows */}
                {images.length > 1 && (
                  <>
                    <button onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setImgIndex(i)}
                      className={`shrink-0 h-16 w-24 rounded-xl overflow-hidden border-2 transition-all ${i === imgIndex ? "border-brand shadow-[0_0_0_2px_rgba(0,163,224,0.3)]" : "border-transparent opacity-60 hover:opacity-100"}`}>
                      <img src={img.url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Title + Actions */}
              <div className="mt-6 flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-semibold text-brand-ink sm:text-3xl">{property.title}</h1>
                  <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-brand shrink-0" />
                    {property.location.address}, {property.location.city}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setLiked(!liked)}
                    className={`grid h-10 w-10 place-items-center rounded-full border transition-all ${liked ? "bg-red-50 border-red-200 text-red-500" : "border-hairline text-muted-foreground hover:border-red-200 hover:text-red-400"}`}>
                    <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                  </button>
                  <button onClick={handleShare}
                    className="grid h-10 w-10 place-items-center rounded-full border border-hairline text-muted-foreground hover:border-brand hover:text-brand transition-all">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Key Stats */}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Ruler, label: "Area", value: property.size.displaySize || `${property.size.area} sq.ft.` },
                  ...(property.bedrooms ? [{ icon: BedDouble, label: "Bedrooms", value: `${property.bedrooms} BHK` }] : []),
                  ...(property.bathrooms ? [{ icon: Bath, label: "Bathrooms", value: `${property.bathrooms}` }] : []),
                  ...(property.parking ? [{ icon: Car, label: "Parking", value: `${property.parking}` }] : []),
                  ...(property.possessionStatus ? [{ icon: Calendar, label: "Possession", value: property.possessionStatus }] : []),
                  ...(property.furnishing ? [{ icon: Building2, label: "Furnishing", value: property.furnishing }] : []),
                ].slice(0, 4).map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-xl border border-hairline bg-surface p-3 text-center">
                    <Icon className="h-5 w-5 text-brand mx-auto mb-1" />
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="text-sm font-semibold text-brand-ink mt-0.5">{value}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="mt-8">
                <h2 className="font-display text-xl font-semibold text-brand-ink mb-3">About This Property</h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">{property.description}</p>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mt-8">
                  <h2 className="font-display text-xl font-semibold text-brand-ink mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {property.amenities.map((a) => (
                      <div key={a} className="flex items-center gap-2.5 rounded-xl border border-hairline bg-surface px-3 py-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        <span className="text-sm text-brand-ink">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RERA */}
              {property.reraNumber && (
                <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <Shield className="h-6 w-6 text-emerald-500 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-emerald-800">RERA Registered</div>
                    <div className="text-xs text-emerald-600">RERA No: {property.reraNumber}</div>
                  </div>
                </div>
              )}

              {/* Map */}
              {property.location.mapEmbedUrl && (
                <div className="mt-8">
                  <h2 className="font-display text-xl font-semibold text-brand-ink mb-4">Location</h2>
                  <div className="rounded-2xl overflow-hidden border border-hairline h-64">
                    <iframe src={property.location.mapEmbedUrl} className="w-full h-full" loading="lazy" title="Property location" />
                  </div>
                </div>
              )}

              {/* Related Properties */}
              {related.length > 0 && (
                <div className="mt-12">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-display text-xl font-semibold text-brand-ink">Similar Properties</h2>
                    <Link to="/properties/" className="text-sm font-semibold text-brand hover:underline flex items-center gap-1">
                      View All <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {related.slice(0, 2).map((p, i) => (
                      <Link key={p._id} to="/properties/$slug" params={{ slug: p.slug }}>
                        <PropertyCard p={p} index={i} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN — Sticky sidebar */}
            <div className="space-y-5">
              {/* Price Card */}
              <div className="sticky top-24 space-y-4">
                <div className="rounded-2xl border border-hairline bg-card p-6 shadow-soft luxury-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Price</div>
                      <div className="mt-1 font-display text-3xl font-semibold text-brand-ink">
                        {property.price.displayPrice || `₹${(property.price.amount / 100000).toFixed(0)}L`}
                      </div>
                      {property.price.negotiable && (
                        <span className="text-xs text-emerald-600 font-medium">Negotiable</span>
                      )}
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                      property.status === "For Sale" ? "bg-brand-soft text-brand" : "bg-emerald-50 text-emerald-700"
                    }`}>{property.status}</span>
                  </div>

                  {/* CTA Buttons */}
                  <div className="mt-5 space-y-2.5">
                    <button onClick={handleWhatsApp}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-sm font-bold text-white shadow-[0_4px_15px_rgba(37,211,102,0.35)] hover:bg-[#20bd5a] hover:shadow-[0_6px_20px_rgba(37,211,102,0.5)] transition-all">
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp Inquiry
                    </button>
                    <a href="tel:9009444491"
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-brand bg-brand-soft py-3 text-sm font-bold text-brand hover:bg-brand hover:text-white transition-all">
                      <Phone className="h-4 w-4" />
                      Call: 9009444491
                    </a>
                  </div>
                </div>

                {/* Inquiry Form */}
                <div className="rounded-2xl border border-hairline bg-card p-6 shadow-soft">
                  <h3 className="font-display text-lg font-semibold text-brand-ink mb-4">Send Inquiry</h3>
                  <form onSubmit={handleInquiry} className="space-y-3">
                    <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Your name" className="h-10 rounded-xl border-hairline text-sm" />
                    <Input required type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="Phone number" className="h-10 rounded-xl border-hairline text-sm" />
                    <Input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="Email address" className="h-10 rounded-xl border-hairline text-sm" />
                    <Textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="I'm interested in this property..." rows={3}
                      className="rounded-xl border-hairline text-sm resize-none" />
                    <Button type="submit" disabled={submitInquiry.isPending}
                      className="w-full rounded-full bg-gradient-to-r from-brand to-[#0077b6] text-white font-bold shadow-[0_4px_15px_rgba(0,163,224,0.35)] hover:shadow-[0_6px_20px_rgba(0,163,224,0.5)] transition-all">
                      {submitInquiry.isPending ? "Sending..." : "Send Inquiry"}
                    </Button>
                  </form>
                </div>

                {/* Agent Card */}
                {property.agent && (
                  <div className="rounded-2xl border border-hairline bg-card p-5 shadow-soft">
                    <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground mb-3">Listed By</div>
                    <div className="flex items-center gap-3">
                      <img src={property.agent.avatar?.url || "https://ui-avatars.com/api/?name=" + property.agent.name}
                        alt={property.agent.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-brand/20" />
                      <div>
                        <div className="font-semibold text-brand-ink">{property.agent.name}</div>
                        <div className="text-xs text-muted-foreground">Property Advisor</div>
                      </div>
                    </div>
                    {property.agent.phone && (
                      <a href={`tel:${property.agent.phone}`}
                        className="mt-3 flex items-center gap-2 text-sm font-medium text-brand hover:underline">
                        <Phone className="h-3.5 w-3.5" /> {property.agent.phone}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

function PropertyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="pt-24 container-page pb-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <div className="aspect-[16/9] rounded-2xl bg-surface animate-pulse" />
            <div className="h-8 w-2/3 rounded-xl bg-surface animate-pulse" />
            <div className="h-4 w-1/2 rounded-xl bg-surface animate-pulse" />
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-surface animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-64 rounded-2xl bg-surface animate-pulse" />
            <div className="h-80 rounded-2xl bg-surface animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <SiteHeader />
      <div className="text-center px-4">
        <div className="font-display text-6xl font-bold text-brand/20 mb-4">404</div>
        <h2 className="font-display text-2xl font-semibold text-brand-ink">Property Not Found</h2>
        <p className="mt-2 text-muted-foreground">This property may have been sold or removed.</p>
        <Link to="/properties/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white">
          <ArrowLeft className="h-4 w-4" /> Browse Properties
        </Link>
      </div>
    </div>
  );
}
