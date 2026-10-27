# Lumenfold: motion demo

A one-page launch site for a made-up folding desk lamp, built to show scroll-linked and interaction
animation done properly: smooth, accessible, and light on the page. Nothing is for sale and the
button sends nothing.

**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, and one extra package:
[`motion`](https://motion.dev) (the library formerly called Framer Motion).

## The motion, section by section

| Section | What moves | How |
| --- | --- | --- |
| Hero | Headline lines slide up out of a mask, the lamp warms up, the glow drifts after a mouse | Plain CSS keyframes (they run before any JavaScript, so the headline paints at once); the glow is `motion` |
| The day (pinned) | Dusk sky fades to night, the beam widens and turns from amber toward white, the arm sweeps, captions cross-fade | Scroll position (`useScroll`) drives opacity, scale and rotate |
| Features | Cards rise in once, numbers count up | `whileInView`; the counter is a 10-line `requestAnimationFrame` loop |
| Finish picker | Selection ring slides between swatches, the lamp fades to the new colour, the text cross-fades | Shared-element animation (`layoutId`), `AnimatePresence` |
| Closing | Button leans toward a mouse; the footer lamp switches off as it scrolls in | Springs and scroll progress |

Only `transform` and `opacity` move (plus a colour fade on the lamp's SVG body in the finish picker).

## Accessibility and performance rules this follows

- **Reduced motion:** with `prefers-reduced-motion` the pinned scene is not pinned (CSS), the three
  moments simply stack as text, the entrance animations do not run, and the pointer effects are off.
- **Real text and real controls:** all copy is HTML text, the finish picker is a native radio group
  (arrow keys work), the moving counters are hidden from screen readers and the final number is read instead.
- **Light only on hover-capable pointers:** the cursor glow and magnetic button react to a mouse, not touch.
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

- Page first-load JS: 135 kB (a plain Next.js page here is 103 kB), so about 32 kB for the page's
  animation code plus the hooks it uses.
- A further 29 kB animation-features chunk loads after the page's load event.
- The page uses `domMax` rather than the smaller `domAnimation` set only because of the sliding
  selection ring (layout animation). Without the ring, about 10 kB could be saved.

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
