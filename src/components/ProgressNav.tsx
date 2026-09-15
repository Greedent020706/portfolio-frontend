import type { SectionMeta } from "../types";

interface ProgressNavProps {
    sections: SectionMeta[];
    activeIndex: number;
    onSelect: (index: number) => void;
}

export function ProgressNav({ sections, activeIndex, onSelect }: ProgressNavProps) {
    return (
        <nav
            aria-label="Secciones"
            className="fixed right-6 top-1/2 z-10 -translate-y-1/2">

            <ul>
                {sections.map((section, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <li key={section.id} className="mb-2">
                            <button
                                type="button"
                                onClick={() => onSelect(index)}
                                aria-current={isActive ? "true" : undefined}
                                aria-label={section.label}
                                className={
                                    "block rounded-full border-2 border-ink transition-all " +
                                    "focus-visible:outline focus-visible:outline-2 " +
                                    "focus-visible:outline-offset-2 focus-visible:outline-accent " +
                                    (isActive ? "h-4 w-4 bg-ink" : "h-3 w-3 bg-transparent")
                                }
                            />
                        </li>
                    )
                })}
            </ul>
        </nav>
    );
}


