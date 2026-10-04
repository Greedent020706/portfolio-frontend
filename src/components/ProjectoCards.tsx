import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import type { ApiProject } from "../lib/api";

interface ProjectCardProps {
  project: ApiProject;
}

// Cuántas etiquetas se ven en la tarjeta; el resto se resume en "+N"
// (en el modal salen todas).
const MAX_CARD_TAGS = 4;

/*
 * Tarjeta de alto fijo: el título se corta a 2 líneas y la descripción a 4
 * (line-clamp añade los "…"). El texto completo se ve en el modal "Ver más".
 *
 * Nota: project.image existe en la API pero de momento no se pinta;
 * se usará más adelante.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const visibleTags = project.tags.slice(0, MAX_CARD_TAGS);
  const hiddenTags = project.tags.length - visibleTags.length;

  return (
    // .neon-frame pinta el borde giratorio; el <div> interior tapa el centro.
    <article className="neon-frame flex rounded-2xl text-left transition-transform duration-300 hover:-translate-y-1">
      <div className="flex w-full flex-col rounded-[calc(1rem-1.5px)] bg-surface p-4 sm:p-6">
        {/* min-h: reserva siempre el hueco de 2 / 4 líneas para que todas
            las tarjetas tengan el mismo alto aunque el texto sea corto. */}
        <h3 className="line-clamp-2 min-h-[2lh] text-base font-bold leading-snug text-white sm:text-lg">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-4 min-h-[4lh] text-[13px] leading-relaxed text-slate-300 sm:text-sm">
          {project.description}
        </p>

        <div className="mt-auto pt-4">
          {project.tags.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {visibleTags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
              {hiddenTags > 0 && <Tag>+{hiddenTags}</Tag>}
            </ul>
          )}

          <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/5 pt-3">
            <button
              type="button"
              onClick={() => dialogRef.current?.showModal()}
              className="text-xs font-semibold text-slate-300 underline underline-offset-4 hover:text-white
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                         focus-visible:outline-neon-cyan"
            >
              Ver más
            </button>
            {project.url && <ExternalLink href={project.url}>Ver sitio</ExternalLink>}
          </div>
        </div>
      </div>

      <ProjectModal project={project} dialogRef={dialogRef} />
    </article>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <li className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300">
      {children}
    </li>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 underline underline-offset-4 hover:text-cyan-300"
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      >
        ↗
      </span>
    </a>
  );
}

/*
 * Modal con <dialog> nativo: showModal() lo pone por encima de todo
 * (aunque la tarjeta esté dentro del carrusel con overflow), atrapa el foco
 * y se cierra con Esc sin escribir nada extra.
 */
function ProjectModal({
  project,
  dialogRef,
}: {
  project: ApiProject;
  dialogRef: RefObject<HTMLDialogElement | null>;
}) {
  // Mientras el modal está abierto se bloquea el scroll de la página;
  // si no, la rueda del ratón cambiaría de sección por detrás.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const lock = () => (document.documentElement.style.overflow = "hidden");
    const unlock = () => (document.documentElement.style.overflow = "");
    const observer = new MutationObserver(() => (dialog.open ? lock() : unlock()));
    observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });
    return () => {
      observer.disconnect();
      unlock();
    };
  }, [dialogRef]);

  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`project-${project.id}-title`}
      // Clic fuera de la caja (en el fondo oscuro) = cerrar.
      onClick={(e) => e.target === e.currentTarget && close()}
      // m-auto: el reset de Tailwind quita el margen que centra el <dialog>.
      className="project-modal m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl bg-transparent p-0 text-left
                 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="neon-frame rounded-2xl">
        <div className="max-h-[80dvh] overflow-y-auto rounded-[calc(1rem-1.5px)] bg-surface p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <h3 id={`project-${project.id}-title`} className="text-lg font-bold leading-snug text-white sm:text-xl">
              {project.title}
            </h3>
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-slate-700 text-slate-400
                         transition-colors hover:border-cyan-400/60 hover:text-white
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-300 sm:text-base">
            {project.description}
          </p>

          {project.tags.length > 0 && (
            <>
              <h4 className="mt-6 font-mono text-xs font-semibold uppercase tracking-widest text-cyan-400">
                Tecnologías
              </h4>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </ul>
            </>
          )}

          {(project.url || project.repo_url) && (
            <div className="mt-6 flex flex-wrap gap-5 border-t border-white/5 pt-4">
              {project.url && <ExternalLink href={project.url}>Ver sitio</ExternalLink>}
              {project.repo_url && <ExternalLink href={project.repo_url}>Ver código</ExternalLink>}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
