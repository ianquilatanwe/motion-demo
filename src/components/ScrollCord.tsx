"use client";

import { useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";

/**
 * A pull-cord down the right edge: the amber line grows with the page, and the bulb on the end of it
 * slides down with it. Hidden on phones, where the edge is needed for the scrollbar and thumbs.
 */
export function ScrollCord() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const spring = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.0005 });
  const p = reduce ? scrollYProgress : spring;
  // translateY in % is a share of the element's own height. The bulb's carrier is as tall as the
  // track, so this moves it along the track using only transform (no layout per frame).
  const y = useTransform(p, (v) => `${v * 100}%`);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed bottom-8 right-3 top-24 z-30 hidden w-3 justify-center md:flex xl:right-5">
      <div className="relative w-px bg-edge">
        <m.div style={{ scaleY: p }} className="h-full w-px origin-top bg-amber" />
        <m.div style={{ y }} className="absolute inset-x-0 top-0 h-full">
          <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber shadow-[0_0_14px_3px_rgba(255,179,71,0.6)]" />
        </m.div>
      </div>
    </div>
  );
}
