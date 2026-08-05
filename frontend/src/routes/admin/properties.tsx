import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useProperties } from "@/hooks/useApi";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Plus, Search, Eye, Pencil, Trash2, Star, MapPin, Building2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/properties")({
  component: AdminProperties,
});

function AdminProperties() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") navigate({ to: "/login" });
  }, [isAuthenticated, user]);

  const { data, isLoading, refetch } = useProperties({ search, city: city as any, type: type as any, page, limit: 12 });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/properties/${id}`);
      toast.success("Property deleted");
      refetch();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await api.put(`/properties/${id}`, { isFeatured: !current });
      toast.success(current ? "Removed from featured" : "Marked as featured");
      refetch();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <DashboardLayout title="Properties" subtitle={`${data?.total ?? 0} total listings`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search properties..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <select value={city} onChange={(e) => { setCity(e.target.value); setPage(1); }} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-brand focus:outline-none">
          <option value="">All Cities</option>
          {["Indore","Ujjain","Dewas","Bhopal"].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-brand focus:outline-none">
          <option value="">All Types</option>
          {["Residential","Plot","Commercial"].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button onClick={() => navigate({ to: "/agent/property/new" })} className="flex items-center gap-2 h-10 rounded-xl bg-brand px-4 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(0,163,224,0.3)] hover:bg-brand/90 transition-colors">
          <Plus className="h-4 w-4" />
          Add Property
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-14 rounded-xl bg-slate-100 animate-pulse" />)}
          </div>
        ) : data?.properties?.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Property</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 hidden lg:table-cell">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 hidden lg:table-cell">Views</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.properties.map((prop) => (
                    <tr key={prop._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={prop.images?.[0]?.url || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=80&q=60"} alt={prop.title} className="h-10 w-14 rounded-lg object-cover shrink-0" />
                          <div className="min-w-0">
                            <p className="font-semibold text-brand-ink truncate max-w-[180px]">{prop.title}</p>
                            <p className="text-xs text-slate-400">{prop.type} · {prop.subType || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-1 text-slate-600">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{prop.location?.city}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="font-semibold text-brand-ink">{prop.price?.displayPrice || `₹${(prop.price?.amount / 100000).toFixed(1)}L`}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-1 text-slate-500">
                          <Eye className="h-3.5 w-3.5" />
                          {prop.views ?? 0}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${prop.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                          {prop.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleToggleFeatured(prop._id, !!prop.isFeatured)} title={prop.isFeatured ? "Remove featured" : "Mark featured"} className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${prop.isFeatured ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100" : "text-slate-400 hover:bg-slate-100"}`}>
                            <Star className="h-4 w-4" fill={prop.isFeatured ? "currentColor" : "none"} />
                          </button>
                          <a href={`/properties/${prop.slug}`} target="_blank" className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                            <Eye className="h-4 w-4" />
                          </a>
                          <button onClick={() => navigate({ to: "/agent/property/$id/edit", params: { id: prop.slug } })} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-brand transition-colors">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(prop._id, prop.title)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {data.pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                <p className="text-xs text-slate-400">Page {page} of {data.pages}</p>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="h-8 px-3 rounded-lg border border-slate-200 text-xs font-medium disabled:opacity-40 hover:bg-slate-50 transition-colors">Prev</button>
                  <button disabled={page === data.pages} onClick={() => setPage(p => p + 1)} className="h-8 px-3 rounded-lg border border-slate-200 text-xs font-medium disabled:opacity-40 hover:bg-slate-50 transition-colors">Next</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Building2 className="h-12 w-12 mb-3 opacity-30" />
            <p className="font-medium">No properties found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
