import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { getSite, type SiteData } from "./lib/api";
import { useSectionScroll } from "./hooks/useSectionScroll";
import { ProgressNav } from "./components/ProgressNav";
import { ScrollStage } from "./components/ScrollStage";
import { sectionComponents } from "./components/sections";

export default function App() {
  const [site, setSite] = useState<SiteData | null>(null);

  useEffect(() => {
    let cancelled = false;

    getSite().then((data) => {
      if (cancelled) return;
      // Descarta secciones de un tipo que el frontend aún no sabe dibujar
      // (por ejemplo, si añades un tipo nuevo en Django antes que en React).
      setSite({
        ...data,
        sections: data.sections.filter((s) => s.kind in sectionComponents),
      });
    });

    // Si el componente se desmonta antes de que llegue la respuesta,
    // no se intenta actualizar el estado.
    return () => {
      cancelled = true;
    };
  }, []);

  if (!site) {
    return (
      <div
        role="status"
        className="grid min-h-[100dvh] place-items-center font-mono text-sm text-slate-400"
      >
        <p>Cargando…</p>
      </div>
    );
  }

  if (site.sections.length === 0) {
    return (
      <div className="grid min-h-[100dvh] place-items-center font-mono text-sm text-slate-400">
        <p>No hay secciones visibles.</p>
      </div>
    );
  }

  return <Portfolio site={site} />;
}

function Portfolio({ site }: { site: SiteData }) {
  const { sections, profile } = site;
  const { ref, activeIndex, scrollYProgress, scrollToSection } =
    useSectionScroll(sections);
  const reduce = useReducedMotion();
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  const active = sections[activeIndex];
  const Section = sectionComponents[active.kind];

  return (
    // isolate: crea un contexto de apilamiento propio para que los fondos
    // con -z-10 queden detrás del contenido pero delante del body.
    <main className="relative isolate text-slate-200 selection:bg-cyan-500/30 selection:text-cyan-200">
      <div
        aria-hidden="true"
        className="grid-overlay pointer-events-none fixed inset-0 -z-10"
      />

      <ProgressNav
        sections={sections}
        activeIndex={activeIndex}
        onSelect={scrollToSection}
      />

      <ScrollStage stageRef={ref} sectionCount={sections.length}>
        <motion.div
          style={{ y: reduce ? 0 : bgY }}
          aria-hidden="true"
          // 150%: el parallax sube la capa un 30% de SU altura; con menos
          // se vería el borde inferior en la última sección.
          className="ambient-bg absolute inset-x-0 top-0 -z-10 h-[150%]"
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -40 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
            className="grid h-full place-items-center px-6 text-center sm:px-16"
          >
            <div className="w-full">
              <Section section={active} profile={profile} />
            </div>
          </motion.div>
        </AnimatePresence>
      </ScrollStage>

      {/* Todo el contenido, accesible para lectores de pantalla y Ctrl+F */}
      <div className="sr-only">
        {sections.map((s) => {
          if (s.kind === "contact") return null;
          const S = sectionComponents[s.kind];
          return (
            <section key={s.slug} aria-label={s.nav_label}>
              <S section={s} profile={profile} />
            </section>
          );
        })}
      </div>
    </main>
  );
}