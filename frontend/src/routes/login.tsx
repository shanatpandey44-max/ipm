import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Building2, Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("admin@theipm.in");
  const [password, setPassword] = useState("Admin@IPM2024");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const redirectAfterLogin = async () => {
    const user = useAuthStore.getState().user;
    if (user?.role === "admin") navigate({ to: "/admin" });
    else if (user?.role === "agent") navigate({ to: "/agent" });
    else navigate({ to: "/" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      await redirectAfterLogin();
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    }
  };

  const handleQuickSignIn = async () => {
    setError("");
    try {
      await login("admin@theipm.in", "Admin@IPM2024");
      await redirectAfterLogin();
    } catch (err: any) {
      setError(err.message || "Unable to sign in");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-ink via-[#0d1f3c] to-[#0a1628] flex items-center justify-center p-4">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-brand/8 blur-2xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-brand to-[#0077b6] shadow-[0_8px_32px_rgba(0,163,224,0.4)] mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-white">Indore Property Management</h1>
          <p className="text-white/50 text-sm mt-1">Sign in to your dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-brand-ink mb-6">Welcome back</h2>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 mb-5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@theipm.in"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-11 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-brand text-white font-semibold text-sm shadow-[0_4px_14px_rgba(0,163,224,0.35)] hover:bg-brand/90 hover:shadow-[0_6px_20px_rgba(0,163,224,0.5)] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <button
            type="button"
            onClick={handleQuickSignIn}
            disabled={isLoading}
            className="w-full h-11 rounded-xl border border-slate-200 bg-slate-100 text-slate-900 font-semibold text-sm hover:bg-slate-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-3"
          >
            Quick Admin Sign In
          </button>

          <p className="text-center text-xs text-slate-400 mt-6">
            <a href="/" className="hover:text-brand transition-colors">← Back to website</a>
          </p>
        </div>
      </div>
    </div>
  );
}
