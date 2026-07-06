// Thin fetch wrapper for the standalone Express API.
// If VITE_API_BASE_URL is unset, functions throw a distinct error so
// callers can fall back to local data (used before the API is deployed).

const RAW_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export const API_ENABLED = Boolean(RAW_BASE);

const TOKEN_KEY = "ajetix.admin.token";

export const authToken = {
  get: () => (typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY)),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(public status: number, message: string, public payload?: unknown) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}, auth = false): Promise<T> {
  if (!RAW_BASE) throw new ApiError(0, "API not configured (VITE_API_BASE_URL missing)");
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (auth) {
    const token = authToken.get();
    if (!token) throw new ApiError(401, "Not authenticated");
    headers.set("Authorization", `Bearer ${token}`);
  }
  const res = await fetch(`${RAW_BASE}${path}`, { ...init, headers });
  let body: unknown = null;
  try { body = await res.json(); } catch { /* empty */ }
  if (!res.ok) {
    if (res.status === 401 && auth) authToken.clear();
    const msg = (body as { error?: string })?.error || res.statusText;
    throw new ApiError(res.status, msg, body);
  }
  return body as T;
}

export const api = {
  // auth
  login: (email: string, password: string) =>
    request<{ token: string; admin: { id: string; email: string; name: string } }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) },
    ),
  logout: () => request<{ ok: true }>("/api/auth/logout", { method: "POST" }, true),
  me: () =>
    request<{ admin: { id: string; email: string; name: string; lastLoginAt: string | null } }>(
      "/api/auth/me",
      {},
      true,
    ),

  // projects
  listProjects: () => request<{ projects: ApiProject[] }>("/api/projects"),
  getProject: (slug: string) => request<{ project: ApiProject }>(`/api/projects/${slug}`),
  incrementView: (slug: string) =>
    request<{ ok: true }>(`/api/projects/${slug}/view`, { method: "POST" }),

  // admin projects
  adminListProjects: () =>
    request<{ projects: ApiProject[] }>("/api/projects/admin/all", {}, true),
  adminGetProject: (id: string) =>
    request<{ project: ApiProject }>(`/api/projects/admin/by-id/${id}`, {}, true),
  createProject: (data: Partial<ApiProjectAdmin>) =>
    request<{ project: ApiProject }>("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }, true),
  updateProject: (id: string, data: Partial<ApiProjectAdmin>) =>
    request<{ project: ApiProject }>(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }, true),
  deleteProject: (id: string) =>
    request<{ ok: true }>(`/api/projects/${id}`, { method: "DELETE" }, true),

  // admin submissions
  listSubmissions: (status?: string) =>
    request<{ submissions: ContactSubmission[] }>(
      `/api/contact-submissions${status ? `?status=${status}` : ""}`,
      {},
      true,
    ),
  updateSubmissionStatus: (id: string, status: "new" | "replied" | "archived") =>
    request<{ submission: ContactSubmission }>(
      `/api/contact-submissions/${id}`,
      { method: "PATCH", body: JSON.stringify({ status }) },
      true,
    ),

  // analytics
  analytics: () =>
    request<{
      submissions: { total: number; week: number; month: number; new: number };
      topProjects: { slug: string; title: string; views: number }[];
    }>("/api/analytics/summary", {}, true),
};

export type ApiProject = {
  _id: string;
  slug: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  tech: string[];
  outcome: string;
  gradient: string;
  coverImage: string;
  gallery: string[];
  client: string;
  timeline: string;
  views: number;
};

export type ApiProjectAdmin = ApiProject & {
  published: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ContactSubmission = {
  _id: string;
  name: string;
  email: string;
  budget: string;
  projectDetails: string;
  fileUrls: string[];
  status: "new" | "replied" | "archived";
  createdAt: string;
};