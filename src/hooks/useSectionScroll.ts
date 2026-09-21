import { useEffect, useRef, useState, type RefObject } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";

interface HasSlug {
  slug: string;
}

function scrollToIndex(
  ref: RefObject<HTMLDivElement | null>,
  count: number,
  index: number,
) {
  const el = ref.current;
  if (!el || count === 0) return;
  const sectionHeight = el.offsetHeight / count;
  // +1: sin él caes justo en el borde y el redondeo puede dejarte
  // en la sección anterior.
  window.scrollTo({ top: el.offsetTop + index * sectionHeight + 1 });
}

export function useSectionScroll(sections: HasSlug[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const count = sections.length;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    // Math.min: con progress === 1, floor(1 * count) se sale del array.
    const next = Math.min(count - 1, Math.floor(progress * count));
    // Guard: solo re-renderiza cuando cambia de sección, no en cada frame.
    setActiveIndex((prev) => (prev === next ? prev : next));
  });

  // Ir a la sección del hash al cargar y cuando el usuario cambia el hash.
  useEffect(() => {
    function goToHash() {
      const slug = window.location.hash.slice(1);
      const index = sections.findIndex((s) => s.slug === slug);
      if (index >= 0) {
        // rAF: esperar a que el layout tenga su altura final.
        requestAnimationFrame(() => scrollToIndex(ref, sections.length, index));
      }
    }
    goToHash();
    window.addEventListener("hashchange", goToHash);
    return () => window.removeEventListener("hashchange", goToHash);
  }, [sections]);

  // Reflejar la sección activa en la URL sin ensuciar el historial.
  useEffect(() => {
    const slug = sections[activeIndex]?.slug;
    if (slug && window.location.hash !== `#${slug}`) {
      window.history.replaceState(null, "", `#${slug}`);
    }
  }, [activeIndex, sections]);

  function scrollToSection(index: number) {
    scrollToIndex(ref, count, index);
  }

  return { ref, activeIndex, scrollYProgress, scrollToSection };
}