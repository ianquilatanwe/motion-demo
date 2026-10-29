"use client";

import { useRef } from "react";
import { useAnimationFrame, useInView, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { parts } from "@/lib/content";

/** A line drawing of the parts in a row, like an exploded view. Decorative; the words are in `Parts`. */
function Drawing() {
  return (
    <svg viewBox="0 0 800 300" aria-hidden="true" className="h-auto w-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 150 H780" strokeDasharray="4 8" opacity="0.5" />
      {/* Cell pack in the base */}
      <rect x="30" y="170" width="150" height="70" rx="14" />
      <rect x="50" y="186" width="90" height="38" rx="6" />
      <path d="M150 196 v18 M158 196 v18" />
      <rect x="168" y="200" width="12" height="10" rx="3" />
      {/* Friction hinge: a disc with ticks */}
      <circle cx="270" cy="150" r="34" />
      <circle cx="270" cy="150" r="14" />
      {Array.from({ length: 12 }, (_, i) => {
        // Rounded: Math.cos can differ in the last digit between Node and the browser, which breaks hydration.
        const [c, s] = [Math.cos((i * Math.PI) / 6), Math.sin((i * Math.PI) / 6)];
        const pt = (r: number) => `${(270 + c * r).toFixed(1)} ${(150 + s * r).toFixed(1)}`;
        return <path key={i} d={`M${pt(34)} L${pt(42)}`} />;
      })}
      {/* Two arms */}
      <path d="M330 190 L430 90 M342 202 L442 102 M330 190 l12 12" />
      <path d="M470 130 L560 84 M476 142 L566 96 M470 130 l6 12" />
      <circle cx="450" cy="116" r="8" />
      {/* Head and LED ring */}
      <path d="M610 60 H690 L720 130 H580 Z" />
      <ellipse cx="650" cy="130" rx="70" ry="10" />
      <ellipse cx="650" cy="130" rx="46" ry="6" strokeDasharray="2 6" />
      <path d="M600 200 L650 160 L700 200 M650 160 V250" strokeDasharray="3 6" opacity="0.5" />
      <circle cx="650" cy="250" r="3" fill="currentColor" />
    </svg>
  );
}

function Parts() {
  return (
    <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {parts.map((p, i) => (
        <li key={p.title}>
          <p className="font-mono text-sm text-amber">0{i + 1}</p>
          <h3 className="mt-1 font-display text-xl font-bold">{p.title}</h3>
          <p className="mt-2 text-mist">{p.text}</p>
        </li>
      ))}
    </ul>
  );
}

/**
 * "Under the hood": the drawing sits in the dark and a circle of light reveals it. A mouse steers
 * the light. Without one (touch, keyboard) the light wanders on its own, so the drawing is never
 * hidden behind a hover. With reduced motion there is no dark layer at all. The words are plain text.
 */
export function Blueprint() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const steered = useRef(false);
  const x = useMotionValue(50);
  const y = useMotionValue(50);
  const sx = useSpring(x, { stiffness: 110, damping: 20 });
  const sy = useSpring(y, { stiffness: 110, damping: 20 });
  // min() keeps the beam of light from swallowing a phone-sized panel.
  const light = useMotionTemplate`radial-gradient(circle min(260px, 55vw) at ${sx}% ${sy}%, #000 0%, rgba(0,0,0,0.9) 40%, transparent 100%)`;

  useAnimationFrame((t) => {
    if (reduce || !inView || steered.current) return;
    x.set(50 + 40 * Math.sin(t / 2300));
    y.set(50 + 32 * Math.sin(t / 1500 + 1));
  });

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    steered.current = true;
    x.set(((e.clientX - r.left) / r.width) * 100);
    y.set(((e.clientY - r.top) / r.height) * 100);
  }

  return (
    <section id="inside" aria-labelledby="inside-title" className="py-20 md:py-28">
      <div className="section-wrap">
        <p className="eyebrow">Under the hood</p>
        <h2 id="inside-title" className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">
          Four parts, one light
        </h2>
        <div className="mt-10 overflow-hidden rounded-3xl border border-edge bg-deep p-6 sm:p-10">
          {/* Only the drawing sits in the dark. The part descriptions stay at full contrast so no one needs the light to read them. */}
          <div ref={ref} onPointerMove={onPointerMove} onPointerLeave={() => (steered.current = false)} className="relative" aria-hidden="true">
            <div className="select-none text-cream opacity-[0.14] motion-reduce:hidden">
              <Drawing />
            </div>
            <m.div
              style={{ maskImage: light, WebkitMaskImage: light }}
              className="absolute inset-0 text-amber-soft motion-reduce:static motion-reduce:[-webkit-mask-image:none]! motion-reduce:[mask-image:none]!"
            >
              <Drawing />
            </m.div>
          </div>
          <Parts />
        </div>
      </div>
    </section>
  );
}
