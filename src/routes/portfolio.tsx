import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/portfolio-data";

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

function Portfolio() {
  const matches = useMatches();
  // If a child (detail) route is active, render only the outlet
  const isDetail = matches.some((m) => m.routeId === "/portfolio/$slug");
  if (isDetail) return <Outlet />;

  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-xs uppercase tracking-widest text-cyan">Portfolio</span>
          <h1 className="mt-4 text-5xl md:text-7xl font-semibold leading-[1.05] max-w-4xl">
            Twenty products, <span className="text-gradient">one team</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            A selection of the work we've shipped over the past few years. Each one has a story —
            click through for the details.
          </p>
        </motion.div>
      </div>

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
              <div className={`aspect-[4/3] bg-gradient-to-br ${p.gradient} p-8 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_60%)]" />
                <div className="relative flex h-full flex-col justify-between text-white">
                  <span className="text-xs uppercase tracking-widest opacity-80">{p.category}</span>
                  <h3 className="text-3xl font-semibold leading-tight">{p.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-muted-foreground">{p.tagline}</p>
                <p className="mt-3 text-xs text-cyan">{p.outcome}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Mobile grid */}
      <section className="md:hidden mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((p) => (
            <Link
              to="/portfolio/$slug"
              params={{ slug: p.slug }}
              key={p.slug}
              className="group overflow-hidden rounded-2xl glass"
            >
              <div className={`aspect-[4/3] bg-gradient-to-br ${p.gradient} p-6 relative`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_60%)]" />
                <div className="relative flex h-full flex-col justify-between text-white">
                  <span className="text-xs uppercase tracking-widest opacity-80">{p.category}</span>
                  <h3 className="text-xl font-semibold">{p.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">{p.tagline}</p>
                <p className="mt-2 text-xs text-cyan">{p.outcome}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}