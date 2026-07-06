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

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // Take manual control so Lenis and the browser don't fight on back/forward.
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

    // Save scroll per history entry; restore on popstate, top on new nav.
    const scrollStore = new Map<string, number>();
    const currentKey = () => location.pathname + location.search;
    let poppedNext = false;

    const saveCurrent = () => scrollStore.set(currentKey(), window.scrollY);
    const onPop = () => { poppedNext = true; };
    window.addEventListener("popstate", onPop);
    window.addEventListener("beforeunload", saveCurrent);

    let lastKey = currentKey();
    const unsub = router.subscribe("onResolved", () => {
      const newKey = currentKey();
      // save scroll for the page we're leaving
      if (newKey !== lastKey) scrollStore.set(lastKey, window.scrollY);
      requestAnimationFrame(() => {
        if (poppedNext) {
          const saved = scrollStore.get(newKey);
          lenis.scrollTo(typeof saved === "number" ? saved : 0, { immediate: true, force: true });
          poppedNext = false;
        } else {
          lenis.scrollTo(0, { immediate: true, force: true });
        }
        lastKey = newKey;
      });
    });

    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("beforeunload", saveCurrent);
      unsub();
      history.scrollRestoration = prevRestoration;
      lenis.destroy();
    };
  }, [router]);

  return <>{children}</>;
}