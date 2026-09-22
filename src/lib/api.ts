import { fallbackSite } from "../data/portfolio";

export interface ApiProject {
  id: number;
  title: string;
  description: string;
  image: string | null;
  url: string;
  repo_url: string;
  tags: string[];
}

export interface ApiSkill {
  id: number;
  name: string;
  category: string;
  icon: string | null;
}

export type SectionKind = "hero" | "text" | "skills" | "projects" | "contact";

export interface ApiSection {
  slug: string;
  kind: SectionKind;
  nav_label: string;
  heading: string;
  body: string;
  image: string | null;
  content: {
    projects?: ApiProject[];
    skills?: ApiSkill[];
  };
}

export interface SiteData {
  profile: {
    name: string;
    role: string;
    summary: string;
    email: string;
    avatar: string | null;
  } | null;
  sections: ApiSection[];
}

const API_URL = import.meta.env.VITE_API_URL;

export async function getSite(): Promise<SiteData> {
  try {
    const res = await fetch(`${API_URL}/api/site/`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn("API no disponible, usando datos locales:", error);
    return fallbackSite;
  }
}