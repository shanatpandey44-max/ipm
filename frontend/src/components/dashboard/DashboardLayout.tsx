import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";
import {
  LayoutDashboard, Building2, MessageSquare, Users, Settings,
  LogOut, Menu, X, Bell, ChevronDown, Home, TrendingUp,
  FileText, UserCheck,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  const adminNav: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "Properties", href: "/admin/properties", icon: <Building2 className="h-4 w-4" /> },
    { label: "Inquiries", href: "/admin/inquiries", icon: <MessageSquare className="h-4 w-4" /> },
    { label: "Users & Agents", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
    { label: "Analytics", href: "/admin/analytics", icon: <TrendingUp className="h-4 w-4" /> },
  ];

  const agentNav: NavItem[] = [
    { label: "Dashboard", href: "/agent", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "My Properties", href: "/agent/properties", icon: <Building2 className="h-4 w-4" /> },
    { label: "Inquiries", href: "/agent/inquiries", icon: <MessageSquare className="h-4 w-4" /> },
    { label: "Add Property", href: "/agent/properties/new", icon: <FileText className="h-4 w-4" /> },
  ];

  const navItems = isAdmin ? adminNav : agentNav;

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/login" });
  };

  const Sidebar = () => (
    <aside className="flex h-full flex-col bg-brand-ink">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/8">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-[#0077b6] shadow-[0_4px_12px_rgba(0,163,224,0.4)] shrink-0">
          <Building2 className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white truncate">IPM</p>
          <p className="text-[10px] text-white/40 uppercase tracking-wider">{isAdmin ? "Admin Panel" : "Agent Portal"}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active = currentPath === item.href || (item.href !== "/admin" && item.href !== "/agent" && currentPath.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-brand text-white shadow-[0_4px_12px_rgba(0,163,224,0.3)]"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              }`}
            >
              {item.icon}
              {item.label}
              {item.badge ? (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/8 p-3 space-y-0.5">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all"
        >
          <Home className="h-4 w-4" />
          View Website
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-60 lg:flex-col lg:shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 flex flex-col">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 lg:px-6 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 transition-colors lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-brand-ink truncate">{title}</h1>
              {subtitle && <p className="text-xs text-slate-400 truncate">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Notification bell */}
            <button className="relative grid h-9 w-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <div className="grid h-6 w-6 place-items-center rounded-full bg-brand text-white text-xs font-bold shrink-0">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <span className="hidden sm:block max-w-[120px] truncate">{user?.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-brand-ink truncate">{user?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">
                      {user?.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// Stat card component
export function StatCard({
  label, value, sub, icon, color = "brand", trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color?: "brand" | "green" | "orange" | "purple";
  trend?: { value: number; label: string };
}) {
  const colors = {
    brand: "bg-brand/10 text-brand",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-500",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${colors[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-semibold ${trend.value >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-brand-ink">{value}</p>
      <p className="text-sm font-medium text-slate-600 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}
