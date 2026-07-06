import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Hero3D } from "@/components/hero-3d";
import { ProjectCover } from "@/components/project-cover";
import { TechStackPills } from "@/components/tech-stack-pills";
import { services, techStack } from "@/lib/services-data";
import { projects } from "@/lib/portfolio-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:url", content: "/" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative -mt-24 min-h-[100svh] overflow-hidden">
        <Hero3D />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-background)_75%)]" />
        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-5 pt-28 pb-24 sm:px-6 sm:pt-32 text-center">
          {/* The tagline pill was removed as per request */}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-4 max-w-5xl text-[2.5rem] leading-[1.02] sm:text-6xl sm:leading-[0.98] md:text-7xl lg:text-8xl font-semibold md:leading-[0.95]"
          >
            Ambitious ideas,
            <br />
            <span className="text-gradient">engineered globally.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg text-muted-foreground px-2 sm:px-0"
          >
            Ajetix is a distributed AI, software, and product studio. We partner with teams in
            the US, UK, EU, Canada, Australia and the Middle East to design and ship products
            people love.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 sm:mt-10 flex w-full sm:w-auto flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-3 px-2 sm:px-0"
          >
            <Link
              to="/contact"
              className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-medium text-white shadow-glow hover:opacity-90 transition"
            >
              Start a project
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium hover:bg-white/10 transition"
            >
              See our work
            </Link>
          </motion.div>

          <div className="pointer-events-none absolute inset-x-0 bottom-6 hidden sm:flex justify-center">
            <div className="h-10 w-6 rounded-full border border-white/20 p-1">
              <div className="mx-auto h-2 w-1 animate-float rounded-full bg-white/60" />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="relative mx-auto max-w-7xl px-5 sm:px-6 py-20 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 sm:mb-16 max-w-3xl"
        >
          <span className="text-xs uppercase tracking-widest text-cyan">What we do</span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            End-to-end capability across <span className="text-gradient">AI, product, and cloud</span>.
          </h2>
        </motion.div>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass rounded-2xl p-6 hover:bg-white/[0.06] transition group"
            >
              <div className="mb-4 inline-flex rounded-xl bg-gradient-brand p-3 shadow-glow">
                <s.icon size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.summary}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-10">
          <Link to="/services" className="text-sm text-primary hover:underline inline-flex items-center gap-2">
            All services <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="relative mx-auto max-w-7xl px-5 sm:px-6 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="glass-strong rounded-3xl p-6 sm:p-10 md:p-16"
        >
          <div className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-10">
            <div>
              <span className="text-xs uppercase tracking-widest text-cyan">Tech we use</span>
              <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight">
                Battle-tested tools, thoughtfully chosen.
              </h2>
              <p className="mt-4 text-muted-foreground text-sm">
                We pick the right tool for the job — not the trendy one. Here's a snapshot of the
                stack we deploy every day.
              </p>
            </div>
            <TechStackPills items={techStack} />
          </div>
        </motion.div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="relative mx-auto max-w-7xl px-5 sm:px-6 py-20 sm:py-32">
        <div className="mb-10 sm:mb-16 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-cyan">Selected work</span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
              Products we're proud of.
            </h2>
          </div>
          <Link to="/portfolio" className="text-sm text-primary hover:underline inline-flex items-center gap-2">
            All 20 projects <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 6).map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link
                to="/portfolio/$slug"
                params={{ slug: p.slug }}
                className="group block overflow-hidden rounded-2xl glass hover:shadow-glow transition"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <ProjectCover project={p} className="absolute inset-0" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="relative flex h-full flex-col justify-between text-white p-8">
                    <span className="text-xs uppercase tracking-widest opacity-80">{p.category}</span>
                    <h3 className="text-2xl font-semibold leading-tight">{p.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground">{p.tagline}</p>
                  <p className="mt-3 text-xs text-cyan">{p.outcome}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-7xl px-5 sm:px-6 py-20 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-brand p-8 sm:p-12 md:p-20 text-center shadow-glow-violet"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.25),transparent_50%)]" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold text-white leading-tight">
              Have an idea? Let's build it.
            </h2>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base text-white/85 max-w-2xl mx-auto">
              Tell us about your project. We reply within one business day, anywhere in the world.
            </p>
            <Link
              to="/contact"
              className="mt-8 sm:mt-10 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-white text-primary px-8 py-3 text-sm font-semibold hover:opacity-90 transition"
            >
              Get in touch
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
