import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/submissions")({
  component: AdminSubmissions,
});

function AdminSubmissions() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const qc = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "submissions", statusFilter],
    queryFn: () => api.listSubmissions(statusFilter || undefined),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "new" | "replied" | "archived" }) =>
      api.updateSubmissionStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "submissions"] }),
  });

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Contact submissions</h2>
        <div className="flex gap-2">
          {["", "new", "replied", "archived"].map((s) => (
            <button
              key={s || "all"}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1.5 text-xs transition ${statusFilter === s ? "bg-white/10 text-cyan" : "glass hover:bg-white/10"}`}
            >
              {s || "All"}
            </button>
          ))}
        </div>
      </header>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="glass rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm">
            <AlertCircle size={16} className="text-destructive" />
            Couldn't load submissions.
          </div>
          <button onClick={() => refetch()} className="rounded-full glass px-4 py-2 text-xs hover:bg-white/10">Retry</button>
        </div>
      )}

      {data && (
        <div className="space-y-3">
          {data.submissions.length === 0 && (
            <div className="glass rounded-2xl p-6 text-sm text-muted-foreground text-center">No submissions.</div>
          )}
          {data.submissions.map((sub) => (
            <article key={sub._id} className="glass rounded-2xl p-5">
              <header className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{sub.name}</h3>
                  <a href={`mailto:${sub.email}`} className="text-xs text-primary hover:underline">{sub.email}</a>
                  {sub.budget && <span className="ml-3 text-xs text-muted-foreground">Budget: {sub.budget}</span>}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">{new Date(sub.createdAt).toLocaleDateString()}</span>
                  <select
                    value={sub.status}
                    onChange={(e) => updateStatus.mutate({ id: sub._id, status: e.target.value as "new" | "replied" | "archived" })}
                    className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs"
                  >
                    <option value="new">New</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </header>
              <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap">{sub.projectDetails}</p>
              {sub.fileUrls?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {sub.fileUrls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer" className="rounded-full glass px-3 py-1 text-xs hover:bg-white/10">
                      Attachment {i + 1}
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}