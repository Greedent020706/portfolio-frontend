import type { ApiProject } from "../lib/api";

interface ProjectCardProps {
  project: ApiProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="rounded-xl border border-ink/15 p-5 text-left">
      {project.image && (
        <img
          src={project.image}
          alt=""
          className="mb-3 aspect-video w-full rounded-lg object-cover"
        />
      )}
      <h3 className="text-lg font-semibold">{project.title}</h3>
      <p className="mt-2 text-sm text-ink/70">{project.description}</p>
      {project.tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li key={tag} className="rounded bg-ink/10 px-2 py-1 text-xs">
              {tag}
            </li>
          ))}
        </ul>
      )}
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm underline"
        >
          Ver sitio
        </a>
      )}
    </article>
  );
}