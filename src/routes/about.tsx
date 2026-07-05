import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Globe2, Users, Rocket, Award } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Ajetix — Global AI & Software Studio" },
      {
        name: "description",
        content:
          "Ajetix is a distributed team of engineers, designers, and AI specialists building ambitious products for clients across six regions.",
      },
      { property: "og:title", content: "About Ajetix" },
      { property: "og:description", content: "How Ajetix works and who we are." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const stats = [
  { icon: Globe2, value: "6", label: "Regions served" },
  { icon: Users, value: "40+", label: "Engineers & designers" },
  { icon: Rocket, value: "120+", label: "Products shipped" },
  { icon: Award, value: "4.9★", label: "Client rating" },
];

function About() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-xs uppercase tracking-widest text-cyan">About Ajetix</span>
        <h1 className="mt-4 text-5xl md:text-7xl font-semibold leading-[1.05] max-w-4xl">
          A studio built for the <span className="text-gradient">next decade</span> of software.
        </h1>
        <p className="mt-8 text-lg text-muted-foreground max-w-3xl">
          Ajetix was founded on a simple belief: the best products come from small, senior teams
          that operate globally, choose the right tools, and stay close to the problem. We work
          with founders, scale-ups, and enterprises across the US, UK, Canada, EU, Australia,
          and the Middle East to design, build, and grow software that matters.
        </p>
      </motion.div>

      <div className="mt-20 grid gap-4 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="glass rounded-2xl p-6"
          >
            <s.icon size={22} className="text-cyan" />
            <div className="mt-4 text-4xl font-semibold">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-semibold">Our approach</h2>
          <p className="mt-4 text-muted-foreground">
            We favour senior teams over pyramids, clarity over process, and shipping over
            slideware. Every engagement starts with a sharp discovery, then a small team of
            senior specialists takes ownership end to end — from architecture to launch.
          </p>
        </div>
        <div>
          <h2 className="text-3xl font-semibold">What we believe</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            <li>• The best AI is invisible — it solves the problem, not the pitch.</li>
            <li>• Design and engineering are the same craft, viewed from two angles.</li>
            <li>• Speed compounds. So does polish. We do both.</li>
            <li>• Distributed by default, connected by outcomes.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}