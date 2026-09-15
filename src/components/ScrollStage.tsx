import { useRef, type ReactNode } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import type { RefObject } from "react";

interface ScrollStageProps {
  stageRef: RefObject<HTMLDivElement | null>;
  sectionCount: number;
  children: ReactNode;
}


export function ScrollStage({ stageRef, sectionCount, children }: ScrollStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [debug, setDebug] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => setDebug(p));

  return (
    <div ref={stageRef} style={{ height: `${sectionCount * 100}dvh` }}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {children}
      </div>
    </div>

    /*<div ref={ref} style={{ height: `${sectionCount * 100}dvh` }}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <span className="absolute left-4 top-4 font-mono text-sm">
          {debug.toFixed(3)}
        </span>
        {children}
      </div>
    </div>*/
  );
}