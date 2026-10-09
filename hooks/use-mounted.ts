import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Hook to safely detect client-side hydration without triggering
 * React 19's react-hooks/set-state-in-effect lint rule.
 * Returns false on SSR, and true after client hydration.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
