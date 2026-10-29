# Lumenfold: motion demo

A one-page launch site for a made-up folding desk lamp, built to show scroll-linked and interaction
animation done properly: smooth, accessible, and light on the page. Nothing is for sale and the
button sends nothing.

**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, and one extra package:
[`motion`](https://motion.dev) (the library formerly called Framer Motion).

## The motion, section by section

| Section | What moves | How |
| --- | --- | --- |
| Hero | Headline lines slide up out of a mask, the lamp **unfolds joint by joint** and lights, dust drifts in the beam, the lamp head **turns to aim at a mouse**, the glow drifts after it | Plain CSS keyframes (they run before any JavaScript, so the headline paints at once); aim and glow are `motion` springs |
| Spec band | Big type drifts sideways; scroll speed speeds it up, reverses it and skews it | `useVelocity` + `useAnimationFrame`, two copies so the wrap is invisible; paused off-screen |
| The day (pinned) | Dusk sky fades to night, the beam widens and turns from amber toward white, the arm sweeps, captions cross-fade | Scroll position (`useScroll`) drives opacity, scale and rotate |
| Fold (pinned) | The lamp folds flat one joint at a time, a measuring line follows its highest point, the height counts 420 → 78 mm, a pocket outline draws itself | Scroll drives an articulated SVG rig (three nested rotations); the height comes from the same joint maths (`src/lib/lampPose.ts`) |
| Features | Cards rise in once, lean toward a mouse with a moving highlight, numbers count up | `whileInView`; springs into `rotateX/Y`; the counter is a 10-line `requestAnimationFrame` loop |
| Under the hood | A circle of light reveals a line drawing; a mouse steers it, otherwise it wanders on its own | `useMotionTemplate` builds a `mask-image` from two springs, so React never re-renders |
| Finish picker | Selection ring slides between swatches, the lamp fades to the new colour, the section's colour wash spreads out from the swatch you picked | `layoutId`, `AnimatePresence`, animated circular `clip-path` |
| Closing | Button leans toward a mouse; the footer lamp switches off as it scrolls in; a cord down the right edge fills with the page | Springs and scroll progress |

Mostly `transform` and `opacity` move. The exceptions are a colour fade on the lamp's SVG body, the
finish wash (`clip-path`, one 0.9 s paint per click) and the flashlight mask, which repaints one panel.

## Accessibility and performance rules this follows

- **Reduced motion:** with `prefers-reduced-motion` the pinned scene is not pinned (CSS), the three
  moments and the three fold steps simply stack as text, the lamp stays open, the entrance animations
  do not run, the spec band stops, the blueprint is fully lit, and the pointer effects are off.
- **Short windows:** a phone held sideways (under 520 px tall) gets the same unpinned, stacked layout as
  reduced motion, because the pinned scenes would clip their content there.
- **Real text and real controls:** all copy is HTML text, the finish picker is a native radio group
  (arrow keys work), the moving counters are hidden from screen readers and the final number is read instead.
- **Light only on hover-capable pointers:** the cursor glow and magnetic button react to a mouse, not touch.
- **Nothing hides behind hover:** the blueprint light wanders by itself, so touch and keyboard users see it all.
- **No flashing:** the lamp fades on; it never flickers.
- **Animation code loads late:** `LazyMotion` fetches the animation features after the page loads.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

All copy is in `src/lib/content.ts`. The lamp is one SVG component (`src/components/Lamp.tsx`), so there are no image files.

## Cost of the animation library

Measured on the production build, compressed transfer:

- Page first-load JS: 140 kB (the empty Next.js shell is 103 kB), so about 37 kB is this page's own
  code plus the animation hooks it imports.
- A further 29 kB animation-features chunk loads after the page's load event.
- The page uses `domMax` rather than the smaller `domAnimation` set only because of the sliding
  selection ring (layout animation). Dropping the ring would allow the smaller set (not measured).

## UI standards check (2026-10-27)

- axe-core 4.10.2 (WCAG 2.2 AA + best practices): 0 violations in 8 states: initial, pinned scene at 10%,
  50% and 95% scroll, features after the count-up, finish picker on "Moss", call-to-action after the click, and
  reduced-motion.
- Keyboard: skip link first, logical order, 3 px amber focus ring on every control including the radio
  swatches; arrow keys change the finish. Targets are at least 44 px (swatches 64 px).
- Widths 320 / 375 / 768 / 1440: no horizontal scroll. The pinned panel clears the sticky header at 375.
- Contrast: cream text on night 15:1, secondary text 9:1, night text on the amber button 12:1.
- Local production build, unthrottled desktop Chromium: LCP about 270 ms, layout shift 0.000, no console
  errors or warnings. `npm run lint` and `npm run build` pass.
- Not checked: a screen-reader pass, scroll frame-rate on a real mid-range phone, throttled-network
  LCP, touch behaviour on a real device.
