import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useDashboard } from "@/hooks/useApi";
import { DashboardLayout, StatCard } from "@/components/dashboard/DashboardLayout";
import { Building2, MessageSquare, Users, TrendingUp, Clock, CheckCircle, Eye, Phone } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  site_visit_scheduled: "bg-purple-100 text-purple-700",
  negotiating: "bg-orange-100 text-orange-700",
  converted: "bg-emerald-100 text-emerald-700",
  lost: "bg-red-100 text-red-700",
};

function AdminDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { data: dashboard, isLoading } = useDashboard();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") navigate({ to: "/login" });
  }, [isAuthenticated, user]);

  if (isLoading) return (
    <DashboardLayout title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-slate-200 animate-pulse" />
        ))}
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Dashboard" subtitle={`Welcome back, ${user?.name}`}>
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Properties" value={dashboard?.totalProperties ?? 0} sub="Active listings" icon={<Building2 className="h-5 w-5" />} color="brand" trend={{ value: 12, label: "this month" }} />
        <StatCard label="Total Inquiries" value={dashboard?.totalInquiries ?? 0} sub={`${dashboard?.newInquiriesToday ?? 0} today`} icon={<MessageSquare className="h-5 w-5" />} color="orange" trend={{ value: 8, label: "this week" }} />
        <StatCard label="Active Users" value={dashboard?.totalUsers ?? 0} sub="Registered users" icon={<Users className="h-5 w-5" />} color="purple" />
        <StatCard label="Active Agents" value={dashboard?.activeAgents ?? 0} sub="Field agents" icon={<TrendingUp className="h-5 w-5" />} color="green" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Recent Inquiries */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-brand-ink">Recent Inquiries</h2>
            <a href="/admin/inquiries" className="text-xs font-semibold text-brand hover:underline">View all</a>
          </div>
          <div className="divide-y divide-slate-100">
            {dashboard?.recentInquiries?.length ? dashboard.recentInquiries.map((inq: any) => (
              <div key={inq._id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-brand/10 text-brand font-bold text-sm shrink-0">
                  {inq.name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-brand-ink truncate">{inq.name}</p>
                  <p className="text-xs text-slate-400 truncate">{inq.phone} · {inq.city || "—"}</p>
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
              <p className="px-5 py-8 text-center text-sm text-slate-400">No inquiries yet</p>
            )}
          </div>
        </div>

        {/* Recent Properties */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-brand-ink">Recent Properties</h2>
            <a href="/admin/properties" className="text-xs font-semibold text-brand hover:underline">View all</a>
          </div>
          <div className="divide-y divide-slate-100">
            {dashboard?.recentProperties?.length ? dashboard.recentProperties.map((prop: any) => (
              <div key={prop._id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <img
                  src={prop.images?.[0]?.url || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=80&q=60"}
                  alt={prop.title}
                  className="h-10 w-14 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-brand-ink truncate">{prop.title}</p>
                  <p className="text-xs text-slate-400 truncate">{prop.location?.city} · {prop.type}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
                  <Eye className="h-3.5 w-3.5" />
                  {prop.views ?? 0}
                </div>
              </div>
            )) : (
              <p className="px-5 py-8 text-center text-sm text-slate-400">No properties yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Inquiry trend chart placeholder */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-brand-ink">Inquiry Trend (Last 6 Months)</h2>
        </div>
        <div className="flex items-end gap-2 h-32">
          {dashboard?.inquiriesByMonth?.map((m: any, i: number) => {
            const max = Math.max(...(dashboard.inquiriesByMonth.map((x: any) => x.count) || [1]));
            const height = max > 0 ? Math.round((m.count / max) * 100) : 10;
            const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-semibold text-brand">{m.count}</span>
                <div className="w-full rounded-t-lg bg-brand/20 hover:bg-brand/40 transition-colors" style={{ height: `${height}%` }} />
                <span className="text-[10px] text-slate-400">{months[(m._id?.month ?? 1) - 1]}</span>
              </div>
            );
          }) ?? (
            <p className="text-sm text-slate-400 m-auto">No data yet</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
