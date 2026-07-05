import {
  Brain,
  Globe,
  Layers,
  Code2,
  Smartphone,
  Palette,
  Cloud,
  Zap,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  icon: LucideIcon;
  title: string;
  summary: string;
  bullets: string[];
};

export const services: Service[] = [
  {
    icon: Brain,
    title: "AI & Machine Learning",
    summary:
      "Applied AI systems that move real business metrics — from LLM assistants to predictive models and computer vision.",
    bullets: ["LLM assistants & RAG", "Predictive & forecasting models", "Computer vision", "AI product strategy"],
  },
  {
    icon: Globe,
    title: "Web Development",
    summary: "Custom marketing sites and web applications engineered for speed, SEO, and conversion.",
    bullets: ["Marketing websites", "Web apps & dashboards", "Headless CMS", "SEO-ready SSR"],
  },
  {
    icon: Layers,
    title: "SaaS Product Development",
    summary: "Full-lifecycle SaaS: architecture, multi-tenancy, billing, admin, and growth-ready analytics.",
    bullets: ["Multi-tenant architecture", "Billing & entitlements", "Admin tooling", "Analytics"],
  },
  {
    icon: Code2,
    title: "Custom Software",
    summary: "Enterprise software replacing legacy tools and unifying workflows across teams.",
    bullets: ["Internal platforms", "ERP & operations tools", "Integrations", "Migrations"],
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    summary: "Native and cross-platform iOS/Android apps with premium interaction design.",
    bullets: ["React Native / Flutter", "Native iOS & Android", "Offline-first sync", "App Store launch"],
  },
  {
    icon: Palette,
    title: "UI / UX Design",
    summary: "Design systems, product design, and brand-consistent experiences that convert.",
    bullets: ["Product design", "Design systems", "Research & testing", "Motion & prototyping"],
  },
  {
    icon: Cloud,
    title: "Cloud & Infrastructure",
    summary: "Reliable, cost-efficient cloud architecture on AWS, Azure, and GCP.",
    bullets: ["Kubernetes & DevOps", "Multi-cloud", "Cost optimization", "Reliability & SRE"],
  },
  {
    icon: Zap,
    title: "Automation",
    summary: "Workflow, RPA, and AI-driven automation across finance, ops, and support.",
    bullets: ["Workflow automation", "RPA + AI", "Data pipelines", "Custom integrations"],
  },
  {
    icon: Sparkles,
    title: "Digital Agency",
    summary: "Brand identity, digital marketing support, and strategy consulting for scale-ups.",
    bullets: ["Brand & identity", "Digital campaigns", "Content & SEO", "Strategy consulting"],
  },
];

export const techStack = [
  "React", "Node.js", "TypeScript", "Python", "TensorFlow", "PyTorch",
  "Docker", "Kubernetes", "AWS", "Azure", "GCP", "PostgreSQL",
  "MongoDB", "Redis", "Kafka", "Figma", "Next.js", "GraphQL",
];