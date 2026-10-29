"use client";

import { useId } from "react";
import * as m from "motion/react-m";
import { useTransform, type MotionValue } from "motion/react";
import { BASE, ELBOW, VIEW, WRIST, poseAngles } from "@/lib/lampPose";

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
  /** 0 = folded flat into the base, 1 = fully open. The three joints move one after another. */
  open?: Num;
  /** Extra tilt of the upper arm and head around the elbow, in degrees. */
  tilt?: Num;
  /** Extra turn of the head around the wrist, in degrees. The hero uses it to aim at the mouse. */
  aim?: Num;
  /** Drift a few specks of dust through the beam (CSS only). */
  motes?: boolean;
  /** Unfold from flat and fade the light in with CSS when the page loads (no JavaScript needed). */
  intro?: boolean;
  className?: string;
};

const OUTLINE = "#6b6678";
const AMBER = "#ffb347";

const val = (v: Num) => (typeof v === "number" ? v : v.get());

/** The joint's rotation, with its pivot given as a share of the viewBox (transform-box: view-box). */
const joint = (rotate: MotionValue<number>, at: { x: number; y: number }) => ({
  rotate,
  transformBox: "view-box" as const,
  originX: at.x / VIEW.w,
  originY: at.y / VIEW.h,
});

type RigProps = {
  angles: [MotionValue<number>, MotionValue<number>, MotionValue<number>];
  classes?: [string?, string?, string?];
  l1?: React.ReactNode;
  l2?: React.ReactNode;
  l3?: React.ReactNode;
};

/** Three nested groups = forward kinematics: turning the shoulder carries the elbow and head along. */
function Rig({ angles, classes = [], l1, l2, l3 }: RigProps) {
  return (
    <m.g style={joint(angles[0], BASE)} className={classes[0]}>
      {l1}
      <m.g style={joint(angles[1], ELBOW)} className={classes[1]}>
        {l2}
        <m.g style={joint(angles[2], WRIST)} className={classes[2]}>
          {l3}
        </m.g>
      </m.g>
    </m.g>
  );
}

/** One arm segment: an outline stroke with the body colour on top. */
function Tube({ from, to, body }: { from: { x: number; y: number }; to: { x: number; y: number }; body: string }) {
  const d = `M${from.x} ${from.y} L${to.x} ${to.y}`;
  return (
    <>
      <path d={d} fill="none" stroke={OUTLINE} strokeWidth={18} strokeLinecap="round" />
      <m.path d={d} fill="none" strokeWidth={14} strokeLinecap="round" initial={false} animate={{ stroke: body }} />
    </>
  );
}

// Dust specks sit inside the cone of light. Fixed numbers (no Math.random) so server and browser agree.
const MOTES = Array.from({ length: 16 }, (_, i) => {
  const t = ((i * 7) % 16) / 16; // how far down the beam, 0 to 1
  const u = (((i * 11) % 13) + 0.5) / 13; // across the beam, 0 to 1
  const left = 171 - 96 * t;
  const right = 279 + 96 * t;
  return { cx: left + u * (right - left), cy: 112 + t * 220, r: 1.2 + (i % 3) * 0.7, dx: ((i % 5) - 2) * 7, dur: 5 + (i % 6), delay: -(i * 0.9) };
});

/** The lamp, drawn as an SVG so it needs no image files and scales without blur. */
export function Lamp({ body = "#4a4655", beam = 1, reach = 1, cool = 0, open = 1, tilt = 0, aim = 0, motes = false, intro = false, className }: Props) {
  const id = useId();
  const introClass = intro ? "motion-safe:animate-[beam-on_1.4s_ease-out_1.5s_both]" : undefined;
  // `backwards` fill: the folded pose shows during the delay, and afterwards the real value (open) takes over.
  // Written out in full because Tailwind only generates classes it can find as whole strings.
  const unfold = [
    "motion-safe:animate-[unfold-1_1.5s_cubic-bezier(0.3,0.7,0.2,1)_0.2s_backwards]",
    "motion-safe:animate-[unfold-2_1.5s_cubic-bezier(0.3,0.7,0.2,1)_0.45s_backwards]",
    "motion-safe:animate-[unfold-3_1.5s_cubic-bezier(0.3,0.7,0.2,1)_0.7s_backwards]",
  ];

  // Each joint has its own slice of the 0 → 1 range: shoulder first, head last.
  const shoulder = useTransform(() => poseAngles(val(open))[0]);
  const elbow = useTransform(() => poseAngles(val(open), val(tilt))[1]);
  const wrist = useTransform(() => poseAngles(val(open), 0, val(aim))[2]);
  const angles: RigProps["angles"] = [shoulder, elbow, wrist];
  const classes: RigProps["classes"] = intro ? [unfold[0], unfold[1], unfold[2]] : [];

  const cone = "171,98 279,98 375,348 75,348";
  const coneOrigin = { transformBox: "view-box" as const, originX: WRIST.x / VIEW.w, originY: 98 / VIEW.h };

  return (
    <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} aria-hidden="true" className={className} style={{ overflow: "visible" }}>
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

      <ellipse cx="200" cy="350" rx="160" ry="9" fill="#000" opacity="0.5" />
      <m.ellipse cx="225" cy="346" rx="170" ry="20" fill={`url(#${id}-pool)`} style={{ opacity: beam }} className={introClass} />

      {/* Light first, so every arm segment is drawn over it. */}
      <Rig
        angles={angles}
        classes={classes}
        l3={
          <>
            <m.polygon points={cone} fill={`url(#${id}-beam)`} style={{ opacity: beam, scaleY: reach, ...coneOrigin }} className={introClass} />
            <m.polygon points={cone} fill={`url(#${id}-cool)`} style={{ opacity: cool, scaleY: reach, ...coneOrigin }} />
            {motes && (
              <m.g style={{ opacity: beam }} className="motion-reduce:hidden">
                {MOTES.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.cx}
                    cy={p.cy}
                    r={p.r}
                    fill="#ffe3b3"
                    className="motion-safe:animate-[mote_var(--dur)_ease-in-out_var(--delay)_infinite] opacity-0"
                    style={{ "--dx": `${p.dx}px`, "--dur": `${p.dur}s`, "--delay": `${p.delay}s` } as React.CSSProperties}
                  />
                ))}
              </m.g>
            )}
          </>
        }
      />

      <m.rect x="54" y="324" width="292" height="24" rx="12" strokeWidth="1.5" stroke={OUTLINE} initial={false} animate={{ fill: body }} />

      <Rig
        angles={angles}
        classes={classes}
        l1={
          <>
            <Tube from={BASE} to={ELBOW} body={body} />
            <circle cx={BASE.x} cy={BASE.y} r="9" fill="#1d1a25" stroke={OUTLINE} strokeWidth="2" />
          </>
        }
        l2={
          <>
            <Tube from={ELBOW} to={WRIST} body={body} />
            <circle cx={ELBOW.x} cy={ELBOW.y} r="12" fill={AMBER} stroke="#0c0a11" strokeWidth="3" />
          </>
        }
        l3={
          <>
            <path d="M191 40 L259 40 L287 98 L163 98 Z" fill="#1d1a25" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
            <rect x="171" y="94" width="108" height="8" rx="4" fill="#6b6678" />
            <m.rect x="171" y="94" width="108" height="8" rx="4" fill={AMBER} style={{ opacity: beam }} className={introClass} />
            <circle cx={WRIST.x} cy={WRIST.y} r="12" fill={AMBER} stroke="#0c0a11" strokeWidth="3" />
          </>
        }
      />
    </svg>
  );
}
