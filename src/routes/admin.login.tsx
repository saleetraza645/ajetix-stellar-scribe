import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { api, authToken, ApiError, API_ENABLED } from "@/lib/api-client";
import { Loader2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Admin Login — Ajetix" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!API_ENABLED) {
      setError("Admin API not configured. See server/README.md.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await api.login(email, password);
      authToken.set(res.token);
      navigate({ to: "/admin" });
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-6">
      <div className="w-full glass rounded-2xl p-8">
        <p className="text-xs uppercase tracking-widest text-cyan">Ajetix</p>
        <h1 className="mt-1 text-2xl font-semibold">Admin sign in</h1>
        <p className="mt-2 text-xs text-muted-foreground">
          Restricted area. Access requires an admin account.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-primary/60"
            />
          </div>
          <div>
            <label className="text-xs font-medium">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-primary/60"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-xs text-destructive">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-medium text-white shadow-glow hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : null}
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}