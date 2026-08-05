import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useProperties } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout, StatCard } from "@/components/dashboard/DashboardLayout";
import { Building2, MessageSquare, Eye, Phone, Plus } from "lucide-react";
import api from "@/lib/api";

export const Route = createFileRoute("/agent/")({
  component: AgentDashboard,
});

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  site_visit_scheduled: "bg-purple-100 text-purple-700",
  negotiating: "bg-orange-100 text-orange-700",
  converted: "bg-emerald-100 text-emerald-700",
  lost: "bg-red-100 text-red-700",
};

function AgentDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !["agent", "admin"].includes(user?.role || "")) navigate({ to: "/login" });
  }, [isAuthenticated, user]);

  const { data: propertiesData } = useProperties({ limit: 5 });

  const { data: inquiriesData } = useQuery({
    queryKey: ["agent-inquiries"],
    queryFn: async () => {
      const { data } = await api.get("/inquiries", { params: { limit: 5 } });
      return data;
    },
    staleTime: 1000 * 60,
  });

  return (
    <DashboardLayout title="Agent Dashboard" subtitle={`Welcome, ${user?.name}`}>
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <StatCard label="My Properties" value={propertiesData?.total ?? 0} sub="Active listings" icon={<Building2 className="h-5 w-5" />} color="brand" />
        <StatCard label="Assigned Inquiries" value={inquiriesData?.total ?? 0} sub={`${inquiriesData?.unreadCount ?? 0} unread`} icon={<MessageSquare className="h-5 w-5" />} color="orange" />
        <StatCard label="Converted" value={0} sub="This month" icon={<Eye className="h-5 w-5" />} color="green" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* My Properties */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-brand-ink">My Properties</h2>
            <a href="/agent/properties/new" className="flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline">
              <Plus className="h-3.5 w-3.5" />
              Add New
            </a>
          </div>
          <div className="divide-y divide-slate-100">
            {propertiesData?.properties?.length ? propertiesData.properties.map((prop) => (
              <div key={prop._id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <img src={prop.images?.[0]?.url || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=80&q=60"} alt={prop.title} className="h-10 w-14 rounded-lg object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-brand-ink truncate">{prop.title}</p>
                  <p className="text-xs text-slate-400">{prop.location?.city} · {prop.price?.displayPrice}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
                  <Eye className="h-3.5 w-3.5" />
                  {prop.views ?? 0}
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center py-10 text-slate-400">
                <Building2 className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-sm">No properties yet</p>
                <a href="/agent/properties/new" className="mt-2 text-xs font-semibold text-brand hover:underline">Add your first property</a>
              </div>
            )}
          </div>
        </div>

        {/* Assigned Inquiries */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-brand-ink">Assigned Inquiries</h2>
            <a href="/agent/inquiries" className="text-xs font-semibold text-brand hover:underline">View all</a>
          </div>
          <div className="divide-y divide-slate-100">
            {inquiriesData?.inquiries?.length ? inquiriesData.inquiries.map((inq: any) => (
              <div key={inq._id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-brand/10 text-brand font-bold text-sm shrink-0">
                  {inq.name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-brand-ink truncate">{inq.name}</p>
                  <p className="text-xs text-slate-400">{inq.city || inq.inquiryType || "—"}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_COLORS[inq.status] || "bg-slate-100 text-slate-600"}`}>
                    {inq.status}
                  </span>
                  <a href={`tel:${inq.phone}`} className="text-brand hover:text-brand/80">
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center py-10 text-slate-400">
                <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-sm">No inquiries assigned</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
