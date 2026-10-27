"use client";

import { useRef } from "react";
import { useReducedMotion, useScroll, useTransform } from "motion/react";
import { Lamp } from "@/components/Lamp";
import { brand } from "@/lib/content";

/** The small lamp in the footer switches off as the footer scrolls into view. */
export function Footer() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const beam = useTransform(scrollYProgress, [0.1, 0.9], reduce ? [1, 1] : [1, 0]);

  return (
    <footer ref={ref} className="border-t border-edge pt-12">
      <div className="section-wrap flex flex-col items-center gap-6 pb-10 text-center">
        <Lamp beam={beam} reach={1} className="h-auto w-32" />
        <p className="font-display text-2xl font-bold">{brand}</p>
        <p className="max-w-md text-sm text-mist">Sample site built as a portfolio demo by Ian Quilatan. Lumenfold is fictional and nothing here is for sale.</p>
      </div>
    </footer>
  );
}
