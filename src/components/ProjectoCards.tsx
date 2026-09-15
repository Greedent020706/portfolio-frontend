import type { Project } from "../types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="rounded-xl border border-ink/15 p-5">
      <h3 className="text-lg font-semibold">{project.title}</h3>
      <p className="mt-2 text-sm text-ink/70">{project.description}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li key={tag} className="rounded bg-ink/10 px-2 py-1 text-xs">
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}