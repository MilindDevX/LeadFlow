import { useState, useEffect } from 'react';

/**
 * Returns a debounced copy of `value` that only updates after
 * `delay` milliseconds of inactivity. Used for search inputs.
 */
export const useDebounce = <T>(value: T, delay = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
