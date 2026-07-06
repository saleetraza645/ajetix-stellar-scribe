import type { Project } from "@/lib/portfolio-data";

/** Cover art with gradient overlay — used on home, portfolio grid, and detail. */
export function ProjectCover({ project, className = "" }: { project: Project; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {project.coverImage && (
        <img
          src={project.coverImage}
          alt={`${project.title} cover`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.gradient}${project.coverImage ? " opacity-75" : ""}`}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_60%)]" />
    </div>
  );
}
