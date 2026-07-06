import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { ProjectForm } from "@/components/admin/project-form";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/projects/$id/edit")({
  component: EditProject,
});

function EditProject() {
  const { id } = Route.useParams();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "projects", "detail", id],
    queryFn: () => api.adminGetProject(id),
  });

  return (
    <section className="space-y-4">
      <header className="flex items-center gap-3">
        <Link to="/admin/projects" className="rounded-full glass p-2 hover:bg-white/10" aria-label="Back">
          <ArrowLeft size={16}/>
        </Link>
        <h2 className="text-lg font-semibold">Edit project</h2>
      </header>

      {isLoading && <Skeleton className="h-96 rounded-2xl" />}
      {isError && (
        <div className="glass rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm">
            <AlertCircle size={16} className="text-destructive" />
            Couldn't load project.
          </div>
          <button onClick={() => refetch()} className="rounded-full glass px-4 py-2 text-xs hover:bg-white/10">Retry</button>
        </div>
      )}
      {data && <ProjectForm mode="edit" projectId={id} initial={data.project} />}
    </section>
  );
}