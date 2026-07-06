import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getProject, projects } from "@/lib/portfolio-data";

export const Route = createFileRoute("/portfolio/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
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
  const { project } = Route.useLoaderData();
  const idx = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(idx + 1) % projects.length];
  const prev = projects[(idx - 1 + projects.length) % projects.length];

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
        className={`mt-12 aspect-[16/9] rounded-3xl bg-gradient-to-br ${project.gradient} shadow-glow-violet relative overflow-hidden`}
      >
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
}