import { useState, useCallback, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue(prev => {
        const newValue = value instanceof Function ? value(prev) : value;
        localStorage.setItem(key, JSON.stringify(newValue));
        return newValue;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}

export function useRecentSearches(maxItems = 8) {
  const [searches, setSearches] = useLocalStorage<string[]>('ss-recent-searches', []);

  const addSearch = useCallback(
    (query: string) => {
      if (!query.trim()) return;
      setSearches(prev => {
        const filtered = prev.filter(s => s !== query);
        return [query, ...filtered].slice(0, maxItems);
      });
    },
    [setSearches, maxItems]
  );

  const clearSearches = useCallback(() => {
    setSearches([]);
  }, [setSearches]);

  return { searches, addSearch, clearSearches };
}
