import type { ApiSection } from "../lib/api";

interface ProgressNavProps {
  sections: ApiSection[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function ProgressNav({ sections, activeIndex, onSelect }: ProgressNavProps) {
  return (
    <nav
      aria-label="Secciones"
      className="fixed right-5 top-1/2 z-10 -translate-y-1/2 sm:right-8"
    >
      <ul className="flex flex-col items-center gap-3.5">
        {sections.map((section, index) => {
          const isActive = index === activeIndex;
          return (
            <li key={section.slug}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={isActive ? "true" : undefined}
                aria-label={section.nav_label}
                className={
                  "block h-3.5 w-3.5 rounded-full border-2 transition-all duration-300 " +
                  "focus-visible:outline focus-visible:outline-2 " +
                  "focus-visible:outline-offset-2 focus-visible:outline-neon-cyan " +
                  (isActive
                    ? "scale-135 border-neon-cyan bg-neon-cyan shadow-[0_0_14px_var(--color-neon-cyan)]"
                    : "border-slate-500/80 bg-transparent hover:border-cyan-400")
                }
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}