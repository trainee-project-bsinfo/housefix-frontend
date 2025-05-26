import { useCallback, useEffect, useState } from "react";

const cache = new Map<string, unknown>();
const cacheListeners = new Map<string, Set<() => void>>();

export const useCache = <VT>(key: string) => {
  const [state, setState] = useState(cache.get(key) as VT);

  const notifyListeners = useCallback(() => {
    cacheListeners.get(key)?.forEach((cb) => cb());
  }, [key]);

  useEffect(() => {
    const keyListeners = cacheListeners.get(key) ?? new Set();
    keyListeners.add(() => setState(cache.get(key) as VT));
    cacheListeners.set(key, keyListeners);

    return () => {
      keyListeners.delete(() => setState(cache.get(key) as VT));
      if (keyListeners.size === 0) {
        cacheListeners.delete(key);
      }
    };
  }, [key]);

  const setValue = useCallback(
    (newValue: VT) => {
      cache.set(key, newValue);
      notifyListeners();
    },
    [key, notifyListeners],
  );

  return { value: state, setValue };
};
