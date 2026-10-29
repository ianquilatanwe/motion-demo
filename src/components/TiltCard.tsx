"use client";

import { useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";

type Props = Omit<React.ComponentProps<typeof m.li>, "style"> & { children: React.ReactNode };

/**
 * A card that leans toward a mouse (up to 8°) with a soft highlight that follows it. The lean is
 * two springs feeding rotateX and rotateY, and the highlight is a gradient whose centre is
 * rebuilt from the pointer position, so React never re-renders while you move.
 * Touch, pen and reduced motion get a plain card.
 */
export function TiltCard({ children, className, ...rest }: Props) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5); // pointer position inside the card, 0 to 1
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 200, damping: 22 });
  const sy = useSpring(py, { stiffness: 200, damping: 22 });
  const rotateY = useTransform(sx, [0, 1], [-8, 8]);
  const rotateX = useTransform(sy, [0, 1], [8, -8]);
  const glare = useMotionTemplate`radial-gradient(circle at ${useTransform(sx, (v) => v * 100)}% ${useTransform(sy, (v) => v * 100)}%, rgba(255,217,160,0.16), transparent 55%)`;
  const glow = useMotionValue(0);
  const glowSpring = useSpring(glow, { stiffness: 160, damping: 24 });

  function onPointerMove(e: React.PointerEvent<HTMLLIElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    glow.set(1);
  }

  function onPointerLeave() {
    px.set(0.5);
    py.set(0.5);
    glow.set(0);
  }

  return (
    <m.li {...rest} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} style={{ rotateX, rotateY, transformPerspective: 900 }} className={`relative ${className ?? ""}`}>
      <m.span aria-hidden="true" style={{ background: glare, opacity: glowSpring }} className="pointer-events-none absolute inset-0 rounded-3xl" />
      {children}
    </m.li>
  );
}
