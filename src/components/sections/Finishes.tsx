"use client";

import { useRef, useState } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { Lamp } from "@/components/Lamp";
import { finishes } from "@/lib/content";

/** A soft wash of the finish colour, brightest at the top of the section. */
const tint = (body: string) => `radial-gradient(ellipse 80% 70% at 50% 0%, color-mix(in oklab, ${body} 38%, transparent), transparent 80%)`;
/** The same colour as a flat disc, for the spreading circle. */
const disc = (body: string) => `color-mix(in oklab, ${body} 16%, transparent)`;

/** What the last pick started: where it was clicked, how far the wash must grow, and the colour it brings. */
type Wipe = { id: number; x: number; y: number; radius: number; body: string };

/**
 * Finish picker. The radios are real inputs, so arrow keys and screen readers work for free.
 * The ring slides between swatches with a shared-element (layoutId) animation, the lamp fades
 * to the new colour, the description cross-fades, and the section's colour wash spreads outward
 * from the swatch you picked: a disc that scales up from the swatch to cover the section, then
 * cross-fades into the soft wash. Only transform and opacity move.
 */
export function Finishes() {
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const latest = useRef(0); // id of the newest wipe, so a superseded wipe can't settle the colour
  const [index, setIndex] = useState(0);
  const [settled, setSettled] = useState(finishes[0].body); // the soft wash that fills the section
  const [wipe, setWipe] = useState<Wipe | null>(null);
  const current = finishes[index];

  function pick(i: number, label: HTMLLabelElement) {
    setIndex(i);
    const body = finishes[i].body;
    const s = section.current?.getBoundingClientRect();
    if (reduce || !s) return setSettled(body);
    const r = label.getBoundingClientRect();
    const x = r.left + r.width / 2 - s.left;
    const y = r.top + r.height / 2 - s.top;
    // Far enough to reach the farthest corner, so the disc always covers the whole section.
    const radius = Math.hypot(Math.max(x, s.width - x), Math.max(y, s.height - y));
    const id = ++latest.current;
    setWipe({ id, x, y, radius, body });
  }

  function settle(w: Wipe) {
    if (latest.current !== w.id) return;
    setSettled(w.body);
    setWipe(null);
  }

  return (
    <section id="finish" ref={section} className="relative overflow-hidden py-20 md:py-28">
      <AnimatePresence initial={false}>
        <m.div key={settled} aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="pointer-events-none absolute inset-0" style={{ background: tint(settled) }} />
      </AnimatePresence>
      <AnimatePresence>
        {wipe && (
          <m.div
            key={wipe.id}
            aria-hidden="true"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
            onAnimationComplete={() => settle(wipe)}
            className="pointer-events-none absolute rounded-full"
            style={{ left: wipe.x - wipe.radius, top: wipe.y - wipe.radius, width: wipe.radius * 2, height: wipe.radius * 2, background: disc(wipe.body) }}
          />
        )}
      </AnimatePresence>
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
