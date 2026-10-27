"use client";

import { useRef } from "react";
import { useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import { Lamp } from "@/components/Lamp";
import { dayStops } from "@/lib/content";

// When each caption is fully visible, as a share of the scroll through the scene.
const windows = [
  [0, 0.25, 0.38],
  [0.3, 0.42, 0.58, 0.7],
  [0.62, 0.75, 1],
];
const fades = [
  [1, 1, 0],
  [0, 1, 1, 0],
  [0, 1, 1],
];

function Caption({ i, progress, reduce }: { i: number; progress: MotionValue<number>; reduce: boolean }) {
  const opacity = useTransform(progress, windows[i], reduce ? fades[i].map(() => 1) : fades[i]);
  const stop = dayStops[i];
  return (
    <m.li style={{ opacity }} className="[grid-area:1/1] motion-reduce:[grid-area:auto]">
      <p className="font-display text-2xl font-bold sm:text-3xl">
        {stop.time} <span className="text-amber">· {stop.kelvin}</span>
      </p>
      <p className="mt-2 max-w-md text-mist sm:text-lg">{stop.text}</p>
    </m.li>
  );
}

/**
 * Pinned scene: the section is 3 screens tall, the inner panel sticks while you scroll through it,
 * and the scroll position (0 to 1) drives the sky, the beam and the arm. For people who prefer
 * reduced motion the CSS drops the pinning and the three moments simply stack as text.
 */
export function DayScene() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const dusk = useTransform(p, [0, 0.9], reduce ? [0, 0] : [1, 0]);
  const beam = useTransform(p, [0, 1], reduce ? [1, 1] : [0.35, 1]);
  const reach = useTransform(p, [0, 1], reduce ? [1, 1] : [0.7, 1]);
  const cool = useTransform(p, [0.35, 1], reduce ? [0, 0] : [0, 0.6]); // the beam turns from amber toward white
  const tilt = useTransform(p, [0, 1], reduce ? [0, 0] : [-7, 7]);

  return (
    <section id="day" ref={ref} aria-labelledby="day-title" className="relative h-[300svh] motion-reduce:h-auto">
      {/* top-16 / minus 4rem keeps the pinned panel clear of the 64px sticky header. */}
      <div className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:py-24">
        <m.div aria-hidden="true" style={{ opacity: dusk }} className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-dusk),var(--color-night)_85%)]" />
        <div className="section-wrap relative grid h-full items-center gap-6 lg:grid-cols-2">
          <div>
            <p className="eyebrow">One lamp, three moments</p>
            <h2 id="day-title" className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">
              Light that follows your day
            </h2>
            <ol className="mt-8 grid motion-reduce:gap-8">
              {dayStops.map((_, i) => (
                <Caption key={i} i={i} progress={p} reduce={reduce} />
              ))}
            </ol>
          </div>
          <div className="mx-auto w-full max-lg:w-[min(20rem,32svh)] lg:max-w-md">
            <Lamp beam={beam} reach={reach} cool={cool} tilt={tilt} className="h-auto w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
