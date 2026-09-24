import type { ComponentType } from "react";
import type { ApiSection, SectionKind, SiteData } from "../../lib/api";
import { ProjectCard } from "../ProjectoCards";
import { ContactForm } from "../ContactForm";

export interface SectionProps {
  section: ApiSection;
  profile: SiteData["profile"];
}

// Colores que se reparten por orden entre las categorías del stack.
const categoryColors = [
  { dot: "bg-cyan-400", text: "text-cyan-300" },
  { dot: "bg-emerald-400", text: "text-emerald-300" },
  { dot: "bg-purple-400", text: "text-purple-300" },
  { dot: "bg-blue-400", text: "text-blue-300" },
  { dot: "bg-rose-400", text: "text-rose-300" },
  { dot: "bg-amber-400", text: "text-amber-300" },
];

function Title({ section, subtitle }: { section: ApiSection; subtitle?: string }) {
  return (
    <header className="mb-5 sm:mb-10">
      <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
        {section.heading || section.nav_label}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-prose font-mono text-sm text-slate-400">{subtitle}</p>
      )}
      <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" />
    </header>
  );
}

export function Inicio({ profile }: SectionProps) {
  // La segunda mitad del nombre va con degradado, como en el diseño.
  const words = profile?.name.split(" ") ?? [];
  const cut = Math.ceil(words.length / 2);
  const first = words.slice(0, cut).join(" ");
  const last = words.slice(cut).join(" ");
  // Las "|" del rol se pintan en cian.
  const roleParts = profile?.role.split("|") ?? [];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl">
        {first}
        {last && (
          <>
            {" "}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              {last}
            </span>
          </>
        )}
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-slate-400 sm:text-2xl">
        {roleParts.map((part, i) => (
          <span key={i}>
            {i > 0 && <span className="font-mono text-cyan-400">|</span>}
            {part}
          </span>
        ))}
      </p>
    </div>
  );
}

export function SobreMi({ section, profile }: SectionProps) {
  const text = section.body || profile?.summary;
  return (
    <div className="mx-auto max-w-4xl">
      <Title section={section} />
      {text && (
        <div className="neon-frame rounded-2xl shadow-2xl">
          <div className="flex items-start gap-4 rounded-[calc(1rem-1.5px)] bg-surface p-6 text-left sm:p-10">
            <div
              aria-hidden="true"
              className="hidden rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 font-mono text-xl text-cyan-400 sm:block"
            >
              &gt;_
            </div>
            <div>
              <span className="mb-2 block font-mono text-xs font-semibold uppercase tracking-widest text-cyan-400">
                Perfil profesional
              </span>
              <p className="text-base leading-relaxed text-slate-300 sm:text-lg">{text}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Stack({ section }: SectionProps) {
  const skills = section.content.skills ?? [];
  const groups = Object.groupBy(skills, (s) => s.category || "Otros");

  return (
    <div className="mx-auto max-w-5xl">
      <Title section={section} subtitle={section.body} />
      <div className="grid gap-3 text-left sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {Object.entries(groups).map(([category, items], i) => {
          const color = categoryColors[i % categoryColors.length];
          return (
            <div key={category} className="glass-card rounded-2xl p-4 sm:p-5">
              <div className="mb-3 flex sm:mb-4 items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${color.dot}`} />
                <h3 className={`font-mono text-xs font-bold uppercase tracking-widest ${color.text}`}>
                  {category}
                </h3>
              </div>
              <ul className="flex flex-wrap gap-1.5 sm:gap-2">
                {items?.map((skill) => (
                  <li
                    key={skill.id}
                    className="flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-900/90 px-2.5 py-1 text-xs font-medium text-slate-200 sm:px-3 sm:py-1.5 transition-colors hover:border-cyan-400/50 hover:bg-slate-800"
                  >
                    {skill.icon && (
                      <img
                        src={skill.icon}
                        alt=""
                        className="h-4 w-4 object-contain"
                        loading="lazy"
                      />
                    )}
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Proyectos({ section }: SectionProps) {
  const projects = section.content.projects ?? [];
  return (
    <div className="mx-auto max-w-6xl">
      <Title section={section} subtitle={section.body} />
      <div className="grid items-stretch gap-3 sm:gap-6 md:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}

export function Contacto({ section }: SectionProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <Title section={section} subtitle={section.body} />
      <ContactForm />
    </div>
  );
}

export const sectionComponents: Record<SectionKind, ComponentType<SectionProps>> = {
  hero: Inicio,
  text: SobreMi,
  skills: Stack,
  projects: Proyectos,
  contact: Contacto,
};