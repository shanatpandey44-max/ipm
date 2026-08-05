import { ArrowUpRight, MapPin, Ruler, Heart, BedDouble, Bath, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

type CardProperty = {
  _id?: string;
  id?: string;
  slug?: string;
  title: string;
  location?: string;
  size?: string;
  type: string;
  images?: { url: string; isPrimary?: boolean }[];
  image?: string;
  price?: string | { displayPrice?: string; amount?: number };
  bedrooms?: number;
  bathrooms?: number;
  status?: string;
  label?: string;
  isFeatured?: boolean;
};

const WHATSAPP = "919009444491";

function getPrice(price: CardProperty["price"]): string | null {
  if (!price) return null;
  if (typeof price === "string") return price;
  return price.displayPrice || (price.amount ? `₹${(price.amount / 100000).toFixed(0)}L` : null);
}

function getImage(p: CardProperty): string {
  if (p.images?.length) {
    const primary = p.images.find((i) => i.isPrimary) || p.images[0];
    return primary.url;
  }
  return p.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80";
}

function getSlug(p: CardProperty): string {
  return p.slug || p.id || p._id || "";
}

const TYPE_COLOR: Record<string, string> = {
  Plot: "bg-emerald-500/90",
  Commercial: "bg-purple-500/90",
  Residential: "bg-brand/90",
};

export function PropertyCard({ p, index = 0 }: { p: CardProperty; index?: number }) {
  const [liked, setLiked] = useState(false);
  const slug = getSlug(p);
  const price = getPrice(p.price);
  const img = getImage(p);
  const waMsg = encodeURIComponent(`Hi, I'm interested in "${p.title}". Please share more details.`);

  return (
    <article
      className="shimmer-card group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(11,37,69,0.15)] luxury-border"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image */}
      <div className="relative aspect-[16/11] overflow-hidden bg-muted">
        <img
          src={img}
          alt={p.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-col gap-1.5">
            <span className={`self-start rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-soft backdrop-blur-md text-white ${TYPE_COLOR[p.type] || "bg-brand/90"}`}>
              {p.type}
            </span>
            {p.label && p.label !== "" && (
              <span className="self-start rounded-full bg-yellow-500/90 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                {p.label}
              </span>
            )}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
            className={`grid h-8 w-8 place-items-center rounded-full backdrop-blur-md transition-all duration-200 ${liked ? "bg-red-500 text-white scale-110" : "bg-black/30 text-white hover:bg-red-500/80"}`}
            aria-label="Save property"
          >
            <Heart className={`h-3.5 w-3.5 transition-all ${liked ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a
            href={`https://wa.me/${WHATSAPP}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-[#20bd5a] transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp Enquiry
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="line-clamp-1 font-display text-lg font-semibold leading-snug text-brand-ink group-hover:text-brand transition-colors duration-300">
            {p.title}
          </h3>
          {(p.location || (p as any).location?.address) && (
            <p className="mt-1.5 flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
              <span className="line-clamp-1">
                {typeof p.location === "string" ? p.location : (p as any).location?.address}
              </span>
            </p>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 flex-wrap">
          {(p.size || (p as any).size?.displaySize) && (
            <span className="flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-ink">
              <Ruler className="h-3 w-3 text-brand" />
              {typeof p.size === "string" ? p.size : (p as any).size?.displaySize}
            </span>
          )}
          {(p.bedrooms ?? 0) > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <BedDouble className="h-3.5 w-3.5 text-brand/60" />
              {p.bedrooms} BHK
            </span>
          )}
          {(p.bathrooms ?? 0) > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Bath className="h-3.5 w-3.5 text-brand/60" />
              {p.bathrooms}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-hairline pt-4">
          {price ? (
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Price</div>
              <div className="font-display text-base font-bold text-brand-ink">{price}</div>
            </div>
          ) : (
            <span className="text-sm font-semibold text-muted-foreground">Price on Request</span>
          )}

          {slug ? (
            <Link
              to="/properties/$slug"
              params={{ slug }}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_4px_12px_rgba(0,163,224,0.3)] hover:shadow-[0_6px_20px_rgba(0,163,224,0.5)] hover:bg-brand/90 transition-all duration-200"
            >
              Details
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <button className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_4px_12px_rgba(0,163,224,0.3)] hover:shadow-[0_6px_20px_rgba(0,163,224,0.5)] transition-all duration-200">
              Details
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </article>
  );
}
