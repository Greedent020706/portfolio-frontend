import { useRef, useState, useEffect } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";

export function useSectionScroll(sectionCount: number, sectionIds: string[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    // Math.min: cuando progress llega justo a 1, floor(1 * 5) daría 5,
    // que está fuera de rango en un array de 5 elementos.
    const next = Math.min(sectionCount - 1, Math.floor(progress * sectionCount));

    // Guard: scrollYProgress cambia decenas de veces por segundo.
    // Sin esto pedirías un render en cada frame.
    setActiveIndex((prev) => (prev === next ? prev : next));
  });

  function scrollToSection(index: number) {
    const el = ref.current;
    if (!el) return;
    const sectionHeight = el.offsetHeight / sectionCount;
    window.scrollTo({ top: el.offsetTop + index * sectionHeight + 1 });
  }

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const index = sectionIds.indexOf(hash);
    if (index >= 0) {
      // rAF: esperar a que el layout esté calculado
      requestAnimationFrame(() => scrollToSection(index));
    }
  }, []);

  useEffect(() => {
  const id = sectionIds[activeIndex];
  if (id && window.location.hash !== `#${id}`) {
    window.history.replaceState(null, "", `#${id}`);
  }
}, [activeIndex]);

  return { ref, activeIndex, scrollYProgress, scrollToSection };
}