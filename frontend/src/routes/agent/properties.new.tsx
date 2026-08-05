import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Upload, X, Plus, ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/agent/properties/new")({
  component: NewProperty,
});

const AMENITIES = [
  "Swimming Pool","Gym","Club House","Garden","Children Play Area","Jogging Track",
  "24/7 Security","CCTV","Power Backup","Lift","Parking","Gated Community",
  "Vaastu Compliant","Bank Loan Available","Near School","Near Hospital","Near Market","Near Highway",
  "Water Supply","Electricity","Rainwater Harvesting",
];

function NewProperty() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "", description: "", type: "Residential", subType: "", status: "For Sale",
    label: "", priceAmount: "", priceUnit: "total", priceDisplay: "", negotiable: false,
    address: "", locality: "", city: "Indore", pincode: "",
    area: "", areaUnit: "sq ft", displaySize: "", bedrooms: "", bathrooms: "", parking: "",
    furnishing: "", possessionStatus: "", reraNumber: "",
  });

  useEffect(() => {
    if (!isAuthenticated || !["agent", "admin"].includes(user?.role || "")) navigate({ to: "/login" });
  }, [isAuthenticated, user]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...images, ...files].slice(0, 10);
    setImages(newFiles);
    setPreviews(newFiles.map(f => URL.createObjectURL(f)));
  };

  const removeImage = (i: number) => {
    const newFiles = images.filter((_, idx) => idx !== i);
    setImages(newFiles);
    setPreviews(newFiles.map(f => URL.createObjectURL(f)));
  };

  const toggleAmenity = (a: string) => {
    setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.priceAmount || !form.address) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("type", form.type);
      if (form.subType) fd.append("subType", form.subType);
      fd.append("status", form.status);
      if (form.label) fd.append("label", form.label);
      fd.append("price[amount]", form.priceAmount);
      fd.append("price[unit]", form.priceUnit);
      if (form.priceDisplay) fd.append("price[displayPrice]", form.priceDisplay);
      fd.append("price[negotiable]", String(form.negotiable));
      fd.append("location[address]", form.address);
      if (form.locality) fd.append("location[locality]", form.locality);
      fd.append("location[city]", form.city);
      if (form.pincode) fd.append("location[pincode]", form.pincode);
      if (form.area) fd.append("size[area]", form.area);
      fd.append("size[areaUnit]", form.areaUnit);
      if (form.displaySize) fd.append("size[displaySize]", form.displaySize);
      if (form.bedrooms) fd.append("bedrooms", form.bedrooms);
      if (form.bathrooms) fd.append("bathrooms", form.bathrooms);
      if (form.parking) fd.append("parking", form.parking);
      if (form.furnishing) fd.append("furnishing", form.furnishing);
      if (form.possessionStatus) fd.append("possessionStatus", form.possessionStatus);
      if (form.reraNumber) fd.append("reraNumber", form.reraNumber);
      selectedAmenities.forEach(a => fd.append("amenities[]", a));
      images.forEach(img => fd.append("images", img));

      await api.post("/properties", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Property listed successfully!");
      navigate({ to: user?.role === "admin" ? "/admin/properties" : "/agent/properties" });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );

  const inputCls = "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all";
  const selectCls = inputCls + " cursor-pointer";

  return (
    <DashboardLayout title="Add New Property" subtitle="Fill in the details below">
      <div className="mb-5">
        <button onClick={() => navigate({ to: user?.role === "admin" ? "/admin/properties" : "/agent/properties" })} className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Properties
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Basic Info */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-brand-ink border-b border-slate-100 pb-3">Basic Information</h3>
          <Field label="Property Title" required>
            <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. The Sky Empire — 3 BHK Luxury Flats" className={inputCls} required />
          </Field>
          <Field label="Description" required>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={4} placeholder="Describe the property in detail..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all resize-none" required />
          </Field>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Field label="Type" required>
              <select value={form.type} onChange={e => set("type", e.target.value)} className={selectCls}>
                {["Residential","Commercial","Plot"].map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Sub Type">
              <select value={form.subType} onChange={e => set("subType", e.target.value)} className={selectCls}>
                <option value="">Select</option>
                {["1 BHK","2 BHK","3 BHK","4 BHK","Villa","Studio","Apartment","Office","Shop","Residential Plot","Commercial Plot"].map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={e => set("status", e.target.value)} className={selectCls}>
                {["For Sale","For Rent","Sold","Rented"].map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Label">
              <select value={form.label} onChange={e => set("label", e.target.value)} className={selectCls}>
                <option value="">None</option>
                {["New Launch","Featured","Hot Deal","Reduced Price"].map(l => <option key={l}>{l}</option>)}
              </select>
            </Field>
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-brand-ink border-b border-slate-100 pb-3">Pricing</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field label="Price (₹)" required>
              <input type="number" value={form.priceAmount} onChange={e => set("priceAmount", e.target.value)} placeholder="e.g. 8500000" className={inputCls} required />
            </Field>
            <Field label="Price Unit">
              <select value={form.priceUnit} onChange={e => set("priceUnit", e.target.value)} className={selectCls}>
                <option value="total">Total</option>
                <option value="per_sqft">Per Sq.Ft</option>
                <option value="per_month">Per Month</option>
              </select>
            </Field>
            <Field label="Display Price">
              <input value={form.priceDisplay} onChange={e => set("priceDisplay", e.target.value)} placeholder="e.g. ₹85L - ₹1.2Cr" className={inputCls} />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input type="checkbox" checked={form.negotiable} onChange={e => set("negotiable", e.target.checked)} className="rounded border-slate-300 text-brand focus:ring-brand" />
            Price is negotiable
          </label>
        </div>

        {/* Location */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-brand-ink border-b border-slate-100 pb-3">Location</h3>
          <Field label="Full Address" required>
            <input value={form.address} onChange={e => set("address", e.target.value)} placeholder="e.g. Near MR 5 Square, Super Corridor" className={inputCls} required />
          </Field>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field label="Locality">
              <input value={form.locality} onChange={e => set("locality", e.target.value)} placeholder="e.g. Vijay Nagar" className={inputCls} />
            </Field>
            <Field label="City" required>
              <select value={form.city} onChange={e => set("city", e.target.value)} className={selectCls}>
                {["Indore","Ujjain","Dewas","Bhopal"].map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Pincode">
              <input value={form.pincode} onChange={e => set("pincode", e.target.value)} placeholder="452001" className={inputCls} />
            </Field>
          </div>
        </div>

        {/* Size & Details */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-brand-ink border-b border-slate-100 pb-3">Size & Details</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Field label="Area">
              <input type="number" value={form.area} onChange={e => set("area", e.target.value)} placeholder="1200" className={inputCls} />
            </Field>
            <Field label="Unit">
              <select value={form.areaUnit} onChange={e => set("areaUnit", e.target.value)} className={selectCls}>
                {["sq ft","sq mt","bigha","acre"].map(u => <option key={u}>{u}</option>)}
              </select>
            </Field>
            <Field label="Bedrooms">
              <input type="number" value={form.bedrooms} onChange={e => set("bedrooms", e.target.value)} placeholder="3" className={inputCls} min="0" />
            </Field>
            <Field label="Bathrooms">
              <input type="number" value={form.bathrooms} onChange={e => set("bathrooms", e.target.value)} placeholder="2" className={inputCls} min="0" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field label="Parking">
              <input type="number" value={form.parking} onChange={e => set("parking", e.target.value)} placeholder="1" className={inputCls} min="0" />
            </Field>
            <Field label="Furnishing">
              <select value={form.furnishing} onChange={e => set("furnishing", e.target.value)} className={selectCls}>
                <option value="">Select</option>
                {["Unfurnished","Semi-Furnished","Fully Furnished"].map(f => <option key={f}>{f}</option>)}
              </select>
            </Field>
            <Field label="Possession">
              <select value={form.possessionStatus} onChange={e => set("possessionStatus", e.target.value)} className={selectCls}>
                <option value="">Select</option>
                {["Ready to Move","Under Construction","New Launch"].map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
          </div>
          <Field label="RERA Number">
            <input value={form.reraNumber} onChange={e => set("reraNumber", e.target.value)} placeholder="MP/RERA/..." className={inputCls} />
          </Field>
        </div>

        {/* Amenities */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <h3 className="font-semibold text-brand-ink border-b border-slate-100 pb-3 mb-4">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map(a => (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${selectedAmenities.includes(a) ? "bg-brand text-white shadow-[0_2px_8px_rgba(0,163,224,0.3)]" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <h3 className="font-semibold text-brand-ink border-b border-slate-100 pb-3 mb-4">Property Images <span className="text-slate-400 font-normal text-xs">(max 10, 5MB each)</span></h3>
          <div className="flex flex-wrap gap-3">
            {previews.map((src, i) => (
              <div key={i} className="relative h-24 w-32 rounded-xl overflow-hidden group">
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="h-3 w-3" />
                </button>
                {i === 0 && <span className="absolute bottom-1 left-1 rounded-full bg-brand px-1.5 py-0.5 text-[9px] font-bold text-white">Primary</span>}
              </div>
            ))}
            {images.length < 10 && (
              <label className="flex h-24 w-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-brand hover:text-brand transition-colors">
                <Upload className="h-5 w-5 mb-1" />
                <span className="text-xs">Upload</span>
                <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pb-6">
          <button type="submit" disabled={loading} className="flex items-center gap-2 h-11 rounded-xl bg-brand px-8 text-sm font-bold text-white shadow-[0_4px_14px_rgba(0,163,224,0.35)] hover:bg-brand/90 hover:shadow-[0_6px_20px_rgba(0,163,224,0.5)] transition-all disabled:opacity-60">
            {loading ? "Publishing..." : "Publish Property"}
          </button>
          <button type="button" onClick={() => navigate({ to: user?.role === "admin" ? "/admin/properties" : "/agent/properties" })} className="h-11 rounded-xl border border-slate-200 px-6 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
