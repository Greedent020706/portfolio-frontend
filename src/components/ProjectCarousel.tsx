import { useEffect, useRef, useState } from "react";
import type { ApiProject } from "../lib/api";
import { ProjectCard } from "./ProjectoCards";

interface ProjectCarouselProps {
  projects: ApiProject[];
}

/*
 * Carrusel tipo "slick" sin librerías: el desplazamiento lo hace el propio
 * navegador con scroll horizontal + scroll-snap (así el swipe en móvil es
 * nativo). Las flechas y los puntos solo mueven ese scroll.
 *
 * Cuántas tarjetas se ven a la vez lo decide el CSS (basis-*):
 *   móvil: 1 (y un trocito de la siguiente) · sm: 2 · md: 3
 */
export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  // Número de posiciones a las que se puede llegar (n - tarjetas visibles + 1).
  const [stops, setStops] = useState(1);

  // Distancia entre el inicio de una tarjeta y el de la siguiente (ancho + gap).
  function slideStep() {
    const track = trackRef.current;
    const first = track?.children[0] as HTMLElement | undefined;
    const second = track?.children[1] as HTMLElement | undefined;
    if (!first) return 0;
    return second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function update() {
      const step = slideStep();
      if (!track || step === 0) return;
      const maxScroll = track.scrollWidth - track.clientWidth;
      setStops(maxScroll > 1 ? Math.round(maxScroll / step) + 1 : 1);
      setActive(Math.round(track.scrollLeft / step));
    }

    update();
    track.addEventListener("scroll", update, { passive: true });
    // Recalcular al cambiar el tamaño (girar el móvil, redimensionar ventana).
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [projects.length]);

  function goTo(index: number) {
    const clamped = Math.max(0, Math.min(stops - 1, index));
    trackRef.current?.scrollTo({ left: clamped * slideStep(), behavior: "smooth" });
  }

  const hasControls = stops > 1;

  return (
    <div aria-roledescription="carrusel" aria-label="Proyectos">
      <ul
        ref={trackRef}
        // py-2: deja sitio al hover (-translate-y-1) para que no se recorte.
        // overscroll-x-contain: el swipe no dispara el "atrás" del navegador.
        className="-my-2 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain py-2
                   [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((p, i) => (
          <li
            key={p.id}
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} de ${projects.length}`}
            // grid: hace que la tarjeta ocupe todo el alto/ancho del <li>,
            // así todas miden lo mismo aunque tengan textos distintos.
            className="grid shrink-0 basis-[85%] snap-start
                       sm:basis-[calc((100%-1.5rem)/2)] md:basis-[calc((100%-3rem)/3)]"
          >
            <ProjectCard project={p} />
          </li>
        ))}
      </ul>

      {hasControls && (
        <div className="mt-4 flex items-center justify-center gap-4 sm:mt-6">
          <ArrowButton direction="prev" disabled={active === 0} onClick={() => goTo(active - 1)} />

          <div className="flex items-center gap-2">
            {Array.from({ length: stops }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir al proyecto ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                className={
                  "h-2 rounded-full transition-all duration-300 " +
                  (i === active
                    ? "w-6 bg-neon-cyan shadow-[0_0_10px_var(--color-neon-cyan)]"
                    : "w-2 bg-slate-600 hover:bg-slate-400")
                }
              />
            ))}
          </div>

          <ArrowButton direction="next" disabled={active >= stops - 1} onClick={() => goTo(active + 1)} />
        </div>
      )}
    </div>
  );
}

function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Proyecto anterior" : "Proyecto siguiente"}
      className="grid h-9 w-9 place-items-center rounded-full border border-slate-700 bg-slate-900/80
                 text-slate-300 transition-colors hover:border-cyan-400/60 hover:text-cyan-300
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                 focus-visible:outline-neon-cyan disabled:pointer-events-none disabled:opacity-30"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
        <path d={direction === "prev" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
      </svg>
    </button>
  );
}
