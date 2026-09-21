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
        className="grid min-h-[100dvh] place-items-center bg-paper text-ink"
      >
        <p>Cargando…</p>
      </div>
    );
  }

  if (site.sections.length === 0) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-paper text-ink">
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
    <main className="bg-paper text-ink">
      <ProgressNav
        sections={sections}
        activeIndex={activeIndex}
        onSelect={scrollToSection}
      />

      <ScrollStage stageRef={ref} sectionCount={sections.length}>
        <motion.div
          style={{ y: reduce ? 0 : bgY }}
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-accent/10 to-transparent"
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -40 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
            className="grid h-full place-items-center px-8 text-center"
          >
            <div>
              <Section section={active} profile={profile} />
            </div>
          </motion.div>
        </AnimatePresence>
      </ScrollStage>

      {/* Todo el contenido, accesible para lectores de pantalla y Ctrl+F */}
      <div className="sr-only">
        {sections.map((s) => {
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