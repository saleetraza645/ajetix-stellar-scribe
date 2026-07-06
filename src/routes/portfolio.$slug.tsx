import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
<<<<<<< HEAD
import { API_ENABLED } from "@/lib/api-client";
import { fetchProject, usePortfolioProject, usePortfolioProjects } from "@/lib/portfolio-queries";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/portfolio/$slug")({
  loader: async ({ params }) => {
    const project = await fetchProject(params.slug);
=======
import { getProject, projects } from "@/lib/portfolio-data";

export const Route = createFileRoute("/portfolio/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
>>>>>>> a25318459c6d5f0d463fa1ed2c0fa7553a6d1ef2
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Project not found — Ajetix" }, { name: "robots", content: "noindex" }] };
    }
    const { project } = loaderData;
    return {
      meta: [
        { title: `${project.title} — Ajetix Portfolio` },
        { name: "description", content: project.description },
        { property: "og:title", content: project.title },
        { property: "og:description", content: project.tagline },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/portfolio/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/portfolio/${params.slug}` }],
    };
  },
  component: ProjectDetail,
});

function ProjectDetail() {
<<<<<<< HEAD
  const { slug } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const { data: project = loaderData.project, isLoading, isError, refetch } = usePortfolioProject(slug);
  const { data: allProjects = [] } = usePortfolioProjects();

  if (API_ENABLED && isLoading && !project) {
    return (
      <article className="mx-auto max-w-5xl px-5 sm:px-6 py-16 sm:py-20">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-8 h-12 w-2/3" />
        <Skeleton className="mt-6 h-6 w-full max-w-3xl" />
        <Skeleton className="mt-12 aspect-[16/9] rounded-3xl" />
      </article>
    );
  }

  if (API_ENABLED && isError) {
    return (
      <article className="mx-auto max-w-5xl px-5 sm:px-6 py-16 sm:py-20 text-center">
        <p className="text-sm text-muted-foreground">Could not load this project.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-full glass px-5 py-2 text-xs hover:bg-white/10 transition"
        >
          Retry
        </button>
      </article>
    );
  }

  const idx = allProjects.findIndex((p) => p.slug === project.slug);
  const list = allProjects.length ? allProjects : [project];
  const safeIdx = idx >= 0 ? idx : 0;
  const next = list[(safeIdx + 1) % list.length];
  const prev = list[(safeIdx - 1 + list.length) % list.length];
=======
  const { project } = Route.useLoaderData();
  const idx = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(idx + 1) % projects.length];
  const prev = projects[(idx - 1 + projects.length) % projects.length];
>>>>>>> a25318459c6d5f0d463fa1ed2c0fa7553a6d1ef2

  return (
    <article className="mx-auto max-w-5xl px-5 sm:px-6 py-16 sm:py-20">
      <Link to="/portfolio" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} /> Back to Portfolio
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-8"
      >
        <span className="text-xs uppercase tracking-widest text-cyan">{project.category}</span>
        <h1 className="mt-4 text-4xl sm:text-5xl md:text-7xl font-semibold leading-[1.05]">
          {project.title}
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl">{project.tagline}</p>
      </motion.div>

      <motion.div
        layoutId={`project-cover-${project.slug}`}
<<<<<<< HEAD
        className="mt-12 aspect-[16/9] rounded-3xl shadow-glow-violet relative overflow-hidden"
      >
        {project.coverImage && (
          <img
            src={project.coverImage}
            alt={`${project.title} cover`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}${project.coverImage ? " opacity-75" : ""}`} />
=======
        className={`mt-12 aspect-[16/9] rounded-3xl bg-gradient-to-br ${project.gradient} shadow-glow-violet relative overflow-hidden`}
      >
>>>>>>> a25318459c6d5f0d463fa1ed2c0fa7553a6d1ef2
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_60%)]" />
      </motion.div>

      <div className="mt-12 sm:mt-16 grid md:grid-cols-3 gap-8 md:gap-10">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold">Overview</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{project.description}</p>

          <h2 className="mt-12 text-2xl font-semibold">Outcome</h2>
          <p className="mt-4 text-lg text-gradient font-semibold">{project.outcome}</p>
        </div>

        <aside className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-cyan">Tech stack</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((t: string) => (
                <span key={t} className="rounded-full glass px-3 py-1 text-xs">{t}</span>
              ))}
            </div>
          </div>
          <Link
            to="/contact"
            className="glass block rounded-2xl p-6 hover:bg-white/[0.06] transition"
          >
            <h3 className="text-sm font-semibold">Have a similar project?</h3>
            <p className="mt-2 text-xs text-muted-foreground">Let's talk about what you're building.</p>
            <span className="mt-4 inline-flex items-center gap-2 text-xs text-primary">
              Get in touch <ArrowRight size={12} />
            </span>
          </Link>
        </aside>
      </div>

      <nav className="mt-24 grid gap-4 sm:grid-cols-2 border-t border-border/50 pt-8">
        <Link
          to="/portfolio/$slug"
          params={{ slug: prev.slug }}
          className="flex items-center justify-between glass rounded-2xl p-5 sm:p-6 hover:bg-white/[0.06] transition group"
        >
          <ArrowLeft className="text-primary group-hover:-translate-x-1 transition shrink-0" />
          <div className="text-right min-w-0 ml-3">
            <div className="text-xs text-muted-foreground">Previous</div>
            <div className="mt-1 text-lg font-semibold truncate">{prev.title}</div>
          </div>
        </Link>
        <Link
          to="/portfolio/$slug"
          params={{ slug: next.slug }}
          className="flex items-center justify-between glass rounded-2xl p-5 sm:p-6 hover:bg-white/[0.06] transition group"
        >
          <div className="min-w-0 mr-3">
            <div className="text-xs text-muted-foreground">Next</div>
            <div className="mt-1 text-lg font-semibold truncate">{next.title}</div>
          </div>
          <ArrowRight className="text-primary group-hover:translate-x-1 transition shrink-0" />
        </Link>
      </nav>
    </article>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> a25318459c6d5f0d463fa1ed2c0fa7553a6d1ef2
