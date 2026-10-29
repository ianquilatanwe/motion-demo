"use client";

import { useRef, useState } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { Lamp } from "@/components/Lamp";
import { finishes } from "@/lib/content";

/** A soft wash of the finish colour, brightest at the top of the section. */
const tint = (body: string) => `radial-gradient(ellipse 80% 70% at 50% 0%, color-mix(in oklab, ${body} 38%, transparent), transparent 80%)`;

/** What the last pick started: where it was clicked, how far the wash must grow, and the colour it brings. */
type Wipe = { id: number; x: number; y: number; radius: number; body: string };

/**
 * Finish picker. The radios are real inputs, so arrow keys and screen readers work for free.
 * The ring slides between swatches with a shared-element (layoutId) animation, the lamp fades
 * to the new colour, the description cross-fades, and the section's colour wash spreads outward
 * from the swatch you picked (a growing circular clip-path).
 */
export function Finishes() {
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [settled, setSettled] = useState(finishes[0].body); // the wash that fills the section once a wipe has finished
  const [wipe, setWipe] = useState<Wipe | null>(null);
  const current = finishes[index];

  function pick(i: number, label: HTMLLabelElement) {
    setIndex(i);
    if (wipe) setSettled(wipe.body); // a pick made mid-wipe: lock in the previous colour so it can't flash back
    const body = finishes[i].body;
    const s = section.current?.getBoundingClientRect();
    if (reduce || !s) return setSettled(body);
    const r = label.getBoundingClientRect();
    const x = r.left + r.width / 2 - s.left;
    const y = r.top + r.height / 2 - s.top;
    // Far enough to reach the farthest corner, so the circle always covers the whole section.
    const radius = Math.hypot(Math.max(x, s.width - x), Math.max(y, s.height - y));
    setWipe((w) => ({ id: (w?.id ?? 0) + 1, x, y, radius, body }));
  }

  return (
    <section id="finish" ref={section} className="relative overflow-hidden py-20 md:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 transition-none" style={{ background: tint(settled) }} />
      {wipe && (
        <m.div
          key={wipe.id}
          aria-hidden="true"
          initial={{ clipPath: `circle(0px at ${wipe.x}px ${wipe.y}px)` }}
          animate={{ clipPath: `circle(${wipe.radius}px at ${wipe.x}px ${wipe.y}px)` }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
          onAnimationComplete={() => setSettled(wipe.body)}
          className="pointer-events-none absolute inset-0"
          style={{ background: tint(wipe.body) }}
        />
      )}
      <div className="section-wrap relative grid items-center gap-12 lg:grid-cols-2">
        <div className="mx-auto w-full max-w-xs lg:order-2 lg:max-w-sm">
          <Lamp body={current.body} className="h-auto w-full" />
        </div>
        <div>
          <p className="eyebrow">Three finishes</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">Pick a finish</h2>
          <fieldset className="mt-8">
            <legend className="sr-only">Finish</legend>
            <div className="flex flex-wrap gap-6">
              {finishes.map((f, i) => (
                <label key={f.name} className="flex cursor-pointer flex-col items-center gap-2">
                  <input type="radio" name="finish" value={f.name} checked={i === index} onChange={(e) => pick(i, e.currentTarget.closest("label")!)} className="peer sr-only" />
                  <span className="relative grid size-16 place-items-center rounded-full peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-4 peer-focus-visible:outline-amber">
                    <span className="size-11 rounded-full border border-white/25" style={{ background: f.body }} />
                    {i === index && (
                      <m.span layoutId="finish-ring" transition={{ type: "spring", stiffness: 420, damping: 32 }} className="absolute inset-0 rounded-full border-2 border-amber" />
                    )}
                  </span>
                  <span className="text-sm font-medium text-mist peer-checked:text-cream">{f.name}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div aria-live="polite" className="mt-8 min-h-24">
            <AnimatePresence mode="wait" initial={false}>
              <m.div key={current.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                <p className="font-display text-2xl font-bold">{current.name}</p>
                <p className="mt-2 max-w-md text-mist sm:text-lg">{current.text}</p>
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
