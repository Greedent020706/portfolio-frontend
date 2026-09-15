import { projects } from "./data/portfolio";
import { ProjectCard } from "./components/ProjectoCards";
import { sections, sectionComponents } from "./data/portfolio";
import { ProgressNav } from "./components/ProgressNav";
import { useState } from "react";
import { ScrollStage } from "./components/ScrollStage";
import { useSectionScroll } from "./hooks/useSectionScroll";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export default function App() {
  const { ref, activeIndex, scrollToSection } = useSectionScroll(sections.length, sections.map((s) => s.id));
  const reduce = useReducedMotion();
  const active = sections[activeIndex];
  const Section = sectionComponents[active.id];
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <div className="relative min-h-screen bg-ink/5 text-ink">
      <main className="bg-paper text-ink">
        <ProgressNav
          sections={sections}
          activeIndex={activeIndex}
          onSelect={scrollToSection}
        />
        <ScrollStage stageRef={ref} sectionCount={sections.length}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -40 }}
              transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
              className="grid h-full place-items-center px-8 text-center"
            >
              <div><Section /></div>
            </motion.div>

            <motion.div
              style={{ y: bgY }}
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-b from-accent/10 to-transparent"
            />
          </AnimatePresence>

          <div className="sr-only">
            {sections.map((s) => {
              const S = sectionComponents[s.id];
              return <section key={s.id} id={s.id} aria-label={s.label}><S /></section>;
            })}
          </div>
        </ScrollStage>
      </main>

      {/*<main className="mx-auto max-w-4xl p-6">
        <h1 className="mb-6 text-3xl font-bold">Mis Proyectos</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </main>*/}

    </div>
  );
}
