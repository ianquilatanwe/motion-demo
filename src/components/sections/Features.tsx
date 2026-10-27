"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { features } from "@/lib/content";

/** Counts from 0 to `to` once, when it scrolls into view. A plain requestAnimationFrame loop, so it adds no library weight. */
function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const final = to.toLocaleString("en-US");

  useEffect(() => {
    const el = ref.current;
    if (!inView || reduce || !el) return;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min((now - start) / 1400, 1);
      el.textContent = Math.round(to * (1 - (1 - t) ** 3)).toLocaleString("en-US");
      if (t < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, to]);

  // The moving number is hidden from screen readers; they read the final value instead.
  return (
    <>
      <span ref={ref} aria-hidden="true">
        {final}
      </span>
      <span className="sr-only">{final}</span>
    </>
  );
}

/** Three feature cards that rise into place once as they enter, with numbers that count up. */
export function Features() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="section-wrap">
        <p className="eyebrow">Built to disappear</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">Three numbers to remember</h2>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <m.li
              key={f.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.2, 0.7, 0.2, 1] }}
              className="rounded-3xl border border-edge bg-deep p-7"
            >
              <p className="font-display text-6xl font-bold text-amber">
                <CountUp to={f.value} />
              </p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-mist">{f.unit}</p>
              <h3 className="mt-6 font-display text-xl font-bold">{f.title}</h3>
              <p className="mt-2 text-mist">{f.text}</p>
            </m.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
