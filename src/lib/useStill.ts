import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

// The media half of the `still` variant in globals.css.
const QUERY = "(prefers-reduced-motion: reduce), (max-height: 520px)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * True when a pinned scene should not be pinned or scrubbed: reduced motion, a window too short for
 * it, or (measured) its panel is clipping its own content, which happens when someone applies their
 * own text spacing or a much larger font. `panel` is the pinned (overflow-hidden) box.
 */
export function useStill(panel: RefObject<HTMLElement | null>) {
  const media = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
  const [clipped, setClipped] = useState(false);

  // Once clipping is seen, stay stacked until the window's width changes (resize, phone turned).
  // Width only: a phone's height changes every time its address bar slides away.
  useEffect(() => {
    let width = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      setClipped(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Measure only while pinned: a stacked panel has no fixed height to overflow.
  useEffect(() => {
    const el = panel.current;
    if (media || clipped || !el) return;
    const check = () => {
      if (el.scrollHeight > el.clientHeight + 1) setClipped(true);
    };
    const ro = new ResizeObserver(check);
    ro.observe(el);
    el.querySelectorAll("h2, ol, p").forEach((n) => ro.observe(n)); // text blocks grow when spacing or font size grows
    document.fonts.ready.then(check);
    check();
    return () => ro.disconnect();
  }, [panel, media, clipped]);

  return media || clipped;
}
