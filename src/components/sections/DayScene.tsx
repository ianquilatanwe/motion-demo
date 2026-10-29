"use client";

import { useRef } from "react";
import { useScroll, useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useStill } from "@/lib/useStill";
import { Captions } from "@/components/Captions";
import { Lamp } from "@/components/Lamp";
import { dayStops } from "@/lib/content";

const dayItems = dayStops.map((stop) => ({
  title: (
    <>
      {stop.time} <span className="text-amber">· {stop.kelvin}</span>
    </>
  ),
  text: stop.text,
}));

/**
 * Pinned scene: the section is 3 screens tall, the inner panel sticks while you scroll through it,
 * and the scroll position (0 to 1) drives the sky, the beam and the arm. For people who prefer
 * reduced motion the CSS drops the pinning and the three moments simply stack as text.
 */
function DaySceneInner({ reduce, panel }: { reduce: boolean; panel: React.RefObject<HTMLDivElement | null> }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const dusk = useTransform(p, [0, 0.9], reduce ? [0, 0] : [1, 0]);
  const beam = useTransform(p, [0, 1], reduce ? [1, 1] : [0.35, 1]);
  const reach = useTransform(p, [0, 1], reduce ? [1, 1] : [0.7, 1]);
  const cool = useTransform(p, [0.35, 1], reduce ? [0, 0] : [0, 0.6]); // the beam turns from amber toward white
  const tilt = useTransform(p, [0, 1], reduce ? [0, 0] : [-7, 7]);

  return (
    <section id="day" ref={ref} data-still={reduce || undefined} aria-labelledby="day-title" className="relative h-[300svh] still:h-auto">
      {/* top-16 / minus 4rem keeps the pinned panel clear of the 64px sticky header. */}
      <div ref={panel} className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden still:static still:h-auto still:py-24">
        <m.div aria-hidden="true" style={{ opacity: dusk }} className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-dusk),var(--color-night)_85%)]" />
        <div className="section-wrap relative grid h-full items-center gap-6 lg:grid-cols-2">
          <div>
            <p className="eyebrow">One lamp, three moments</p>
            <h2 id="day-title" className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">
              Light that follows your day
            </h2>
            <Captions items={dayItems} progress={p} reduce={reduce} />
          </div>
          <div className="mx-auto w-full max-lg:w-[min(20rem,32svh)] lg:max-w-md">
            <Lamp beam={beam} reach={reach} cool={cool} tilt={tilt} motes className="h-auto w-full" />
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
export function DayScene() {
  const panel = useRef<HTMLDivElement>(null);
  const still = useStill(panel);
  return <DaySceneInner key={String(still)} reduce={still} panel={panel} />;
}
