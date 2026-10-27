"use client";

import { useState } from "react";
import { useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";

/** Closing call to action. On a mouse the button leans toward the pointer; the demo sends nothing. */
export function Cta() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);
  const x = useSpring(0, { stiffness: 200, damping: 15 });
  const y = useSpring(0, { stiffness: 200, damping: 15 });

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.35);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  }

  function onPointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <section id="reserve" className="py-20 md:py-28">
      <div className="section-wrap text-center">
        <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-6xl">Make the evening yours</h2>
        <p className="mx-auto mt-5 max-w-md text-lg text-mist">This is a portfolio demo, so there is nothing to buy. The button only shows the hover motion.</p>
        {/* The padding gives the pointer a wider area to pull the button toward. */}
        <div onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} className="mx-auto mt-8 inline-block p-8">
          <m.button type="button" style={{ x, y }} onClick={() => setDone(true)} className="btn-primary min-h-14 px-10 text-lg">
            Reserve a Lumenfold
          </m.button>
        </div>
        <p role="status" className="min-h-6 text-amber-soft">
          {done ? "Thanks for trying it. Nothing was saved or sent." : ""}
        </p>
      </div>
    </section>
  );
}
