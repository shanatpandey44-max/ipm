import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MessageSquare, Phone, Mail, MapPin, Clock, ChevronDown, X, Send } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import type { Inquiry } from "@/lib/types";

export const Route = createFileRoute("/admin/inquiries")({
  component: AdminInquiries,
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

function AdminInquiries() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") navigate({ to: "/login" });
  }, [isAuthenticated, user]);

  const { data, isLoading } = useQuery({
    queryKey: ["inquiries", status, page],
    queryFn: async () => {
      const params: any = { page, limit: 15 };
      if (status) params.status = status;
      const { data } = await api.get("/inquiries", { params });
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const { data } = await api.put(`/inquiries/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inquiries"] });
      toast.success("Inquiry updated");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    updateMutation.mutate({ id, payload: { status: newStatus } });
    if (selected?._id === id) setSelected((prev) => prev ? { ...prev, status: newStatus as any } : null);
  };

  const handleAddNote = () => {
    if (!note.trim() || !selected) return;
    updateMutation.mutate({ id: selected._id, payload: { note } });
    setNote("");
  };

  return (
    <DashboardLayout title="Inquiries" subtitle={`${data?.total ?? 0} total · ${data?.unreadCount ?? 0} unread`}>
      <div className="flex flex-wrap gap-2 mb-5">
        {["", ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            className={`h-8 rounded-full px-4 text-xs font-semibold transition-all ${status === s ? "bg-brand text-white shadow-[0_4px_12px_rgba(0,163,224,0.3)]" : "bg-white border border-slate-200 text-slate-600 hover:border-brand hover:text-brand"}`}
          >
            {s ? s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "All"}
          </button>
        ))}
      </div>

      <div className="flex gap-5 h-[calc(100vh-220px)]">
        {/* List */}
        <div className={`flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden ${selected ? "hidden lg:flex lg:w-[420px] lg:shrink-0" : "flex-1"}`}>
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />)}
            </div>
          ) : data?.inquiries?.length ? (
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {data.inquiries.map((inq: Inquiry) => (
                <button
                  key={inq._id}
                  onClick={() => setSelected(inq)}
                  className={`w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors ${selected?._id === inq._id ? "bg-brand/5 border-l-2 border-brand" : ""} ${!inq.isRead ? "bg-blue-50/50" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {!inq.isRead && <span className="h-2 w-2 rounded-full bg-brand shrink-0" />}
                        <p className="text-sm font-semibold text-brand-ink truncate">{inq.name}</p>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{inq.phone} · {inq.city || inq.inquiryType || "—"}</p>
                      {inq.message && <p className="text-xs text-slate-500 mt-1 truncate">{inq.message}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_COLORS[inq.status] || "bg-slate-100 text-slate-600"}`}>
                        {inq.status}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(inq.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-slate-400">
              <MessageSquare className="h-10 w-10 mb-2 opacity-30" />
              <p className="text-sm">No inquiries found</p>
            </div>
          )}
          {data?.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 shrink-0">
              <p className="text-xs text-slate-400">Page {page} of {data.pages}</p>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="h-7 px-3 rounded-lg border border-slate-200 text-xs disabled:opacity-40 hover:bg-slate-50">Prev</button>
                <button disabled={page === data.pages} onClick={() => setPage(p => p + 1)} className="h-7 px-3 rounded-lg border border-slate-200 text-xs disabled:opacity-40 hover:bg-slate-50">Next</button>
              </div>
            </div>
          )}
        </div>

        {/* Detail Panel */}
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
              {/* Contact info */}
              <div className="grid grid-cols-2 gap-3">
                <a href={`tel:${selected.phone}`} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-brand-ink hover:bg-brand/5 hover:border-brand transition-colors">
                  <Phone className="h-4 w-4 text-brand" />
                  {selected.phone}
                </a>
                {selected.email && (
                  <a href={`mailto:${selected.email}`} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-brand-ink hover:bg-brand/5 hover:border-brand transition-colors truncate">
                    <Mail className="h-4 w-4 text-brand" />
                    <span className="truncate">{selected.email}</span>
                  </a>
                )}
              </div>

              {/* Details */}
              <div className="rounded-xl bg-slate-50 p-4 space-y-2 text-sm">
                {[
                  ["Inquiry Type", selected.inquiryType],
                  ["City", selected.city],
                  ["Property Type", selected.propertyType],
                  ["Source", selected.source],
                  ["Property", (selected.property as any)?.title],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2">
                    <span className="text-slate-400">{k}</span>
                    <span className="font-medium text-brand-ink text-right">{v}</span>
                  </div>
                ))}
                {selected.message && (
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-slate-400 mb-1">Message</p>
                    <p className="text-brand-ink">{selected.message}</p>
                  </div>
                )}
              </div>

              {/* Status update */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selected._id, s)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${selected.status === s ? STATUS_COLORS[s] + " ring-2 ring-offset-1 ring-current" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    >
                      {s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
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

            {/* Add note */}
            <div className="border-t border-slate-100 p-4 shrink-0">
              <div className="flex gap-2">
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  placeholder="Add a note..."
                  className="flex-1 h-10 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
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
