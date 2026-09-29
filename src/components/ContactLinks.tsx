import type { ReactNode } from "react";
import type { SiteData } from "../lib/api";

type Profile = NonNullable<SiteData["profile"]>;

interface ContactLink {
  label: string;
  value: string;
  href: string;
  icon: ReactNode;
  color: string;
}

// Iconos en SVG inline para no añadir ninguna librería.
const icons = {
  email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.45 15.06L2 22l5.07-1.55A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3 .92.95-2.93-.2-.31a8.2 8.2 0 1 1 6.73 3.64Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.17.25-.64.8-.78.97-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-3.34-2.92c-.25-.43.25-.4.72-1.34.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.85 2.03c0 1.2.87 2.36 1 2.52.12.17 1.72 2.63 4.17 3.69 1.55.67 2.16.73 2.93.61.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.17-.47-.29Z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  ),
};

function buildLinks(profile: Profile): ContactLink[] {
  const links: ContactLink[] = [];

  if (profile.email) {
    links.push({
      label: "Correo",
      value: profile.email,
      href: `mailto:${profile.email}`,
      icon: icons.email,
      color: "text-cyan-400 group-hover:border-cyan-400/60",
    });
  }

  if (profile.whatsapp) {
    // wa.me solo acepta dígitos: quitamos "+", espacios y guiones.
    const digits = profile.whatsapp.replace(/\D/g, "");
    links.push({
      label: "WhatsApp",
      value: profile.whatsapp,
      href: `https://wa.me/${digits}`,
      icon: icons.whatsapp,
      color: "text-emerald-400 group-hover:border-emerald-400/60",
    });
  }

  if (profile.github) {
    links.push({
      label: "GitHub",
      // Se muestra "github.com/usuario" en vez de la URL completa.
      value: profile.github.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
      href: profile.github,
      icon: icons.github,
      color: "text-purple-400 group-hover:border-purple-400/60",
    });
  }

  return links;
}

export function ContactLinks({ profile }: { profile: SiteData["profile"] }) {
  const links = profile ? buildLinks(profile) : [];
  if (links.length === 0) return null;

  return (
    <ul className="mx-auto mt-8 grid w-full max-w-xl gap-3 text-left sm:gap-4">
      {links.map((link) => {
        const external = !link.href.startsWith("mailto:");
        return (
          <li key={link.label}>
            <a
              href={link.href}
              {...(external && { target: "_blank", rel: "noopener noreferrer" })}
              className="glass-card group flex items-center gap-4 rounded-2xl p-4 transition-colors
                         hover:bg-slate-800/60 focus-visible:outline focus-visible:outline-2
                         focus-visible:outline-offset-2 focus-visible:outline-neon-cyan sm:p-5"
            >
              <span
                aria-hidden="true"
                className={`rounded-xl border border-slate-700 bg-slate-900/80 p-2.5 transition-colors ${link.color}`}
              >
                {link.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-xs font-semibold uppercase tracking-widest text-slate-400">
                  {link.label}
                </span>
                <span className="block truncate text-sm font-medium text-white sm:text-base">
                  {link.value}
                </span>
              </span>
              <span aria-hidden="true" className="text-slate-500 transition-transform group-hover:translate-x-1">
                ➜
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
