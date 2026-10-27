"use client";

import { LazyMotion, MotionConfig } from "motion/react";

// The animation code is fetched after the page is interactive, so it never blocks
// the first paint. domMax (not domAnimation) because the finish picker uses a
// layout animation (layoutId) for the sliding selection ring.
const loadFeatures = () => import("./motionFeatures").then((mod) => mod.default);

/** reducedMotion="user" turns off movement (not fades) for people who ask for less motion. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
