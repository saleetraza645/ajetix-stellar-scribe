import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/projects")({
  component: AdminProjects,
});

function AdminProjects() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: api.listProjects,
  });

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Portfolio projects</h2>
        <p className="text-xs text-muted-foreground">
          Create/edit forms ship in the next admin build — use the API directly to seed for now.
        </p>
      </header>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="glass rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm">
            <AlertCircle size={16} className="text-destructive" />
            Couldn't load projects.
          </div>
          <button onClick={() => refetch()} className="rounded-full glass px-4 py-2 text-xs hover:bg-white/10">Retry</button>
        </div>
      )}

      {data && (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-right">Views</th>
              </tr>
            </thead>
            <tbody>
              {data.projects.map((p) => (
                <tr key={p._id} className="border-t border-white/5">
                  <td className="px-4 py-3">{p.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3 font-mono text-xs">{p.slug}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{p.views}</td>
                </tr>
              ))}
              {data.projects.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No projects yet. Seed via <code>POST /api/projects</code>.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}