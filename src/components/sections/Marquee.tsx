"use client";

import { useRef } from "react";
import { useAnimationFrame, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity, wrap } from "motion/react";
import * as m from "motion/react-m";

const words = ["1,200 lumens", "2700–5000 K", "14 hours", "78 mm folded", "USB‑C"];

const SPEED = 4; // percent of one copy per second when you are not scrolling

/**
 * A band of big type that drifts sideways on its own. Scroll speed adds to it: scroll down and it
 * speeds up, scroll up and it reverses, and the band leans (skews) with the velocity.
 * The track holds two identical copies, so wrapping from -50% back to 0% is invisible.
 */
export function Marquee() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref); // only spend frames while the band is on screen
  const base = useMotionValue(0);
  const direction = useRef(1);

  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-1500, 0, 1500], [-5, 0, 5], { clamp: false });
  const skew = useTransform(velocity, [-2000, 2000], reduce ? [0, 0] : [-9, 9]);
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return;
    if (boost.get() < -0.05) direction.current = -1;
    else if (boost.get() > 0.05) direction.current = 1;
    const step = direction.current * -SPEED * (delta / 1000);
    base.set(base.get() + step + step * Math.abs(boost.get()));
  });

  const copy = (
    <ul className="flex shrink-0 items-center">
      {words.map((w, i) => (
        <li key={w} className="flex items-center whitespace-nowrap px-6 font-display text-6xl font-bold uppercase tracking-tight sm:text-8xl">
          <span className={i % 2 ? "text-amber" : "text-cream/90"}>{w}</span>
          <span className="ml-12 text-3xl text-amber-soft sm:text-5xl">✺</span>
        </li>
      ))}
    </ul>
  );

  return (
    // Decorative repeat of facts that are already in the page as real text.
    <div ref={ref} aria-hidden="true" className="overflow-hidden border-y border-edge py-6">
      <m.div style={{ skewX: skew }} className="origin-center">
        <m.div style={{ x }} className="flex w-max">
          {copy}
          {copy}
        </m.div>
      </m.div>
    </div>
  );
}
