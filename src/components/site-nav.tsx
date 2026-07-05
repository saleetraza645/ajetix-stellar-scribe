import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/ajetix-logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/process", label: "Process" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={`glass-strong flex items-center justify-between rounded-2xl px-4 py-3 transition-all ${
            scrolled ? "shadow-elevated" : ""
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group" aria-label="Ajetix home">
            <img
              src={logo}
              alt="Ajetix"
              width={36}
              height={36}
              className="h-9 w-9 transition-transform group-hover:scale-110"
            />
            <span className="text-lg font-semibold tracking-tight">Ajetix</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="relative rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
                activeProps={{
                  className: "text-foreground",
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/contact"
            className="hidden md:inline-flex items-center rounded-full bg-gradient-brand px-5 py-2 text-sm font-medium text-white shadow-glow hover:opacity-90 transition"
          >
            Start a project
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden rounded-lg p-2 text-foreground"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-2 glass-strong rounded-2xl p-4 space-y-1 animate-fade-up">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                activeProps={{ className: "text-foreground bg-white/5" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="block rounded-lg bg-gradient-brand px-3 py-2 text-center text-sm font-medium text-white mt-2"
            >
              Start a project
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}