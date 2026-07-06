import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { z } from "zod";
import { Upload, X, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import imageCompression from "browser-image-compression";
import { supabase } from "@/integrations/supabase/client";
import { api, API_ENABLED, ApiError } from "@/lib/api-client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Ajetix — Start a Project" },
      {
        name: "description",
        content:
          "Tell us about your project. We reply within one business day, anywhere in the world. Email info@ajetix.com or use the form.",
      },
      { property: "og:title", content: "Contact Ajetix" },
      { property: "og:description", content: "Start a project with Ajetix." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const budgets = ["$1k – $5k", "$5k – $10k", "$10k – $25k", "$25k – $50k", "$50k+", "Custom"] as const;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "text/plain": [".txt"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "application/zip": [".zip"],
};

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  budget: z.enum(budgets),
  customBudget: z.string().trim().max(80).optional(),
  projectDetails: z.string().trim().min(20, "Please add a few sentences (20+ chars)").max(5000),
  // Honeypot must be empty
  website: z.string().max(0, "Bot detected").optional(),
});

function Contact() {
  const [files, setFiles] = useState<File[]>([]);
  const [budget, setBudget] = useState<(typeof budgets)[number]>("$5k – $10k");
  const [customBudget, setCustomBudget] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onDrop = useCallback((accepted: File[]) => {
    const valid = accepted.filter((f) => f.size <= MAX_FILE_SIZE);
    setFiles((prev) => [...prev, ...valid].slice(0, 5));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxSize: MAX_FILE_SIZE,
    maxFiles: 5,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    const parsed = schema.safeParse({
      name, email, budget,
      customBudget: budget === "Custom" ? customBudget : undefined,
      projectDetails, website,
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        fieldErrors[i.path.join(".")] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus("submitting");

    const budgetValue = budget === "Custom" ? (customBudget.trim() || "Custom") : budget;

    try {
      if (API_ENABLED) {
        await api.submitContact({
          name: parsed.data.name,
          email: parsed.data.email,
          budget: budgetValue,
          projectDetails: parsed.data.projectDetails,
          website: parsed.data.website,
          files,
        });
      } else {
        // Lovable / Supabase fallback (works on deployed site without Express API)
        const fileUrls: { name: string; path: string; size: number }[] = [];
        const submissionId = crypto.randomUUID();

        for (const file of files) {
          let toUpload: File = file;
          if (file.type.startsWith("image/")) {
            try {
              toUpload = await imageCompression(file, {
                maxSizeMB: 1.5,
                maxWidthOrHeight: 2400,
                useWebWorker: true,
              });
            } catch { /* fallback to original */ }
          }
          const path = `submissions/${submissionId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
          const { error: upErr } = await supabase.storage
            .from("contact-attachments")
            .upload(path, toUpload, { contentType: file.type, upsert: false });
          if (upErr) throw upErr;
          fileUrls.push({ name: file.name, path, size: toUpload.size });
        }

        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: parsed.data.name,
            email: parsed.data.email,
            budget: budgetValue,
            projectDetails: parsed.data.projectDetails,
            fileUrls,
            website: parsed.data.website,
          }),
        });

        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || "Submission failed");
        }
      }

      setStatus("success");
      setName(""); setEmail(""); setProjectDetails(""); setFiles([]); setCustomBudget("");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <div className="inline-flex rounded-full bg-gradient-brand p-4 shadow-glow">
          <CheckCircle2 size={32} className="text-white" />
        </div>
        <h1 className="mt-8 text-4xl md:text-5xl font-semibold">Message received.</h1>
        <p className="mt-4 text-muted-foreground">
          Thanks for reaching out. Someone from Ajetix will reply within one business day.
          For anything urgent, email us directly at{" "}
          <a href="mailto:info@ajetix.com" className="text-primary hover:underline">info@ajetix.com</a>.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-8 rounded-full glass px-6 py-3 text-sm hover:bg-white/10"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <span className="text-xs uppercase tracking-widest text-cyan">Contact</span>
        <h1 className="mt-4 text-5xl md:text-7xl font-semibold leading-[1.05]">
          Start a <span className="text-gradient">project</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Tell us about what you're building. Attach anything useful — briefs, sketches, decks —
          and we'll get back within one business day.
        </p>
        <a
          href="mailto:info@ajetix.com"
          className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <Mail size={14} /> info@ajetix.com
        </a>
      </motion.div>

      <form onSubmit={handleSubmit} className="mt-16 glass-strong rounded-3xl p-8 md:p-12 space-y-6">
        {/* Honeypot - hidden from users, catches bots */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label>Website</label>
          <input
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Full name" error={errors.name}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              required
              maxLength={120}
              autoComplete="name"
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
              maxLength={255}
              autoComplete="email"
            />
          </Field>
        </div>

        <Field label="Budget" error={errors.budget}>
          <div className="flex flex-wrap gap-2">
            {budgets.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBudget(b)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  budget === b
                    ? "bg-gradient-brand text-white shadow-glow"
                    : "glass hover:bg-white/10 text-foreground/80"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
          {budget === "Custom" && (
            <input
              placeholder="e.g. $75k discovery + build"
              value={customBudget}
              onChange={(e) => setCustomBudget(e.target.value)}
              className="input mt-3"
              maxLength={80}
            />
          )}
        </Field>

        <Field label="Project details" error={errors.projectDetails}>
          <textarea
            value={projectDetails}
            onChange={(e) => setProjectDetails(e.target.value)}
            rows={6}
            className="input resize-none"
            required
            maxLength={5000}
            placeholder="Tell us about the problem you're solving, timeline, and what success looks like."
          />
        </Field>

        <Field label="Attachments (optional)">
          <div
            {...getRootProps()}
            className={`glass rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition ${
              isDragActive ? "border-primary bg-primary/5" : "border-white/15"
            }`}
          >
            <input {...getInputProps()} />
            <Upload size={20} className="mx-auto text-muted-foreground" />
            <p className="mt-3 text-sm">
              {isDragActive ? "Drop files here" : "Drag & drop or click to upload"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              PDF, DOC, DOCX, TXT, PNG, JPG, ZIP · Max 10MB each · 5 files
            </p>
          </div>
          {files.length > 0 && (
            <ul className="mt-4 space-y-2">
              {files.map((f, i) => (
                <li key={i} className="flex items-center justify-between glass rounded-lg px-3 py-2 text-sm">
                  <span className="truncate">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    aria-label={`Remove ${f.name}`}
                  >
                    <X size={14} className="text-muted-foreground hover:text-destructive" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Field>

        {status === "error" && (
          <div className="glass rounded-xl p-4 flex items-start gap-3 text-sm">
            <AlertCircle className="text-destructive shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-medium">Something went wrong.</p>
              <p className="text-muted-foreground mt-1">
                {errorMsg || "Please try again."}{" "}
                Or email us directly at{" "}
                <a href="mailto:info@ajetix.com" className="text-primary hover:underline">
                  info@ajetix.com
                </a>
                .
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-8 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-60"
        >
          {status === "submitting" && <Loader2 size={16} className="animate-spin" />}
          {status === "submitting" ? "Sending..." : "Send message"}
        </button>
      </form>

      <style>{`
        .input {
          width: 100%;
          background: oklch(1 0 0 / 0.04);
          border: 1px solid oklch(1 0 0 / 0.12);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          color: var(--color-foreground);
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px oklch(0.62 0.22 262 / 0.2);
        }
      `}</style>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}