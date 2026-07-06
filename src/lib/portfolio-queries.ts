import { useQuery } from "@tanstack/react-query";
import { api, API_ENABLED, type ApiProject } from "./api-client";
import { projects as localProjects, getProject as getLocalProject, type Project } from "./portfolio-data";

export function apiProjectToProject(p: ApiProject): Project {
  const local = localProjects.find((l) => l.slug === p.slug);
  return {
    slug: p.slug,
    title: p.title,
    category: p.category,
    tagline: p.tagline,
    description: p.description,
    tech: p.tech ?? [],
    outcome: p.outcome ?? "",
    gradient: p.gradient || local?.gradient || "from-[#3B82F6] to-[#8B5CF6]",
    coverImage: p.coverImage || local?.coverImage || "",
  };
}

export async function fetchProject(slug: string): Promise<Project | undefined> {
  if (!API_ENABLED) return getLocalProject(slug);
  try {
    const { project } = await api.getProject(slug);
    return apiProjectToProject(project);
  } catch {
    return getLocalProject(slug);
  }
}

export function usePortfolioProjects() {
  return useQuery({
    queryKey: ["portfolio", "list"],
    queryFn: async () => {
      if (!API_ENABLED) return localProjects;
      const { projects } = await api.listProjects();
      return projects.map(apiProjectToProject);
    },
    staleTime: 60_000,
    retry: 2,
    enabled: true,
  });
}

export function usePortfolioProject(slug: string) {
  return useQuery({
    queryKey: ["portfolio", "detail", slug],
    queryFn: async () => {
      if (!API_ENABLED) {
        const p = getLocalProject(slug);
        if (!p) throw new Error("Not found");
        return p;
      }
      const { project } = await api.getProject(slug);
      return apiProjectToProject(project);
    },
    staleTime: 60_000,
    retry: 2,
  });
}
