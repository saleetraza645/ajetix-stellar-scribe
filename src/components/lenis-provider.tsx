import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "@tanstack/react-router";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect reduced motion — fall back to native scroll
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      // Native browser scroll restoration handles back/forward correctly here.
      return;
    }

    // Take manual control of scroll restoration so Lenis doesn't fight the
    // browser on back/forward and we can restore per-history-entry.
    const prevRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Save current scroll position keyed by history entry before leaving.
    const scrollStore = new Map<string, number>();
    const currentKey = () => `${history.state?.key ?? "root"}:${location.pathname}`;

    const saveScroll = () => scrollStore.set(currentKey(), window.scrollY);
    window.addEventListener("beforeunload", saveScroll);

    // On any route resolution, if the navigation was a popstate (back/forward),
    // restore the saved scroll position; otherwise jump to top instantly.
    const unsub = router.subscribe("onResolved", () => {
      const isPop = router.history.location.state?.__TSR_isPop__ === true;
      // Fallback detection: use performance nav type on first mount
      const requestAnimationFrame_ = window.requestAnimationFrame;
      requestAnimationFrame_(() => {
        const key = currentKey();
        const saved = scrollStore.get(key);
        if (isPop && typeof saved === "number") {
          lenis.scrollTo(saved, { immediate: true, force: true });
        } else {
          lenis.scrollTo(0, { immediate: true, force: true });
        }
      });
    });

    const onBeforeNav = () => saveScroll();
    const unsubBefore = router.subscribe("onBeforeNavigate", onBeforeNav);

    return () => {
      window.removeEventListener("beforeunload", saveScroll);
      unsub();
      unsubBefore();
      history.scrollRestoration = prevRestoration;
      lenis.destroy();
    };
  }, [router]);

  return <>{children}</>;
}