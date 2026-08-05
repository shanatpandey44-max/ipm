import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MessageSquare, Phone, Mail, X, Send } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import type { Inquiry } from "@/lib/types";

export const Route = createFileRoute("/agent/inquiries")({
  component: AgentInquiries,
});

const STATUS_OPTIONS = ["new","contacted","site_visit_scheduled","negotiating","converted","lost"];
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  site_visit_scheduled: "bg-purple-100 text-purple-700",
  negotiating: "bg-orange-100 text-orange-700",
  converted: "bg-emerald-100 text-emerald-700",
  lost: "bg-red-100 text-red-700",
};

function AgentInquiries() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !["agent", "admin"].includes(user?.role || "")) navigate({ to: "/login" });
  }, [isAuthenticated, user]);

  const { data, isLoading } = useQuery({
    queryKey: ["agent-inquiries-list"],
    queryFn: async () => {
      const { data } = await api.get("/inquiries", { params: { limit: 50 } });
      return data;
    },
    staleTime: 1000 * 30,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const { data } = await api.put(`/inquiries/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agent-inquiries-list"] });
      toast.success("Updated");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleAddNote = () => {
    if (!note.trim() || !selected) return;
    updateMutation.mutate({ id: selected._id, payload: { note } });
    setNote("");
  };

  return (
    <DashboardLayout title="My Inquiries" subtitle={`${data?.total ?? 0} total · ${data?.unreadCount ?? 0} unread`}>
      <div className="flex gap-5 h-[calc(100vh-200px)]">
        {/* List */}
        <div className={`flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden ${selected ? "hidden lg:flex lg:w-[380px] lg:shrink-0" : "flex-1"}`}>
          {isLoading ? (
            <div className="p-4 space-y-3">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />)}</div>
          ) : data?.inquiries?.length ? (
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {data.inquiries.map((inq: Inquiry) => (
                <button key={inq._id} onClick={() => setSelected(inq)} className={`w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors ${selected?._id === inq._id ? "bg-brand/5 border-l-2 border-brand" : ""} ${!inq.isRead ? "bg-blue-50/40" : ""}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {!inq.isRead && <span className="h-2 w-2 rounded-full bg-brand shrink-0" />}
                        <p className="text-sm font-semibold text-brand-ink truncate">{inq.name}</p>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{inq.phone} · {inq.city || "—"}</p>
                      {inq.message && <p className="text-xs text-slate-500 mt-1 truncate">{inq.message}</p>}
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase shrink-0 ${STATUS_COLORS[inq.status] || "bg-slate-100 text-slate-600"}`}>
                      {inq.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-slate-400">
              <MessageSquare className="h-10 w-10 mb-2 opacity-30" />
              <p className="text-sm">No inquiries assigned yet</p>
            </div>
          )}
        </div>

        {/* Detail */}
        {selected && (
          <div className="flex-1 flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="font-bold text-brand-ink">{selected.name}</h3>
                <p className="text-xs text-slate-400">{new Date(selected.createdAt).toLocaleString("en-IN")}</p>
              </div>
              <button onClick={() => setSelected(null)} className="grid h-8 w-8 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <a href={`tel:${selected.phone}`} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-brand-ink hover:bg-brand/5 hover:border-brand transition-colors">
                  <Phone className="h-4 w-4 text-brand" />{selected.phone}
                </a>
                {selected.email && (
                  <a href={`mailto:${selected.email}`} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-brand-ink hover:bg-brand/5 hover:border-brand transition-colors truncate">
                    <Mail className="h-4 w-4 text-brand" /><span className="truncate">{selected.email}</span>
                  </a>
                )}
              </div>

              <div className="rounded-xl bg-slate-50 p-4 space-y-2 text-sm">
                {[["Type", selected.inquiryType], ["City", selected.city], ["Property", (selected.property as any)?.title], ["Source", selected.source]].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2">
                    <span className="text-slate-400">{k}</span>
                    <span className="font-medium text-brand-ink">{v}</span>
                  </div>
                ))}
                {selected.message && (
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-slate-400 mb-1">Message</p>
                    <p className="text-brand-ink">{selected.message}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={() => { updateMutation.mutate({ id: selected._id, payload: { status: s } }); setSelected(prev => prev ? { ...prev, status: s as any } : null); }} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${selected.status === s ? STATUS_COLORS[s] + " ring-2 ring-offset-1 ring-current" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                      {s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>

              {selected.notes && selected.notes.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Notes</p>
                  <div className="space-y-2">
                    {selected.notes.map((n, i) => (
                      <div key={i} className="rounded-xl bg-slate-50 px-4 py-3 text-sm">
                        <p className="text-brand-ink">{n.text}</p>
                        <p className="text-xs text-slate-400 mt-1">{(n.addedBy as any)?.name} · {new Date(n.addedAt).toLocaleDateString("en-IN")}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 p-4 shrink-0">
              <div className="flex gap-2">
                <input value={note} onChange={e => setNote(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddNote()} placeholder="Add a note..." className="flex-1 h-10 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
                <button onClick={handleAddNote} disabled={!note.trim()} className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white disabled:opacity-40 hover:bg-brand/90 transition-colors">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
