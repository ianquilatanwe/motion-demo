"use client";

import { useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { Lamp } from "@/components/Lamp";

/** Headline lines slide up out of a mask (CSS only), the lamp warms up, and on a mouse the glow drifts after the pointer. */
export function Hero() {
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 50, damping: 20 });
  const y = useSpring(0, { stiffness: 50, damping: 20 });

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    // Touch and pen input have no hover, so only a mouse steers the glow.
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.12);
    y.set((e.clientY - r.top - r.height / 2) * 0.12);
  }

  return (
    <section id="top" onPointerMove={onPointerMove} className="relative overflow-hidden">
      <m.div
        aria-hidden="true"
        style={{ x, y }}
        className="pointer-events-none absolute right-[-10%] top-[8%] size-[34rem] rounded-full bg-[radial-gradient(circle,rgba(255,179,71,0.22),transparent_65%)] lg:right-[2%]"
      />
      <div className="section-wrap relative grid items-center gap-10 py-14 md:min-h-[calc(100svh-4rem)] lg:grid-cols-2 lg:py-10">
        <div>
          <p className="eyebrow motion-safe:animate-[fade-up_0.8s_ease-out_both]">A desk lamp that folds flat</p>
          <h1 className="mt-4 font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
            <span className="block overflow-hidden pb-2">
              <span className="block motion-safe:animate-[rise_0.9s_cubic-bezier(0.2,0.7,0.2,1)_0.1s_both]">Light that</span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="block text-amber motion-safe:animate-[rise_0.9s_cubic-bezier(0.2,0.7,0.2,1)_0.25s_both]">folds away.</span>
            </span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-mist motion-safe:animate-[fade-up_0.8s_ease-out_0.5s_both]">
            Lumenfold is a made-up desk lamp: 1,200 lumens, a 24 mm fold and a beam that warms and cools with the hour.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 motion-safe:animate-[fade-up_0.8s_ease-out_0.65s_both]">
            <a href="#day" className="btn-primary">
              See the day cycle
            </a>
            <a href="#finish" className="btn-secondary">
              Pick a finish
            </a>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
          <Lamp intro className="h-auto w-full" />
        </div>
      </div>
    </section>
  );
}
