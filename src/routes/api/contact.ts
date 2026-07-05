import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const submissionSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  budget: z.string().min(1).max(40),
  customBudget: z.string().trim().max(80).optional(),
  projectDetails: z.string().trim().min(20).max(5000),
  fileUrls: z.array(z.object({ name: z.string(), path: z.string(), size: z.number() })).max(5).optional().default([]),
  website: z.string().max(0).optional(), // honeypot
});

// Simple in-memory rate limiter (per-Worker-instance).
// For heavy traffic swap for a KV/Redis solution.
const RATE_LIMIT = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 4;

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = RATE_LIMIT.get(ip);
  if (!entry || entry.reset < now) {
    RATE_LIMIT.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip =
          request.headers.get("cf-connecting-ip") ||
          request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
          "unknown";

        if (rateLimited(ip)) {
          return new Response("Rate limit exceeded", { status: 429 });
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const parsed = submissionSchema.safeParse(body);
        if (!parsed.success) {
          return new Response(JSON.stringify({ error: "Validation failed", issues: parsed.error.issues }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Honeypot triggered -> pretend success but drop it
        if (parsed.data.website && parsed.data.website.length > 0) {
          return Response.json({ ok: true });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { error: insertErr } = await supabaseAdmin
          .from("contact_submissions")
          .insert({
            name: parsed.data.name,
            email: parsed.data.email,
            budget: parsed.data.budget,
            custom_budget: parsed.data.customBudget ?? null,
            project_details: parsed.data.projectDetails,
            file_urls: parsed.data.fileUrls,
            ip_address: ip,
            user_agent: request.headers.get("user-agent") ?? null,
          });

        if (insertErr) {
          console.error("contact insert failed", insertErr);
          return new Response("Could not save submission", { status: 500 });
        }

        // Email send: the built-in Lovable Emails flow can be wired here once an
        // email domain is configured. For now, submissions are safely stored in
        // the database and can be retrieved from the Cloud dashboard.

        return Response.json({ ok: true });
      },
    },
  },
});