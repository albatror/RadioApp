import { useSyncExternalStore } from 'react';

const QUERY = '(max-width: 760px)';

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

/** Matches the CSS breakpoint exactly; correct on first render (no desktop flash on mobile). */
export function useIsMobile(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
