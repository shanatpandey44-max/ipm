import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Users, Plus, X, UserCheck, UserX, Shield } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [role, setRole] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") navigate({ to: "/login" });
  }, [isAuthenticated, user]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", role],
    queryFn: async () => {
      const { data } = await api.get("/admin/users", { params: { role: role || undefined, limit: 50 } });
      return data;
    },
  });

  const createAgent = useMutation({
    mutationFn: async (payload: typeof form) => {
      const { data } = await api.post("/admin/users/agent", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Agent created successfully");
      setShowCreate(false);
      setForm({ name: "", email: "", phone: "", password: "" });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data } = await api.put(`/admin/users/${id}`, { isActive });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User updated");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const ROLE_COLORS: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700",
    agent: "bg-brand/10 text-brand",
    user: "bg-slate-100 text-slate-600",
  };

  return (
    <DashboardLayout title="Users & Agents" subtitle={`${data?.total ?? 0} total users`}>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-2">
          {["", "admin", "agent", "user"].map((r) => (
            <button key={r} onClick={() => setRole(r)} className={`h-8 rounded-full px-4 text-xs font-semibold transition-all ${role === r ? "bg-brand text-white shadow-[0_4px_12px_rgba(0,163,224,0.3)]" : "bg-white border border-slate-200 text-slate-600 hover:border-brand hover:text-brand"}`}>
              {r ? r.charAt(0).toUpperCase() + r.slice(1) + "s" : "All"}
            </button>
          ))}
        </div>
        <button onClick={() => setShowCreate(true)} className="ml-auto flex items-center gap-2 h-10 rounded-xl bg-brand px-4 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(0,163,224,0.3)] hover:bg-brand/90 transition-colors">
          <Plus className="h-4 w-4" />
          Create Agent
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-14 rounded-xl bg-slate-100 animate-pulse" />)}</div>
        ) : data?.users?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 hidden lg:table-cell">Joined</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.users.map((u: any) => (
                  <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-brand/10 text-brand font-bold text-sm shrink-0">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-brand-ink truncate">{u.name}</p>
                          <p className="text-xs text-slate-400 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-slate-600">{u.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${ROLE_COLORS[u.role] || "bg-slate-100 text-slate-600"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-slate-400 text-xs">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {u._id !== user?._id && (
                          <button
                            onClick={() => toggleActive.mutate({ id: u._id, isActive: !u.isActive })}
                            title={u.isActive ? "Deactivate" : "Activate"}
                            className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${u.isActive ? "text-emerald-500 hover:bg-emerald-50" : "text-red-400 hover:bg-red-50"}`}
                          >
                            {u.isActive ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                          </button>
                        )}
                        {u.role === "admin" && <Shield className="h-4 w-4 text-purple-400 mx-1" />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Users className="h-12 w-12 mb-3 opacity-30" />
            <p className="font-medium">No users found</p>
          </div>
        )}
      </div>

      {/* Create Agent Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-brand-ink">Create Agent Account</h3>
              <button onClick={() => setShowCreate(false)} className="grid h-8 w-8 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); createAgent.mutate(form); }} className="p-6 space-y-4">
              {[
                { key: "name", label: "Full Name", type: "text", placeholder: "Santosh Prasad" },
                { key: "email", label: "Email", type: "email", placeholder: "agent@theipm.in" },
                { key: "phone", label: "Phone", type: "tel", placeholder: "9009444491" },
                { key: "password", label: "Password", type: "password", placeholder: "Min 6 characters" },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">{label}</label>
                  <input
                    type={type}
                    required
                    placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>
              ))}
              <button type="submit" disabled={createAgent.isPending} className="w-full h-11 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand/90 transition-colors disabled:opacity-60 mt-2">
                {createAgent.isPending ? "Creating..." : "Create Agent"}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
