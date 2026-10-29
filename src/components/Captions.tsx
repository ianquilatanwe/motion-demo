"use client";

import { useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";

// When each of three captions is fully visible, as a share of the scroll through a pinned scene.
const windows = [
  [0, 0.25, 0.38],
  [0.3, 0.42, 0.58, 0.7],
  [0.62, 0.75, 1],
];
const fades = [
  [1, 1, 0],
  [0, 1, 1, 0],
  [0, 1, 1],
];

type Item = { title: React.ReactNode; text: string };

function Caption({ i, item, progress, reduce }: { i: number; item: Item; progress: MotionValue<number>; reduce: boolean }) {
  const opacity = useTransform(progress, windows[i], reduce ? fades[i].map(() => 1) : fades[i]);
  return (
    <m.li style={{ opacity }} className="[grid-area:1/1] motion-reduce:[grid-area:auto]">
      <p className="font-display text-2xl font-bold sm:text-3xl">{item.title}</p>
      <p className="mt-2 max-w-md text-mist sm:text-lg">{item.text}</p>
    </m.li>
  );
}

/**
 * Three captions stacked in one grid cell that cross-fade as `progress` (0 to 1) moves through a
 * pinned scene. With reduced motion they all stay visible and stack as plain text.
 */
export function Captions({ items, progress, reduce }: { items: Item[]; progress: MotionValue<number>; reduce: boolean }) {
  return (
    <ol className="mt-8 grid motion-reduce:gap-8">
      {items.map((item, i) => (
        <Caption key={i} i={i} item={item} progress={progress} reduce={reduce} />
      ))}
    </ol>
  );
}
