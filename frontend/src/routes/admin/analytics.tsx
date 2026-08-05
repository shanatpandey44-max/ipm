import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { usePropertyStats } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout, StatCard } from "@/components/dashboard/DashboardLayout";
import { Building2, MessageSquare, TrendingUp, MapPin } from "lucide-react";
import api from "@/lib/api";

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalytics,
});

function Bar({ label, value, max, color = "bg-brand" }: { label: string; value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-xs text-slate-500 truncate shrink-0">{label}</span>
      <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-xs font-semibold text-brand-ink text-right shrink-0">{value}</span>
    </div>
  );
}

function AdminAnalytics() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") navigate({ to: "/login" });
  }, [isAuthenticated, user]);

  const { data: propStats } = usePropertyStats();
  const { data: inqStats } = useQuery({
    queryKey: ["inquiry-stats"],
    queryFn: async () => {
      const { data } = await api.get("/inquiries/stats");
      return data.stats;
    },
    staleTime: 1000 * 60,
  });

  const maxCity = Math.max(...(propStats?.byCity?.map((c: any) => c.count) || [1]));
  const maxType = Math.max(...(propStats?.byType?.map((t: any) => t.count) || [1]));
  const maxInqCity = Math.max(...(inqStats?.byCity?.map((c: any) => c.count) || [1]));
  const maxSource = Math.max(...(inqStats?.bySource?.map((s: any) => s.count) || [1]));

  return (
    <DashboardLayout title="Analytics" subtitle="Property & inquiry insights">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Total Properties" value={propStats?.total ?? 0} icon={<Building2 className="h-5 w-5" />} color="brand" />
        <StatCard label="Featured" value={propStats?.featured ?? 0} sub="Highlighted listings" icon={<TrendingUp className="h-5 w-5" />} color="green" />
        <StatCard label="Total Inquiries" value={inqStats?.total ?? 0} icon={<MessageSquare className="h-5 w-5" />} color="orange" />
        <StatCard label="Today's Inquiries" value={inqStats?.todayCount ?? 0} sub={`${inqStats?.weekCount ?? 0} this week`} icon={<MapPin className="h-5 w-5" />} color="purple" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Properties by City */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <h3 className="font-semibold text-brand-ink mb-4">Properties by City</h3>
          <div className="space-y-3">
            {propStats?.byCity?.map((c: any) => (
              <Bar key={c._id} label={c._id} value={c.count} max={maxCity} />
            )) ?? <p className="text-sm text-slate-400">No data</p>}
          </div>
        </div>

        {/* Properties by Type */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <h3 className="font-semibold text-brand-ink mb-4">Properties by Type</h3>
          <div className="space-y-3">
            {propStats?.byType?.map((t: any) => (
              <Bar key={t._id} label={t._id} value={t.count} max={maxType} color="bg-purple-400" />
            )) ?? <p className="text-sm text-slate-400">No data</p>}
          </div>
        </div>

        {/* Inquiries by Status */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <h3 className="font-semibold text-brand-ink mb-4">Inquiries by Status</h3>
          <div className="grid grid-cols-2 gap-3">
            {inqStats?.byStatus?.map((s: any) => {
              const colors: Record<string, string> = { new: "bg-blue-50 text-blue-700", contacted: "bg-yellow-50 text-yellow-700", converted: "bg-emerald-50 text-emerald-700", lost: "bg-red-50 text-red-600" };
              return (
                <div key={s._id} className={`rounded-xl p-4 ${colors[s._id] || "bg-slate-50 text-slate-700"}`}>
                  <p className="text-2xl font-bold">{s.count}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider mt-1 opacity-80">{s._id?.replace(/_/g, " ")}</p>
                </div>
              );
            }) ?? <p className="text-sm text-slate-400 col-span-2">No data</p>}
          </div>
        </div>

        {/* Inquiries by Source */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <h3 className="font-semibold text-brand-ink mb-4">Inquiries by Source</h3>
          <div className="space-y-3">
            {inqStats?.bySource?.map((s: any) => (
              <Bar key={s._id} label={s._id?.replace(/_/g, " ")} value={s.count} max={maxSource} color="bg-emerald-400" />
            )) ?? <p className="text-sm text-slate-400">No data</p>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
