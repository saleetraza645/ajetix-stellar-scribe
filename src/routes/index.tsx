import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Hero3D } from "@/components/hero-3d";
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
        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-6 pt-32 text-center">
          {/* The tagline pill was removed as per request */}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-8 max-w-5xl text-5xl sm:text-7xl md:text-8xl font-semibold leading-[0.95]"
          >
            Ambitious ideas,
            <br />
            <span className="text-gradient">engineered globally.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 max-w-2xl text-lg text-muted-foreground"
          >
            Ajetix is a distributed AI, software, and product studio. We partner with teams in
            the US, UK, EU, Canada, Australia and the Middle East to design and ship products
            people love.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-medium text-white shadow-glow hover:opacity-90 transition"
            >
              Start a project
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium hover:bg-white/10 transition"
            >
              See our work
            </Link>
          </motion.div>

          <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
            <div className="h-10 w-6 rounded-full border border-white/20 p-1">
              <div className="mx-auto h-2 w-1 animate-float rounded-full bg-white/60" />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="relative mx-auto max-w-7xl px-6 py-32">
        <div className="mb-16 max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-cyan">What we do</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-semibold">
            End-to-end capability across <span className="text-gradient">AI, product, and cloud</span>.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="glass-strong rounded-3xl p-10 md:p-16">
          <div className="grid md:grid-cols-[1fr_2fr] gap-10">
            <div>
              <span className="text-xs uppercase tracking-widest text-cyan">Tech we use</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold">
                Battle-tested tools, thoughtfully chosen.
              </h2>
              <p className="mt-4 text-muted-foreground text-sm">
                We pick the right tool for the job — not the trendy one. Here's a snapshot of the
                stack we deploy every day.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {techStack.map((t) => (
                <span
                  key={t}
                  className="rounded-full glass px-4 py-2 text-xs text-foreground/80"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="relative mx-auto max-w-7xl px-6 py-32">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-cyan">Selected work</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold">
              Products we're proud of.
            </h2>
          </div>
          <Link to="/portfolio" className="text-sm text-primary hover:underline inline-flex items-center gap-2">
            All 20 projects <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <div className={`aspect-[4/3] bg-gradient-to-br ${p.gradient} p-8 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_60%)]" />
                  <div className="relative flex h-full flex-col justify-between text-white">
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
      <section className="relative mx-auto max-w-7xl px-6 py-32">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-12 md:p-20 text-center shadow-glow-violet">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.25),transparent_50%)]" />
          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-semibold text-white">
              Have an idea? Let's build it.
            </h2>
            <p className="mt-6 text-white/85 max-w-2xl mx-auto">
              Tell us about your project. We reply within one business day, anywhere in the world.
            </p>
            <Link
              to="/contact"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-white text-primary px-8 py-3 text-sm font-semibold hover:opacity-90 transition"
            >
              Get in touch
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
