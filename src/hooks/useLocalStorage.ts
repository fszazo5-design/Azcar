import { useCallback, useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or unavailable — silent fail
    }
  }, [key, value]);

  const setter = useCallback((v: T | ((prev: T) => T)) => {
    setValue((prev) => (v instanceof Function ? v(prev) : v));
  }, []);

  return [value, setter];
}
