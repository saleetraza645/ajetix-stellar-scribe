import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: api.analytics,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="glass rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          <AlertCircle size={16} className="text-destructive" />
          Couldn't load analytics.
        </div>
        <button onClick={() => refetch()} className="rounded-full glass px-4 py-2 text-xs hover:bg-white/10">Retry</button>
      </div>
    );
  }

  const s = data.submissions;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="New (unread)" value={s.new} />
        <StatCard label="This week" value={s.week} />
        <StatCard label="This month" value={s.month} />
        <StatCard label="All time" value={s.total} />
      </div>

      <section className="glass rounded-2xl p-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-cyan">Top viewed projects</h2>
        <ul className="mt-4 divide-y divide-white/5">
          {data.topProjects.length === 0 && (
            <li className="py-4 text-sm text-muted-foreground">No view data yet.</li>
          )}
          {data.topProjects.map((p) => (
            <li key={p.slug} className="flex items-center justify-between py-3 text-sm">
              <span>{p.title}</span>
              <span className="text-xs text-muted-foreground">{p.views} views</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass rounded-2xl p-6">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-gradient">{value}</p>
    </div>
  );
}