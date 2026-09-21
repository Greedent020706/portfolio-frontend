import type { ComponentType } from "react";
import type { ApiSection, SectionKind, SiteData } from "../../lib/api";
import { ProjectCard } from "../ProjectoCards";

export interface SectionProps {
  section: ApiSection;
  profile: SiteData["profile"];
}

function Title({ section }: { section: ApiSection }) {
  return (
    <h2 className="text-3xl font-bold">{section.heading || section.nav_label}</h2>
  );
}

export function Inicio({ profile }: SectionProps) {
  return (
    <>
      <h1 className="text-5xl font-bold">{profile?.name}</h1>
      <p className="mt-3 text-xl text-ink/70">{profile?.role}</p>
    </>
  );
}

export function SobreMi({ section, profile }: SectionProps) {
  const text = section.body || profile?.summary;
  return (
    <>
      <Title section={section} />
      {text && <p className="mt-4 max-w-prose text-ink/80">{text}</p>}
    </>
  );
}

export function Stack({ section }: SectionProps) {
  const skills = section.content.skills ?? [];
  const groups = Object.groupBy(skills, (s) => s.category || "Otros");

  return (
    <>
      <Title section={section} />
      <div className="mt-6 grid max-w-3xl gap-6 text-left sm:grid-cols-2">
        {Object.entries(groups).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink/60">
              {category}
            </h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {items?.map((skill) => (
                <li
                  key={skill.id}
                  className="rounded border border-ink/20 px-3 py-1 text-sm"
                >
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

export function Proyectos({ section }: SectionProps) {
  const projects = section.content.projects ?? [];
  return (
    <>
      <Title section={section} />
      {section.body && <p className="mt-3 max-w-prose">{section.body}</p>}
      <div className="mt-6 grid max-w-4xl gap-4 md:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </>
  );
}

export function Contacto({ section, profile }: SectionProps) {
  return (
    <>
      <Title section={section} />
      {section.body && <p className="mt-3 max-w-prose">{section.body}</p>}
      {profile?.email && (
        <a href={`mailto:${profile.email}`} className="mt-4 inline-block underline">
          {profile.email}
        </a>
      )}
    </>
  );
}

export const sectionComponents: Record<SectionKind, ComponentType<SectionProps>> = {
  hero: Inicio,
  text: SobreMi,
  skills: Stack,
  projects: Proyectos,
  contact: Contacto,
};