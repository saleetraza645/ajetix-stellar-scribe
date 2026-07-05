import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { services, techStack } from "@/lib/services-data";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — AI, Software, SaaS, Mobile, Cloud | Ajetix" },
      {
        name: "description",
        content:
          "Ajetix services: AI & ML, web development, SaaS, custom software, mobile apps, UI/UX, cloud, automation, and digital agency work.",
      },
      { property: "og:title", content: "Services — Ajetix" },
      { property: "og:description", content: "Nine capability areas across AI, product, and cloud." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          provider: { "@type": "Organization", name: "Ajetix" },
          areaServed: ["US", "UK", "CA", "EU", "AU", "AE"],
          name: "AI, Software, SaaS, Mobile, Cloud, UI/UX, Automation and Digital Agency Services",
        }),
      },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <span className="text-xs uppercase tracking-widest text-cyan">Services</span>
        <h1 className="mt-4 text-5xl md:text-7xl font-semibold leading-[1.05] max-w-4xl">
          Everything you need to <span className="text-gradient">design, build and scale</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Nine capability areas, one senior team. Engage us for a single sprint or a
          multi-year build — we scale to fit.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
            className="glass rounded-2xl p-6 hover:bg-white/[0.06] transition"
          >
            <div className="mb-4 inline-flex rounded-xl bg-gradient-brand p-3 shadow-glow">
              <s.icon size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.summary}</p>
            <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground/80">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-cyan" /> {b}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 glass-strong rounded-3xl p-10 md:p-16">
        <span className="text-xs uppercase tracking-widest text-cyan">Tech we use</span>
        <h2 className="mt-3 text-3xl md:text-4xl font-semibold">A modern, pragmatic stack.</h2>
        <div className="mt-8 flex flex-wrap gap-2">
          {techStack.map((t) => (
            <span key={t} className="rounded-full glass px-4 py-2 text-sm">{t}</span>
          ))}
        </div>
      </div>

      <div className="mt-20 text-center">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-8 py-3 text-sm font-semibold text-white shadow-glow"
        >
          Discuss a project <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}