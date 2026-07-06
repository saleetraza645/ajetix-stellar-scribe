import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { API_ENABLED } from "@/lib/api-client";
import { usePortfolioProjects } from "@/lib/portfolio-queries";
import type { Project } from "@/lib/portfolio-data";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Selected Work | Ajetix" },
      {
        name: "description",
        content:
          "20 selected projects from Ajetix across AI, SaaS, mobile, cloud, and design — with outcomes and tech stacks.",
      },
      { property: "og:title", content: "Portfolio — Ajetix" },
      { property: "og:description", content: "Twenty selected projects across AI and product." },
      { property: "og:url", content: "/portfolio" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  component: Portfolio,
});

function CoverImage({ project }: { project: Project }) {
  return (
    <>
      {project.coverImage && (
        <img
          src={project.coverImage}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}${project.coverImage ? " opacity-75" : ""}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_60%)]" />
    </>
  );
}

function Portfolio() {
  const matches = useMatches();
  const isDetail = matches.some((m) => m.routeId === "/portfolio/$slug");
  const { data: projects = [], isLoading, isError, refetch } = usePortfolioProjects();
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDetail) return;
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) return;
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const total = track.scrollWidth - window.innerWidth + 48;
      gsap.to(track, {
        x: -total,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${total}`,
          scrub: 0.8,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [isDetail, projects]);

  if (isDetail) return <Outlet />;

  return (
    <LayoutGroup>
      <div className="mx-auto max-w-7xl px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-xs uppercase tracking-widest text-cyan">Portfolio</span>
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-7xl font-semibold leading-[1.05] max-w-4xl">
            Twenty products, <span className="text-gradient">one team</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground">
            A selection of the work we've shipped over the past few years. Each one has a story —
            click through for the details.
          </p>
        </motion.div>
      </div>

      {API_ENABLED && isError && (
        <div className="mx-auto max-w-7xl px-6 pb-12 text-center">
          <p className="text-sm text-muted-foreground">Could not load projects from the API.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-full glass px-5 py-2 text-xs hover:bg-white/10 transition"
          >
            Retry
          </button>
        </div>
      )}

      {API_ENABLED && isLoading ? (
        <>
          <section className="hidden md:block px-6 py-6">
            <div className="flex gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[420px] w-[420px] flex-none rounded-2xl" />
              ))}
            </div>
          </section>
          <section className="md:hidden mx-auto max-w-7xl px-5 pb-24">
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Horizontal scroll rail (desktop) */}
          <section ref={sectionRef} className="hidden md:block relative overflow-hidden">
            <div ref={trackRef} className="flex gap-6 pl-6 will-change-transform py-6">
              {projects.map((p) => (
                <Link
                  to="/portfolio/$slug"
                  params={{ slug: p.slug }}
                  key={p.slug}
                  className="group flex-none w-[420px] overflow-hidden rounded-2xl glass hover:shadow-glow transition"
                >
                  <motion.div
                    layoutId={`project-cover-${p.slug}`}
                    className="aspect-[4/3] p-8 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500"
                  >
                    <CoverImage project={p} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    <div className="relative flex h-full flex-col justify-between text-white">
                      <span className="text-xs uppercase tracking-widest opacity-80">{p.category}</span>
                      <h3 className="text-3xl font-semibold leading-tight">{p.title}</h3>
                    </div>
                  </motion.div>
                  <div className="p-6">
                    <p className="text-sm text-muted-foreground">{p.tagline}</p>
                    <p className="mt-3 text-xs text-cyan">{p.outcome}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Mobile grid */}
          <section className="md:hidden mx-auto max-w-7xl px-5 pb-24">
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((p) => (
                <Link
                  to="/portfolio/$slug"
                  params={{ slug: p.slug }}
                  key={p.slug}
                  className="group overflow-hidden rounded-2xl glass"
                >
                  <motion.div
                    layoutId={`project-cover-${p.slug}`}
                    className="aspect-[4/3] p-6 relative overflow-hidden"
                  >
                    <CoverImage project={p} />
                    <div className="relative flex h-full flex-col justify-between text-white">
                      <span className="text-xs uppercase tracking-widest opacity-80">{p.category}</span>
                      <h3 className="text-xl font-semibold">{p.title}</h3>
                    </div>
                  </motion.div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">{p.tagline}</p>
                    <p className="mt-2 text-xs text-cyan">{p.outcome}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </LayoutGroup>
  );
}
