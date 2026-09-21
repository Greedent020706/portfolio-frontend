import type { ReactNode, RefObject } from "react";

interface ScrollStageProps {
  stageRef: RefObject<HTMLDivElement | null>;
  sectionCount: number;
  children: ReactNode;
}

export function ScrollStage({ stageRef, sectionCount, children }: ScrollStageProps) {
  return (
    <div ref={stageRef} style={{ height: `${sectionCount * 100}dvh` }}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {children}
      </div>
    </div>
  );
}