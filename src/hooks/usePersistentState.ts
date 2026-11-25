import { useEffect, useState } from 'react';

/** useState backed by localStorage; `parse` validates the stored string. */
export function usePersistentState<T extends string>(
  key: string,
  fallback: () => T,
  parse: (raw: string | null) => T | null,
): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      return parse(localStorage.getItem(key)) ?? fallback();
    } catch {
      return fallback();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // storage unavailable — ignore
    }
  }, [key, value]);

  return [value, setValue];
}
