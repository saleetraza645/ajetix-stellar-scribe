import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Twitter, Mail } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/ajetix-logo.png";

const socials = [
  { href: "https://www.instagram.com/ajetix_as/", label: "Instagram", Icon: Instagram },
  { href: "https://www.facebook.com/share/1DAJEzWjpH/", label: "Facebook", Icon: Facebook },
  { href: "https://youtube.com/@ajetix", label: "YouTube", Icon: Youtube },
  { href: "https://x.com/Ajetix_1126", label: "X (Twitter)", Icon: Twitter },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    if (error && !error.message.includes("duplicate")) {
      setStatus("err");
    } else {
      setStatus("ok");
      setEmail("");
    }
    setTimeout(() => setStatus("idle"), 4000);
  }

  return (
    <footer className="relative mt-32 border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Ajetix" width={40} height={40} className="h-10 w-10" />
              <span className="text-xl font-semibold">Ajetix</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              International AI, software, and product studio. We build ambitious digital
              experiences for teams in the US, UK, EU, Canada, Australia and the Middle East.
            </p>
            <a
              href="mailto:info@ajetix.com"
              className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition"
            >
              <Mail size={16} /> info@ajetix.com
            </a>
            <div className="flex gap-2 pt-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="glass rounded-full p-2.5 hover:bg-white/10 transition"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                ["/", "Home"],
                ["/about", "About"],
                ["/services", "Services"],
                ["/process", "Process"],
                ["/portfolio", "Portfolio"],
                ["/contact", "Contact"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-foreground transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Occasional updates on AI, engineering and product craft.
            </p>
            <form onSubmit={subscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="min-w-0 flex-1 rounded-lg glass px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-lg bg-gradient-brand px-3 py-2 text-sm font-medium text-white shadow-glow disabled:opacity-50"
              >
                {status === "loading" ? "..." : "Join"}
              </button>
            </form>
            {status === "ok" && (
              <p className="mt-2 text-xs text-cyan">Thanks — you're on the list.</p>
            )}
            {status === "err" && (
              <p className="mt-2 text-xs text-destructive">Something went wrong. Try again.</p>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Ajetix. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-foreground">Privacy Policy</Link>
            <Link to="/" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}