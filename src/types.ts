export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  url?: string;
}

export interface SectionMeta {
  id: string;
  label: string;
}