import { createFileRoute, Link } from "@tanstack/react-router";
import { ProjectForm } from "@/components/admin/project-form";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/projects/new")({
  component: NewProject,
});

function NewProject() {
  return (
    <section className="space-y-4">
      <header className="flex items-center gap-3">
        <Link to="/admin/projects" className="rounded-full glass p-2 hover:bg-white/10" aria-label="Back">
          <ArrowLeft size={16}/>
        </Link>
        <h2 className="text-lg font-semibold">New project</h2>
      </header>
      <ProjectForm mode="create" />
    </section>
  );
}