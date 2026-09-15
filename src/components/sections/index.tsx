import { profile, projects, stack } from "../../data/portfolio";
import { ProjectCard } from "../ProjectoCards";

export function Inicio() {
  return (
    <>
      <h1 className="text-5xl font-bold">{profile.name}</h1>
      <p className="mt-3 text-xl text-ink/70">{profile.role}</p>
    </>
  );
}

export function SobreMi() {
  return (
    <>
      <h2 className="text-3xl font-bold">Sobre mí</h2>
      <p className="mt-4 max-w-prose text-ink/80">{profile.summary}</p>
    </>
  );
}

export function Stack() {
  return (
    <>
      <h2 className="text-3xl font-bold">Stack</h2>
      <ul className="mt-4 flex max-w-lg flex-wrap justify-center gap-2">
        {stack.map((tech) => (
          <li key={tech} className="rounded border border-ink/20 px-3 py-1 text-sm">
            {tech}
          </li>
        ))}
      </ul>
    </>
  );
}

export function Proyectos() {
  return (
    <>
      <h2 className="text-3xl font-bold">Proyectos</h2>
      <div className="mt-6 grid max-w-4xl gap-4 md:grid-cols-3">
        {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
      </div>
    </>
  );
}

export function Contacto() {
  return (
    <>
      <h2 className="text-3xl font-bold">Contacto</h2>
      <a href="mailto:tu@correo.com" className="mt-4 inline-block underline">
        tu@correo.com
      </a>
    </>
  );
}