import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, API_ENABLED, authToken } from "@/lib/api-client";
import { LogOut, LayoutDashboard, FolderKanban, Inbox } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — Ajetix" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname === "/admin/login";
  const [checking, setChecking] = useState(!isLogin);
  const [adminName, setAdminName] = useState<string>("");

  useEffect(() => {
    if (isLogin) { setChecking(false); return; }
    if (!API_ENABLED) { setChecking(false); return; }
    let mounted = true;
    api.me()
      .then((r) => { if (mounted) setAdminName(r.admin.name || r.admin.email); })
      .catch(() => {
        authToken.clear();
        navigate({ to: "/admin/login" });
      })
      .finally(() => { if (mounted) setChecking(false); });
    return () => { mounted = false; };
  }, [isLogin, navigate]);

  if (isLogin) return <Outlet />;

  if (!API_ENABLED) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24">
        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-semibold">Admin API not configured</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            The admin panel talks to a standalone Express + MongoDB server. Deploy the code in
            <code className="mx-1 rounded bg-white/5 px-1.5 py-0.5">server/</code>
            (see <code className="mx-1 rounded bg-white/5 px-1.5 py-0.5">server/README.md</code>),
            then set <code className="mx-1 rounded bg-white/5 px-1.5 py-0.5">VITE_API_BASE_URL</code>
            on this project and republish.
          </p>
        </div>
      </div>
    );
  }

  if (checking) {
    return <div className="mx-auto max-w-6xl px-6 py-24 text-sm text-muted-foreground">Loading…</div>;
  }

  const handleLogout = async () => {
    try { await api.logout(); } catch { /* ignore */ }
    authToken.clear();
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-cyan">Ajetix Admin</p>
          <h1 className="mt-1 text-2xl font-semibold">Welcome, {adminName}</h1>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs hover:bg-white/10 transition"
        >
          <LogOut size={14} /> Log out
        </button>
      </header>

      <nav className="mb-8 flex flex-wrap gap-2">
        {[
          { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
          { to: "/admin/projects", label: "Projects", icon: FolderKanban },
          { to: "/admin/submissions", label: "Submissions", icon: Inbox },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.exact }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs hover:bg-white/10 transition [&.active]:bg-white/10 [&.active]:text-cyan"
            activeProps={{ className: "active" }}
          >
            <item.icon size={14} />
            {item.label}
          </Link>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}