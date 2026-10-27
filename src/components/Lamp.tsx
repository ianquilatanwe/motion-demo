"use client";

import { useId } from "react";
import * as m from "motion/react-m";
import type { MotionValue } from "motion/react";

type Num = number | MotionValue<number>;

type Props = {
  /** Colour of the lamp body. Changing it fades between the two colours. */
  body?: string;
  /** 0 = off, 1 = fully lit. Drives the beam, the pool of light and the bulb. */
  beam?: Num;
  /** How far the beam reaches down the desk (0.5 – 1). */
  reach?: Num;
  /** 0 = warm amber beam, 1 = cool white beam. Fades a second beam in over the warm one. */
  cool?: Num;
  /** Tilt of the upper arm and head, in degrees. */
  tilt?: Num;
  /** Fade the light in with CSS when the page loads (no JavaScript needed). */
  intro?: boolean;
  className?: string;
};

const OUTLINE = "#6b6678";
const AMBER = "#ffb347";

/** One arm segment: an outline stroke with the body colour on top. */
function Tube({ d, body }: { d: string; body: string }) {
  return (
    <>
      <path d={d} fill="none" stroke={OUTLINE} strokeWidth={18} strokeLinecap="round" />
      <m.path d={d} fill="none" strokeWidth={14} strokeLinecap="round" initial={false} animate={{ stroke: body }} />
    </>
  );
}

/** The lamp, drawn as an SVG so it needs no image files and scales without blur. */
export function Lamp({ body = "#4a4655", beam = 1, reach = 1, cool = 0, tilt = 0, intro = false, className }: Props) {
  const id = useId();
  const introClass = intro ? "motion-safe:animate-[beam-on_1.6s_ease-out_0.5s_both]" : undefined;

  return (
    <svg viewBox="0 0 400 520" aria-hidden="true" className={className} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={AMBER} stopOpacity="0.75" />
          <stop offset="1" stopColor={AMBER} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-cool`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dbe8ff" stopOpacity="0.8" />
          <stop offset="1" stopColor="#dbe8ff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-pool`}>
          <stop offset="0" stopColor={AMBER} stopOpacity="0.55" />
          <stop offset="1" stopColor={AMBER} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="200" cy="490" rx="130" ry="9" fill="#000" opacity="0.5" />
      <m.ellipse cx="225" cy="486" rx="170" ry="20" fill={`url(#${id}-pool)`} style={{ opacity: beam }} className={introClass} />

      <m.rect x="105" y="464" width="190" height="24" rx="12" strokeWidth="1.5" stroke={OUTLINE} initial={false} animate={{ fill: body }} />
      <Tube d="M200 464 L150 300" body={body} />

      {/* Upper arm and head share one group so they tilt together around the elbow. */}
      <m.g style={{ rotate: tilt, transformBox: "view-box", originX: 150 / 400, originY: 300 / 520 }}>
        <m.polygon
          points="176,182 284,182 380,488 80,488"
          fill={`url(#${id}-beam)`}
          style={{ opacity: beam, scaleY: reach, transformBox: "view-box", originX: 230 / 400, originY: 182 / 520 }}
          className={introClass}
        />
        <m.polygon
          points="176,182 284,182 380,488 80,488"
          fill={`url(#${id}-cool)`}
          style={{ opacity: cool, scaleY: reach, transformBox: "view-box", originX: 230 / 400, originY: 182 / 520 }}
        />
        <Tube d="M150 300 L230 150" body={body} />
        <path d="M196 124 L264 124 L292 182 L168 182 Z" fill="#1d1a25" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
        <rect x="176" y="178" width="108" height="8" rx="4" fill="#6b6678" />
        <m.rect x="176" y="178" width="108" height="8" rx="4" fill={AMBER} style={{ opacity: beam }} className={introClass} />
        <circle cx="230" cy="150" r="12" fill={AMBER} stroke="#0c0a11" strokeWidth="3" />
      </m.g>
      <circle cx="150" cy="300" r="14" fill={AMBER} stroke="#0c0a11" strokeWidth="3" />
    </svg>
  );
}
