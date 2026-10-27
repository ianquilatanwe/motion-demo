"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Lamp } from "@/components/Lamp";
import { finishes } from "@/lib/content";

/**
 * Finish picker. The radios are real inputs, so arrow keys and screen readers work for free.
 * The ring slides between swatches with a shared-element (layoutId) animation, the lamp fades
 * to the new colour, and the description cross-fades.
 */
export function Finishes() {
  const [index, setIndex] = useState(0);
  const current = finishes[index];

  return (
    <section id="finish" className="py-20 md:py-28">
      <div className="section-wrap grid items-center gap-12 lg:grid-cols-2">
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
                  <input type="radio" name="finish" value={f.name} checked={i === index} onChange={() => setIndex(i)} className="peer sr-only" />
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
