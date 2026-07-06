import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiProjectAdmin } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/projects")({
  component: AdminProjects,
});

function AdminProjects() {
  const qc = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "projects", "all"],
    queryFn: api.adminListProjects,
  });
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const del = useMutation({
    mutationFn: (id: string) => api.deleteProject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "projects"] }),
  });

  const togglePublished = useMutation({
    mutationFn: (p: ApiProjectAdmin) =>
      api.updateProject(p._id, { published: !p.published }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "projects"] }),
  });

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Portfolio projects</h2>
        <Link
          to="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground px-4 py-2 text-xs font-medium transition"
        >
          <Plus size={14} /> New project
        </Link>
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
                <th className="px-4 py-3 text-right">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data.projects as ApiProjectAdmin[]).map((p) => (
                <tr key={p._id} className="border-t border-white/5">
                  <td className="px-4 py-3">{p.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3 font-mono text-xs">{p.slug}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{p.views}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => togglePublished.mutate(p)}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${p.published ? "bg-emerald-500/15 text-emerald-300" : "bg-white/5 text-muted-foreground"}`}
                    >
                      {p.published ? <Eye size={12}/> : <EyeOff size={12}/>}
                      {p.published ? "Live" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Link
                        to="/admin/projects/$id/edit"
                        params={{ id: p._id }}
                        className="rounded-full glass p-2 hover:bg-white/10"
                        aria-label="Edit"
                      >
                        <Pencil size={14}/>
                      </Link>
                      {pendingDelete === p._id ? (
                        <>
                          <button
                            onClick={() => { del.mutate(p._id); setPendingDelete(null); }}
                            className="rounded-full bg-destructive/90 text-destructive-foreground px-3 py-1.5 text-xs"
                          >Confirm</button>
                          <button
                            onClick={() => setPendingDelete(null)}
                            className="rounded-full glass px-3 py-1.5 text-xs hover:bg-white/10"
                          >Cancel</button>
                        </>
                      ) : (
                        <button
                          onClick={() => setPendingDelete(p._id)}
                          className="rounded-full glass p-2 hover:bg-white/10 text-destructive"
                          aria-label="Delete"
                        >
                          <Trash2 size={14}/>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {data.projects.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No projects yet. Click <strong>New project</strong> to add one.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}