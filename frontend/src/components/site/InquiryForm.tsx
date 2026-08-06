import { useEffect, useRef, useState } from "react";
import { ArrowRight, Phone, MapPin, Clock, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSubmitInquiry } from "@/hooks/useApi";
import { toast } from "sonner";

export function InquiryForm() {
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const submitInquiry = useSubmitInquiry();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "Purchase",
    city: "Indore",
    propertyType: "Residential – Apartment",
    message: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("Please accept the GDPR agreement to continue.");
      return;
    }
    try {
      await submitInquiry.mutateAsync({
        name: form.name,
        email: form.email,
        phone: form.phone,
        inquiryType: form.inquiryType,
        propertyType: form.propertyType,
        city: form.city,
        message: form.message,
        source: "website_form",
      });
      setSubmitted(true);
      toast.success("Inquiry submitted! Our team will reach out shortly.", {
        description: "Expected response within 24 hours.",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to submit inquiry");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0B2545 0%, #0a1e3d 50%, #071529 100%)",
      }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_50%,rgba(0,163,224,0.12),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_30%,rgba(0,163,224,0.08),transparent)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/6 w-64 h-64 rounded-full bg-brand/5 blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/6 w-48 h-48 rounded-full bg-brand/8 blur-2xl pointer-events-none animate-float" style={{ animationDelay: "4s" }} />

      <div className="container-page relative">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Left info */}
          <div>
            <h2 className="section-reveal stagger-1 mt-5 font-display text-[clamp(1.75rem,4vw,3rem)] font-medium leading-tight text-white">
              Real Estate{" "}
              <span className="text-gradient-gold">Inquiry</span>
            </h2>
            <p className="section-reveal stagger-2 mt-4 max-w-md text-base text-white/65 leading-relaxed">
              Let's find the perfect property for you. Share a few details and our advisors will reach out within 24 hours.
            </p>

            {/* Contact info */}
            <dl className="section-reveal stagger-3 mt-10 space-y-4">
              {[
                {
                  icon: Phone,
                  label: "Call us directly",
                  value: "9009444491",
                  href: "tel:9009444491",
                  color: "bg-brand/15 text-brand",
                },
                {
                  icon: MapPin,
                  label: "Serving cities",
                  value: "Indore · Ujjain · Dewas · Bhopal",
                  color: "bg-emerald-500/15 text-emerald-400",
                },
                {
                  icon: Clock,
                  label: "Response time",
                  value: "Within 24 hours",
                  color: "bg-yellow-500/15 text-yellow-400",
                },
              ].map(({ icon: Icon, label, value, href, color }) => (
                <div key={label} className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/5 p-4 backdrop-blur-sm hover:bg-white/8 transition-colors">
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">{label}</dt>
                    <dd className="mt-0.5 font-semibold text-white">
                      {href ? (
                        <a href={href} className="hover:text-brand transition-colors">{value}</a>
                      ) : value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            {/* Guarantee badges */}
            <div className="section-reveal stagger-4 mt-8 grid grid-cols-2 gap-3">
              {[
                "Free Consultation",
                "No Hidden Charges",
                "Expert Guidance",
                "Quick Response",
              ].map((badge) => (
                <div key={badge} className="flex items-center gap-2 text-sm text-white/60">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="section-reveal stagger-2">
            {submitted ? (
              <div className="rounded-3xl border border-white/10 bg-white p-8 shadow-[0_25px_60px_rgba(0,0,0,0.3)] text-center">
                <div className="flex flex-col items-center justify-center py-8 gap-4">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-brand-ink">Thank You!</h3>
                  <p className="text-muted-foreground">Our team will contact you within 24 hours.</p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-sm text-brand hover:underline"
                  >
                    Submit another inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-white/10 bg-white p-6 shadow-[0_25px_60px_rgba(0,0,0,0.3)] sm:p-8"
              >
                <div className="grid gap-5">
                  <div className="mb-1">
                    <h3 className="font-display text-xl font-semibold text-brand-ink">Property Inquiry Form</h3>
                    <p className="text-sm text-muted-foreground mt-1">Fill in your details and we'll get back to you.</p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        Full Name *
                      </label>
                      <Input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        className="h-11 rounded-xl border-hairline focus:border-brand focus:ring-brand/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        Phone *
                      </label>
                      <Input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 90000 00000"
                        className="h-11 rounded-xl border-hairline focus:border-brand focus:ring-brand/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      Email *
                    </label>
                    <Input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="h-11 rounded-xl border-hairline focus:border-brand focus:ring-brand/20"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        Inquiry Type
                      </label>
                      <Select value={form.inquiryType} onValueChange={(v) => setForm({ ...form, inquiryType: v })}>
                        <SelectTrigger className="h-11 rounded-xl border-hairline">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Purchase", "Rent", "Sell", "Evaluation", "Mortgage"].map((o) => (
                            <SelectItem key={o} value={o}>{o}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        City
                      </label>
                      <Select value={form.city} onValueChange={(v) => setForm({ ...form, city: v })}>
                        <SelectTrigger className="h-11 rounded-xl border-hairline">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Indore", "Ujjain", "Dewas", "Bhopal"].map((o) => (
                            <SelectItem key={o} value={o}>{o}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        Property
                      </label>
                      <Select value={form.propertyType} onValueChange={(v) => setForm({ ...form, propertyType: v })}>
                        <SelectTrigger className="h-11 rounded-xl border-hairline">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "Commercial – Office",
                            "Commercial – Shop",
                            "Residential – Apartment",
                            "Residential – Villa",
                            "Plot",
                          ].map((o) => (
                            <SelectItem key={o} value={o}>{o}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      Message (Optional)
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your requirements..."
                      rows={3}
                      className="w-full rounded-xl border border-hairline px-3 py-2.5 text-sm focus:border-brand focus:ring-brand/20 resize-none"
                    />
                  </div>

                  <label className="flex items-start gap-3 rounded-xl bg-surface p-4 text-sm text-muted-foreground cursor-pointer hover:bg-brand-soft transition-colors">
                    <Checkbox
                      checked={agreed}
                      onCheckedChange={(v) => setAgreed(v === true)}
                      className="mt-0.5"
                    />
                    <span>
                      <strong className="font-semibold text-brand-ink">GDPR Agreement.</strong>{" "}
                      I agree to the processing of my personal data in accordance with the GDPR and the privacy policy.
                    </span>
                  </label>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitInquiry.isPending}
                    className="h-13 gap-2 rounded-full bg-gradient-to-r from-brand to-[#0077b6] text-white font-bold shadow-[0_6px_20px_rgba(0,163,224,0.4)] hover:shadow-[0_10px_30px_rgba(0,163,224,0.5)] hover:scale-[1.02] transition-all duration-200"
                  >
                    {submitInquiry.isPending ? "Submitting..." : "Submit Inquiry"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
