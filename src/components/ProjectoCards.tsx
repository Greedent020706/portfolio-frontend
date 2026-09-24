import type { ApiProject } from "../lib/api";

interface ProjectCardProps {
  project: ApiProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    // .neon-frame pinta el borde giratorio; el <div> interior tapa el centro.
    <article className="neon-frame flex rounded-2xl text-left transition-transform duration-300 hover:-translate-y-1">
      <div className="flex w-full flex-col justify-between rounded-[calc(1rem-1.5px)] bg-surface p-4 sm:p-6">
        <div>
          {project.image && (
            <div className="relative mb-4 h-28 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/90">
              <img
                src={project.image}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-cyan-600/10 to-transparent" />
            </div>
          )}
          <h3 className="text-base font-bold sm:text-lg leading-snug text-white">{project.title}</h3>
          <p className="mt-2 text-[13px] leading-relaxed sm:text-sm text-slate-300">{project.description}</p>
        </div>

        {(project.tags.length > 0 || project.url) && (
          <div className="mt-4 border-t border-white/5 pt-3 sm:mt-5 sm:pt-4">
            {project.tags.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300"
                  >
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
                className="group mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 underline underline-offset-4 hover:text-cyan-300"
              >
                Ver sitio
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                >
                  ↗
                </span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
