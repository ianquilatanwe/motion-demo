import { useSyncExternalStore } from "react";

// Same condition as the `still` variant in globals.css.
const QUERY = "(prefers-reduced-motion: reduce), (max-height: 520px)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** True when the pinned scenes should not be pinned or scrubbed: reduced motion, or a window too short for them. */
export function useStill() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
