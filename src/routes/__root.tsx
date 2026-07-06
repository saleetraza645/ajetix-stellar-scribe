import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import { LenisProvider } from "../components/lenis-provider";
import { SiteNav } from "../components/site-nav";
import { SiteFooter } from "../components/site-footer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const siteUrl = (import.meta.env.VITE_SITE_URL || "https://ajetix.com").replace(/\/$/, "");
    const description =
      "Ajetix is an international AI, software, and product studio building ambitious digital products for teams in the US, UK, EU, Canada, Australia, and the Middle East.";
    const googleVerify = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION;

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "Ajetix — AI, Software & Product Studio" },
        { name: "description", content: description },
        { name: "author", content: "Ajetix" },
        { name: "theme-color", content: "#0B1120" },
        ...(googleVerify ? [{ name: "google-site-verification", content: googleVerify }] : []),
        { property: "og:site_name", content: "Ajetix" },
        { property: "og:title", content: "Ajetix — AI, Software & Product Studio" },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: siteUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@Ajetix_1126" },
        { name: "twitter:title", content: "Ajetix — AI, Software & Product Studio" },
        { name: "twitter:description", content: description },
        { property: "og:image", content: `${siteUrl}/favicon.png` },
        { name: "twitter:image", content: `${siteUrl}/favicon.png` },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", type: "image/png", href: "/favicon.png" },
        { rel: "apple-touch-icon", href: "/favicon.png" },
        { rel: "canonical", href: siteUrl },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Ajetix",
            url: siteUrl,
            logo: `${siteUrl}/favicon.png`,
            email: "info@ajetix.com",
            description,
            sameAs: [
              "https://www.instagram.com/ajetix_as/",
              "https://www.facebook.com/share/1DAJEzWjpH/",
              "https://youtube.com/@ajetix",
              "https://x.com/Ajetix_1126",
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Ajetix",
            url: siteUrl,
            description,
            potentialAction: {
              "@type": "SearchAction",
              target: `${siteUrl}/portfolio?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LenisProvider>
        <div className="relative min-h-screen">
          <SiteNav />
          <main className="pt-24">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
      </LenisProvider>
    </QueryClientProvider>
  );
}
