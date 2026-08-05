import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useProperties } from "@/hooks/useApi";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Plus, Eye, Trash2, Building2, MapPin, Pencil } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/agent/properties")({
  component: AgentProperties,
});

function AgentProperties() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated || !["agent", "admin"].includes(user?.role || "")) navigate({ to: "/login" });
  }, [isAuthenticated, user]);

  const { data, isLoading, refetch } = useProperties({ page, limit: 12 });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await api.delete(`/properties/${id}`);
      toast.success("Property deleted");
      refetch();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <DashboardLayout title="My Properties" subtitle={`${data?.total ?? 0} listings`}>
      <div className="flex justify-end mb-5">
        <button onClick={() => navigate({ to: "/agent/property/new" })} className="flex items-center gap-2 h-10 rounded-xl bg-brand px-4 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(0,163,224,0.3)] hover:bg-brand/90 transition-colors">
          <Plus className="h-4 w-4" />
          Add Property
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-56 rounded-2xl bg-slate-200 animate-pulse" />)}
        </div>
      ) : data?.properties?.length ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.properties.map((prop) => (
              <div key={prop._id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                <div className="relative h-40 overflow-hidden">
                  <img src={prop.images?.[0]?.url || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=70"} alt={prop.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${prop.isFeatured ? "bg-yellow-400 text-yellow-900" : "bg-white/90 text-slate-700"}`}>
                      {prop.isFeatured ? "⭐ Featured" : prop.label || prop.type}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-brand-ink truncate">{prop.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                    <MapPin className="h-3 w-3" />
                    {prop.location?.city} · {prop.location?.locality || prop.location?.address}
                  </div>
                  <p className="text-sm font-bold text-brand mt-2">{prop.price?.displayPrice || `₹${(prop.price?.amount / 100000).toFixed(1)}L`}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Eye className="h-3.5 w-3.5" />
                      {prop.views ?? 0} views
                    </div>
                    <div className="flex gap-1">
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
                  </div>
                </div>
              </div>
            ))}
          </div>
          {data.pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="h-9 px-4 rounded-xl border border-slate-200 text-sm font-medium disabled:opacity-40 hover:bg-slate-50 transition-colors">Previous</button>
              <span className="text-sm text-slate-500">Page {page} of {data.pages}</span>
              <button disabled={page === data.pages} onClick={() => setPage(p => p + 1)} className="h-9 px-4 rounded-xl border border-slate-200 text-sm font-medium disabled:opacity-40 hover:bg-slate-50 transition-colors">Next</button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Building2 className="h-14 w-14 mb-4 opacity-20" />
          <p className="font-semibold text-lg">No properties yet</p>
          <p className="text-sm mt-1">Add your first property listing</p>
          <button onClick={() => navigate({ to: "/agent/property/new" })} className="mt-4 flex items-center gap-2 h-10 rounded-xl bg-brand px-5 text-sm font-semibold text-white hover:bg-brand/90 transition-colors">
            <Plus className="h-4 w-4" />
            Add Property
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}
