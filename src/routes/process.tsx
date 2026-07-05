import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "Our Process — How Ajetix Builds | Ajetix" },
      {
        name: "description",
        content:
          "Discovery, design, engineering, launch and scale — a transparent process for delivering software that ships and performs.",
      },
      { property: "og:title", content: "Our Process — Ajetix" },
      { property: "og:description", content: "Five phases from idea to scaled product." },
      { property: "og:url", content: "/process" },
    ],
    links: [{ rel: "canonical", href: "/process" }],
  }),
  component: Process,
});

const steps = [
  { n: "01", title: "Discovery", body: "We map the problem, the users, the constraints, and the metric that matters. You walk away with a concrete plan even if you never hire us." },
  { n: "02", title: "Design", body: "UX flows, interface design, and design-system foundations. Prototyped, tested, and validated before a line of production code is written." },
  { n: "03", title: "Engineering", body: "Senior engineers ship in tight increments. Reviewed, tested, observable, and always deployable." },
  { n: "04", title: "Launch", body: "Go-live playbooks, App Store submissions, DNS, analytics, and stakeholder training. We de-risk the moment it goes public." },
  { n: "05", title: "Scale", body: "Post-launch tuning, growth experiments, cost optimization, and platform hardening. We stay long enough to make it durable." },
];

function Process() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <span className="text-xs uppercase tracking-widest text-cyan">Process</span>
        <h1 className="mt-4 text-5xl md:text-7xl font-semibold leading-[1.05] max-w-4xl">
          A repeatable path from <span className="text-gradient">idea to scale</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Every engagement follows the same five phases. Timelines flex; discipline doesn't.
        </p>
      </motion.div>

      <div className="relative mt-24 space-y-4">
        <div className="absolute left-[26px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-violet to-cyan opacity-30" />
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className={`relative grid md:grid-cols-2 gap-8 items-center ${i % 2 ? "md:flex-row-reverse" : ""}`}
          >
            <div className={`glass rounded-2xl p-8 ${i % 2 ? "md:col-start-2" : ""}`}>
              <div className="text-6xl font-semibold text-gradient">{s.n}</div>
              <h2 className="mt-4 text-2xl font-semibold">{s.title}</h2>
              <p className="mt-3 text-muted-foreground">{s.body}</p>
            </div>
            <div className="hidden md:block" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}