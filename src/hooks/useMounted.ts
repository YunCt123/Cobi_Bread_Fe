import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * React 19 hydration-safe mounted check without useEffect + setState cascading renders.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
