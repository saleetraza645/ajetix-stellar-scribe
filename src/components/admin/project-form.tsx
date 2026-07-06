import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiError, type ApiProjectAdmin } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

type FormState = {
  slug: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  tech: string;
  outcome: string;
  gradient: string;
  coverImage: string;
  gallery: string;
  client: string;
  timeline: string;
  published: boolean;
  order: number;
};

function toState(p?: Partial<ApiProjectAdmin>): FormState {
  return {
    slug: p?.slug || "",
    title: p?.title || "",
    category: p?.category || "",
    tagline: p?.tagline || "",
    description: p?.description || "",
    tech: (p?.tech || []).join(", "),
    outcome: p?.outcome || "",
    gradient: p?.gradient || "from-[#3B82F6] to-[#8B5CF6]",
    coverImage: p?.coverImage || "",
    gallery: (p?.gallery || []).join("\n"),
    client: p?.client || "",
    timeline: p?.timeline || "",
    published: p?.published ?? true,
    order: p?.order ?? 0,
  };
}

function toPayload(s: FormState): Partial<ApiProjectAdmin> {
  return {
    slug: s.slug.trim().toLowerCase(),
    title: s.title.trim(),
    category: s.category.trim(),
    tagline: s.tagline.trim(),
    description: s.description.trim(),
    tech: s.tech.split(",").map((t) => t.trim()).filter(Boolean),
    outcome: s.outcome.trim(),
    gradient: s.gradient.trim(),
    coverImage: s.coverImage.trim(),
    gallery: s.gallery.split("\n").map((g) => g.trim()).filter(Boolean),
    client: s.client.trim(),
    timeline: s.timeline.trim(),
    published: s.published,
    order: Number(s.order) || 0,
  };
}

export function ProjectForm({
  initial,
  mode,
  projectId,
}: {
  initial?: Partial<ApiProjectAdmin>;
  mode: "create" | "edit";
  projectId?: string;
}) {
  const [form, setForm] = useState<FormState>(toState(initial));
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = toPayload(form);
      return mode === "create"
        ? api.createProject(payload)
        : api.updateProject(projectId!, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      navigate({ to: "/admin/projects" });
    },
    onError: (e) => {
      setError(e instanceof ApiError ? e.message : "Save failed");
    },
  });

  const setField = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const input = "w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-primary/60 transition";
  const label = "text-xs uppercase tracking-widest text-muted-foreground";

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); setError(null); mutation.mutate(); }}
      className="glass rounded-2xl p-6 space-y-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="space-y-1.5">
          <div className={label}>Title</div>
          <input required maxLength={200} className={input} value={form.title} onChange={(e) => setField("title", e.target.value)} />
        </label>
        <label className="space-y-1.5">
          <div className={label}>Slug (kebab-case)</div>
          <input required pattern="[a-z0-9-]+" maxLength={120} className={input + " font-mono"} value={form.slug} onChange={(e) => setField("slug", e.target.value)} />
        </label>
        <label className="space-y-1.5">
          <div className={label}>Category</div>
          <input required maxLength={80} className={input} value={form.category} onChange={(e) => setField("category", e.target.value)} />
        </label>
        <label className="space-y-1.5">
          <div className={label}>Client</div>
          <input maxLength={200} className={input} value={form.client} onChange={(e) => setField("client", e.target.value)} />
        </label>
        <label className="space-y-1.5 md:col-span-2">
          <div className={label}>Tagline</div>
          <input required maxLength={300} className={input} value={form.tagline} onChange={(e) => setField("tagline", e.target.value)} />
        </label>
        <label className="space-y-1.5 md:col-span-2">
          <div className={label}>Description</div>
          <textarea required maxLength={5000} rows={6} className={input} value={form.description} onChange={(e) => setField("description", e.target.value)} />
        </label>
        <label className="space-y-1.5">
          <div className={label}>Timeline</div>
          <input maxLength={200} className={input} value={form.timeline} onChange={(e) => setField("timeline", e.target.value)} />
        </label>
        <label className="space-y-1.5">
          <div className={label}>Outcome</div>
          <input maxLength={500} className={input} value={form.outcome} onChange={(e) => setField("outcome", e.target.value)} />
        </label>
        <label className="space-y-1.5 md:col-span-2">
          <div className={label}>Tech (comma-separated)</div>
          <input className={input} value={form.tech} onChange={(e) => setField("tech", e.target.value)} placeholder="React, TypeScript, Three.js" />
        </label>
        <label className="space-y-1.5 md:col-span-2">
          <div className={label}>Cover image URL</div>
          <input type="url" className={input} value={form.coverImage} onChange={(e) => setField("coverImage", e.target.value)} placeholder="https://…" />
        </label>
        <label className="space-y-1.5 md:col-span-2">
          <div className={label}>Gallery URLs (one per line)</div>
          <textarea rows={4} className={input + " font-mono text-xs"} value={form.gallery} onChange={(e) => setField("gallery", e.target.value)} />
        </label>
        <label className="space-y-1.5">
          <div className={label}>Gradient (Tailwind)</div>
          <input className={input + " font-mono text-xs"} value={form.gradient} onChange={(e) => setField("gradient", e.target.value)} />
        </label>
        <label className="space-y-1.5">
          <div className={label}>Sort order</div>
          <input type="number" className={input} value={form.order} onChange={(e) => setField("order", Number(e.target.value))} />
        </label>
        <label className="flex items-center gap-2 md:col-span-2 mt-2">
          <input type="checkbox" checked={form.published} onChange={(e) => setField("published", e.target.checked)} className="h-4 w-4 accent-primary" />
          <span className="text-sm">Published (visible on the public portfolio)</span>
        </label>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={() => navigate({ to: "/admin/projects" })}
          className="rounded-full glass px-4 py-2 text-xs hover:bg-white/10"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center gap-2 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground px-5 py-2 text-xs font-medium disabled:opacity-50"
        >
          {mutation.isPending && <Loader2 size={14} className="animate-spin"/>}
          {mode === "create" ? "Create project" : "Save changes"}
        </button>
      </div>
    </form>
  );
}