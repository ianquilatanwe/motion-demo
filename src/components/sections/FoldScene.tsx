"use client";

import { useEffect, useRef } from "react";
import { easeInOut, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useStill } from "@/lib/useStill";
import { Captions } from "@/components/Captions";
import { Lamp } from "@/components/Lamp";
import { foldSteps } from "@/lib/content";
import { FLOOR, VIEW, lampTop } from "@/lib/lampPose";

// The lamp is drawn in abstract units; this scale makes the open lamp read as 420 mm.
const OPEN_MM = 420;
const OPEN_TOP = lampTop(1);
const MM_PER_UNIT = OPEN_MM / (FLOOR - OPEN_TOP);

/**
 * Pinned scene, scrubbed by scroll: the lamp folds flat joint by joint while a measuring line
 * follows its highest point (transforms only) and a read-out counts the height down. At the end a pocket outline
 * fades in around the folded lamp. With reduced motion, or in a window too short to fit it,
 * nothing is pinned: the lamp stays open and the three steps are plain text.
 */
function FoldSceneInner({ reduce, panel }: { reduce: boolean; panel: React.RefObject<HTMLDivElement | null> }) {
  const ref = useRef<HTMLElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  // Fold across the first 80% of the scroll, then the pocket draws in. Eased so it starts and ends gently.
  const open = useTransform(p, [0.05, 0.8], reduce ? [1, 1] : [1, 0], { ease: easeInOut });
  const beam = useTransform(open, [0, 0.45, 1], [0, 0.1, 1]);
  const top = useTransform(open, lampTop); // highest point of the lamp, in viewBox units
  const lift = useTransform(top, (y) => y - OPEN_TOP); // how far the top has dropped since the lamp was open
  const lineScale = useTransform(top, (y) => (FLOOR - y) / (FLOOR - OPEN_TOP));
  const mm = useTransform(top, (y) => Math.round((FLOOR - y) * MM_PER_UNIT));
  const pocket = useTransform(p, [0.82, 1], [0, 1]);
  const pocketScale = useTransform(p, [0.82, 1], [0.92, 1]);
  const settle = useTransform(p, [0.8, 1], reduce ? [1, 1] : [1, 0.82]);

  // Write the number straight into the DOM: no React re-render on every scroll frame.
  const show = (v: number) => {
    if (readout.current) readout.current.textContent = String(v);
  };
  useMotionValueEvent(mm, "change", show);
  useEffect(() => show(mm.get()), [mm]); // a reload part-way down the page starts mid-fold, with no change event to follow

  return (
    <section id="fold" ref={ref} data-still={reduce || undefined} aria-labelledby="fold-title" className="relative h-[320svh] still:h-auto">
      <div ref={panel} className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden still:static still:h-auto still:py-24">
        <div className="section-wrap grid h-full items-center gap-6 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Folds flat</p>
            <h2 id="fold-title" className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">
              Three folds, no tools
            </h2>
            <Captions items={foldSteps} progress={p} reduce={reduce} />
            {/* The big number is decoration (it changes every frame); the sentence under it is what a screen reader gets. */}
            <p className="mt-8 font-display text-5xl font-bold text-amber sm:text-7xl still:hidden" aria-hidden="true">
              <span ref={readout}>{OPEN_MM}</span> <span className="text-2xl text-mist sm:text-3xl">mm tall</span>
            </p>
            <p className="sr-only">The lamp is {OPEN_MM} millimetres tall when open and folds down to a flat strip.</p>
          </div>

          <div className="relative mx-auto w-full max-lg:w-[min(22rem,27svh)] lg:max-w-lg">
            {/* The measuring svg sits inside the scaled box, so it shrinks together with the lamp. */}
            <m.div style={{ scale: settle, transformOrigin: "50% 100%" }} className="relative">
              <Lamp open={open} beam={beam} className="h-auto w-full" />
              {/* Same viewBox as the lamp, so the numbers line up with its geometry. */}
            <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full still:hidden" style={{ overflow: "visible" }}>
              <g stroke="var(--color-amber)" strokeWidth="1.5" fill="none">
                {/* The line grows from the floor (scaleY) and the top tick and guide ride up and down (y): no attribute changes. */}
                <m.line x1="392" x2="392" y1={FLOOR} y2={OPEN_TOP} style={{ scaleY: lineScale, transformBox: "view-box", originX: 392 / VIEW.w, originY: FLOOR / VIEW.h }} />
                <m.g style={{ y: lift }}>
                  <line x1="384" x2="400" y1={OPEN_TOP} y2={OPEN_TOP} />
                  <line x1="20" x2="392" y1={OPEN_TOP} y2={OPEN_TOP} strokeDasharray="3 6" opacity="0.35" />
                </m.g>
                <line x1="384" x2="400" y1={FLOOR} y2={FLOOR} />
              </g>
              {/* The pocket: a rounded outline that fades in and settles around the folded lamp. */}
              <m.rect x="26" y="270" width="340" height="94" rx="22" fill="none" stroke="var(--color-amber-soft)" strokeWidth="2" style={{ opacity: pocket, scale: pocketScale, transformBox: "view-box", originX: 0.5, originY: 0.9 }} />
            </svg>
            </m.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Remounts when the "still" condition flips (after hydration, or when a phone is turned). The scroll
 * transforms above are built once from `reduce`, so a changed flag needs fresh ones.
 */
export function FoldScene() {
  const panel = useRef<HTMLDivElement>(null);
  const still = useStill(panel);
  return <FoldSceneInner key={String(still)} reduce={still} panel={panel} />;
}
