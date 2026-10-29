/**
 * Geometry and joint maths for the lamp rig. Every shape in Lamp.tsx is drawn in the open pose;
 * the three joints (shoulder, elbow, wrist) rotate it. Keeping the numbers here means the lamp,
 * the CSS intro and the fold scene's height read-out all agree.
 */
type Pt = { x: number; y: number };

export const VIEW = { w: 400, h: 370 };
export const FLOOR = 348; // underside of the base
export const BASE: Pt = { x: 200, y: 324 }; // shoulder: where the lower arm meets the base
export const ELBOW: Pt = { x: 159, y: 190 };
export const WRIST: Pt = { x: 225, y: 66 };

// How far each joint turns when folded flat (degrees, clockwise), measured against the open pose:
// the lower arm lies along the base pointing left, the upper arm doubles back over it, and the head
// turns back to hang level so it sits on the base. The CSS keyframes unfold-1/2/3 repeat these numbers.
export const FOLD = { shoulder: -73, elbow: 132, wrist: -59 };

/** Corners of the lamp head in the open pose. */
const HEAD: Pt[] = [
  { x: 191, y: 40 },
  { x: 259, y: 40 },
  { x: 287, y: 98 },
  { x: 163, y: 98 },
];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** 0 → 1 as `open` moves from `from` to `to`, so each joint starts and stops at its own moment. */
const stage = (open: number, from: number, to: number) => clamp01((open - from) / (to - from));

/** Joint angles in degrees for a given openness (0 folded, 1 open). The shoulder moves first, the head last. */
export function poseAngles(open: number, tilt = 0, aim = 0): [number, number, number] {
  return [
    (1 - stage(open, 0, 0.6)) * FOLD.shoulder,
    (1 - stage(open, 0.15, 0.8)) * FOLD.elbow + tilt,
    (1 - stage(open, 0.35, 1)) * FOLD.wrist + aim,
  ];
}

const rotate = (p: Pt, about: Pt, deg: number): Pt => {
  const r = (deg * Math.PI) / 180;
  const dx = p.x - about.x;
  const dy = p.y - about.y;
  return { x: about.x + dx * Math.cos(r) - dy * Math.sin(r), y: about.y + dx * Math.sin(r) + dy * Math.cos(r) };
};

/** The highest point of the lamp (smallest y, in viewBox units) at a given openness. */
export function lampTop(open: number): number {
  const [a1, a2, a3] = poseAngles(open);
  const up = (p: Pt) => rotate(rotate(p, ELBOW, a2), BASE, a1); // carry a point through elbow, then shoulder
  const wrist = up(WRIST);
  const head = HEAD.map((c) => up(rotate(c, WRIST, a3)));
  return Math.min(up(ELBOW).y, wrist.y, ...head.map((c) => c.y));
}
